# Backend MRP (FastAPI)

Projeto simples de backend para um sistema de MRP/estoque desenvolvido com FastAPI e SQLite.

## Pré-requisitos

- Python 3.10 ou superior
- Pip configurado no PATH

## Instalação

1. Crie e ative um ambiente virtual (opcional, mas recomendado):
   ```pwsh
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
2. Instale as dependências:
   ```pwsh
   pip install -r requirements.txt
   ```

## Execução

Execute o servidor com Uvicorn:

```pwsh
uvicorn app.main:app --reload
```

A API ficará disponível em `http://127.0.0.1:8000`.
A documentação interativa pode ser acessada em `http://127.0.0.1:8000/docs` ou `http://127.0.0.1:8000/redoc`.

### Principais rotas

- `POST /items` – cadastra produto
- `GET /items` – lista estoque com indicador de baixo estoque (quantidade < 5)
- `DELETE /items/{item_id}` – exclui produto e suas movimentações
- `POST /movements` – registra entrada ou saída
- `GET /dashboard/total` – série histórica do valor total

## Popular o banco com dados de exemplo

Use o script de seed (com Faker) para inserir alguns produtos aleatórios:

```pwsh
python -m scripts.seed_db
```

Para limpar e repopular, utilize:

```pwsh
python -m scripts.seed_db --force
```

Você também pode controlar a quantidade de registros e fixar um seed para gerar dados determinísticos:

```pwsh
python -m scripts.seed_db --items 10 --seed 42
```

## Estrutura do Projeto

- `app/` – código da aplicação (rotas, acesso ao banco e esquemas)
- `inventory.db` – banco SQLite local (criado automaticamente)
- `requirements.txt` – dependências do projeto
- `README.md` – este guia

## Observações

- O banco de dados é criado automaticamente no primeiro start.
- Permissões CORS estão abertas para facilitar o desenvolvimento do frontend.
- Primeiro projeto da equipe utilizando FastAPI, visando aprendizado e prática com a tecnologia. A estrutura do código pode não seguir as melhores práticas, foi pensada em ser aproximado do que fazemos com Fastify + TS no Node.js.
