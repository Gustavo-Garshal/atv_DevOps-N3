'use strict';

/**
 * loja-api — API de exemplo para as aulas de DevOps & Cloud Computing.
 *
 * Três peças conversando:
 *   - Node.js (esta aplicação, Express)
 *   - MySQL   (fonte da verdade: categorias e produtos)
 *   - Redis   (cache de leitura + contador de visitas)
 *
 * Tudo que muda entre ambientes (Compose, Kubernetes, máquina local)
 * entra por VARIÁVEL DE AMBIENTE — nada de endereço fixo no código.
 */

const os = require('os');
const crypto = require('crypto');
const express = require('express');
const mysql = require('mysql2/promise');
const { createClient } = require('redis');

// ---------------------------------------------------------------- configuração
const PORT = Number(process.env.PORT || 3000);
const APP_VERSION = process.env.APP_VERSION || 'dev';
const POD = process.env.HOSTNAME || os.hostname(); // no Kubernetes = nome do Pod
const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS || 30);
const CACHE_KEY_PRODUTOS = 'loja:produtos:todos';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'loja',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'loja',
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 5000,
};
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// ---------------------------------------------------------------- conexões
// O pool do MySQL conecta "sob demanda": a aplicação SOBE mesmo que o banco
// ainda não esteja pronto. Quem diz se ela já pode receber tráfego é o /ready.
const pool = mysql.createPool(dbConfig);

const redis = createClient({
  url: REDIS_URL,
  socket: { reconnectStrategy: (tentativas) => Math.min(tentativas * 200, 2000) },
});
let ultimoErroRedis = 0;
redis.on('error', (err) => {
  // Log com limite de frequência para não inundar o terminal enquanto o Redis está fora.
  const agora = Date.now();
  if (agora - ultimoErroRedis > 5000) {
    ultimoErroRedis = agora;
    console.error(`[redis] ${err.code || err.message}`);
  }
});
redis.connect().catch(() => { /* a reconexão automática continua tentando */ });

// ---------------------------------------------------------------- aplicação
const app = express();
app.use(express.json());

// Log simples de cada requisição — é o que aparece em "docker logs" / "kubectl logs".
app.use((req, res, next) => {
  const inicio = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - inicio) / 1e6;
    if (req.path !== '/health' && req.path !== '/ready') {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms pod=${POD}`);
    }
  });
  next();
});

// Quem respondeu? (útil para ver balanceamento, rolling update, canary...)
app.get('/', (req, res) => {
  res.json({ servico: 'loja-api', versao: APP_VERSION, pod: POD, comentario: 'Nova versão ta rodando top' });
});

// LIVENESS — "o processo está vivo?". Não olha dependências de propósito:
// se o MySQL cair, reiniciar a API não resolve nada.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// READINESS — "posso receber tráfego?". Sem banco, a API não serve.
// Redis é só cache: se estiver fora, a API continua pronta (mais lenta).
app.get('/ready', async (req, res) => {
  const estado = { db: 'ok', redis: redis.isReady ? 'ok' : 'indisponivel' };
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    estado.db = 'falha';
    return res.status(503).json(estado);
  }
  res.json(estado);
});

app.get('/categorias', async (req, res) => {
  const [linhas] = await pool.query('SELECT id, nome, descricao, ativo, criado_em FROM categorias ORDER BY id');
  res.json({ pod: POD, versao: APP_VERSION, total: linhas.length, dados: linhas });
});

// Padrão "cache-aside": tenta o Redis; se não achar, vai no MySQL e guarda no Redis.
app.get('/produtos', async (req, res) => {
  if (redis.isReady) {
    try {
      const emCache = await redis.get(CACHE_KEY_PRODUTOS);
      if (emCache) {
        const dados = JSON.parse(emCache);
        return res.json({ origem: 'cache', pod: POD, versao: APP_VERSION, total: dados.length, dados });
      }
    } catch (err) {
      console.error(`[redis] leitura falhou: ${err.message}`);
    }
  }

  const [dados] = await pool.query(
    `SELECT p.id, p.nome, p.preco, p.quantidade_estoque, c.nome AS categoria
       FROM produtos p
       JOIN categorias c ON c.id = p.categoria_id
      ORDER BY p.id`
  );

  if (redis.isReady) {
    redis.set(CACHE_KEY_PRODUTOS, JSON.stringify(dados), { EX: CACHE_TTL })
      .catch((err) => console.error(`[redis] escrita falhou: ${err.message}`));
  }
  res.json({ origem: 'mysql', pod: POD, versao: APP_VERSION, total: dados.length, dados });
});

// Escrita: grava no MySQL e INVALIDA o cache (senão a lista ficaria desatualizada).
app.post('/produtos', async (req, res) => {
  const { nome, preco, quantidade_estoque = 0, categoria_id } = req.body || {};
  if (!nome || preco === undefined || !categoria_id) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, preco, categoria_id' });
  }
  let resultado;
  try {
    [resultado] = await pool.query(
      'INSERT INTO produtos (nome, preco, quantidade_estoque, categoria_id) VALUES (?, ?, ?, ?)',
      [nome, preco, quantidade_estoque, categoria_id]
    );
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ erro: `categoria_id ${categoria_id} não existe` });
    }
    throw err;
  }
  if (redis.isReady) {
    await redis.del(CACHE_KEY_PRODUTOS).catch(() => {});
  }
  res.status(201).json({ id: resultado.insertId, pod: POD });
});

// Contador no Redis: INCR é atômico, então vários pods podem incrementar ao mesmo tempo.
app.get('/visitas', async (req, res) => {
  if (!redis.isReady) {
    return res.status(503).json({ erro: 'Redis indisponível', pod: POD });
  }
  const visitas = await redis.incr('loja:visitas');
  res.json({ visitas, pod: POD, versao: APP_VERSION });
});

// Gera carga de CPU de forma controlada, para demonstrar o autoscaling (HPA).
// Usa pbkdf2 ASSÍNCRONO: consome CPU nas threads do Node, mas não trava o event loop
// (os probes /health e /ready continuam respondendo mesmo sob carga).
app.get('/carga', async (req, res) => {
  const rodadas = Math.min(Math.max(Number(req.query.rounds) || 3, 1), 50);
  for (let i = 0; i < rodadas; i += 1) {
    await new Promise((ok, falha) =>
      crypto.pbkdf2('loja', 'sal', 100000, 64, 'sha512', (err) => (err ? falha(err) : ok()))
    );
  }
  res.json({ pod: POD, rodadas });
});

// Tratamento de erro (Express 5 já encaminha erros de handlers async para cá).
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`[erro] ${req.method} ${req.originalUrl}: ${err.message}`);
  res.status(500).json({ erro: 'Erro interno', detalhe: err.code || err.message, pod: POD });
});

// ---------------------------------------------------------------- ciclo de vida
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`loja-api v${APP_VERSION} ouvindo na porta ${PORT} (pod=${POD})`);
  console.log(`MySQL em ${dbConfig.host}:${dbConfig.port}/${dbConfig.database} | Redis em ${REDIS_URL}`);
});

// Desligamento limpo: o Kubernetes manda SIGTERM antes de matar o Pod.
// Terminar as requisições em andamento evita erro para o usuário durante rolling updates.
function encerrar(sinal) {
  console.log(`${sinal} recebido — encerrando com calma...`);
  server.close(async () => {
    await Promise.allSettled([pool.end(), redis.isOpen ? redis.quit() : Promise.resolve()]);
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref(); // trava de segurança
}
process.on('SIGTERM', () => encerrar('SIGTERM'));
process.on('SIGINT', () => encerrar('SIGINT'));
