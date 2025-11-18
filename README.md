# MRP – Mini ERP de Estoque

Projeto acadêmico fullstack para gerenciamento simplificado de estoque, com API em FastAPI + SQLite e frontend em React 19 (Vite + Chakra UI + TanStack). Inclui movimentações (entrada/saída), dashboard, relatórios e Painel ABC, além de um menu CLI para cumprir o formato tradicional da atividade.

## Principais Recursos

- Cadastro, listagem e exclusão de produtos
- Movimentações de estoque (entrada / saída) com histórico
- Indicador de baixo estoque (quantidade < 5)
- Dashboard: métricas, distribuição por categoria, evolução do valor total
- Relatórios: custo por categoria, produtos por categoria, top por valor, Painel ABC
- Menu interativo (CLI) opcional

## Estrutura

```
backend/    # API FastAPI, banco SQLite, scripts (seed e menu CLI) - Verifique o README.md dentro desta pasta
frontend/   # Aplicação React + Vite + TanStack + Chakra UI - Verifique o README.md dentro desta pasta
README.md   # Este documento
LICENSE.md  # Licença
```

## Requisitos

- Python 3.10+
- Node.js 22+
- `pnpm` (frontend)

## Executando Backend (API)

```pwsh
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API: `http://127.0.0.1:8000`
Docs: `http://127.0.0.1:8000/docs` ou `http://127.0.0.1:8000/redoc`

### Popular Banco (opcional)

```pwsh
cd backend
python -m scripts.seed_db --force --items 160 --seed 42
```

## Executando Frontend

```pwsh
cd frontend
pnpm install
$env:VITE_API_URL = "http://127.0.0.1:8000"
pnpm dev
```

App: `http://localhost:3000`

## Menu Interativo (CLI)

```pwsh
cd backend
python -m scripts.menu_cli
```

Opções: cadastrar, excluir (ID ou nome), listar (com destaque de baixo estoque), sair.

## Tecnologias

- FastAPI, SQLite, Faker
- React, TypeScript, Vite
- Chakra UI, Recharts
- TanStack Router / Query
- Biome / Ultracite

## Créditos

- Victor Lellis
- Dolunay
- Eduardo Oliveira
