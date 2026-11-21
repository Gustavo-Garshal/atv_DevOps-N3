# Imagem da API da loja.
# A versão é "gravada" na imagem via build-arg — assim conseguimos ter
# loja-api:1.0 e loja-api:2.0 para demonstrar rolling update, canary e blue-green.
FROM node:22-slim

ARG APP_VERSION=1.0
ENV NODE_ENV=production \
    APP_VERSION=${APP_VERSION}

WORKDIR /app

# Dependências primeiro: aproveita o cache de camadas (igual na aula de Docker).
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Não roda como root dentro do container.
USER node

EXPOSE 3000
CMD ["node", "app.js"]
