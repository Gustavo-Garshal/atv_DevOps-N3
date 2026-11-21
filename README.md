Docker Compose:

1: Criar o arquivo de variáveis
Copie o modelo de variáveis de ambiente:
-powershell
Copy-Item .env.example .env

2: Iniciar os serviços
Suba a API, MySQL e Redis em segundo plano:
-powershell
docker compose up -d --build

3: Testar acesso
Acesse no navegador ou API Client:
http://localhost:3000/

4: Parar os serviços
Para encerrar os containers mantendo os dados do MySQL:
-powershell
docker compose down


Kubernetes

Os manifestos usam o namespace `n3-gustavogarshal`.

1: Construir a imagem da API

-powershell
docker build -t loja-api:1.0 --build-arg APP_VERSION=1.0 ./app

2: Aplicar os manifestos
Crie todos os recursos no cluster (Namespace, ConfigMap, Secret, MySQL, Redis, API e HPA):
-powershell
kubectl apply -f k8s/

3: Acompanhar a inicialização
Aguarde todos os Pods ficarem com status `Running` e `READY 1/1`:
-powershell
kubectl get pods -n n3-gustavogarshal -w

4: Testar o acesso
A API é exposta por NodePort na porta `30080`.
No navegador:
http://localhost:30080/

5: Remover os recursos
Para deletar todos os recursos criados no cluster:
-powershell
kubectl delete -f k8s/