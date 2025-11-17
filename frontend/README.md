# MRP - Frontend

Este repositório contém o frontend do projeto MRP, desenvolvido como um trabalho acadêmico. Não espere uma arquitetura corporativa completa - o foco é aprendizado e demonstração de conceitos, embora o código esteja organizado e interessante.

**Tecnologias / Stack**

- **Vite**: bundler e dev server.
- **React 19** com **TypeScript**: base da aplicação.
- **Chakra UI** e **@chakra-ui/charts**: componentes UI e gráficos.
- **TanStack (React Query / Router)**: gerenciamento de dados e rotas.
- **Recharts / lucide-react**: visualizações e ícones.
- **Ultracite / Biome**: lint/format (configuração do projeto).

**Observação**: é um projeto acadêmico - utilidade pedagógica prima sobre decisões arquiteturais complexas.

## Requisitos

- Node.js (recomendado 22+)
- `pnpm` como gerenciador de pacotes (o projeto usa `pnpm` por padrão)

## Instalação

No diretório do projeto, instale dependências:

```pwsh
pnpm install
```

## Scripts úteis

- `pnpm dev` — inicia o servidor de desenvolvimento (Vite). Ex.: abre em `http://localhost:3000`.
- `pnpm build` — gera o build de produção (executa `vite build` e `tsc`).
- `pnpm serve` — serve o build gerado via `vite preview`.
- `pnpm check` — executa as verificações do `ultracite` e `biome`.
- `pnpm fix` — tenta corrigir automaticamente problemas com `ultracite` e `biome`.

Exemplos:

```pwsh
pnpm dev
pnpm build
pnpm serve
```

## Estrutura principal

- `src/` — código-fonte React + TypeScript.
- `src/components/` — componentes reutilizáveis, painéis e telas.
- `src/lib/api.ts` — cliente/integração com API (padrão do projeto).
- `vite.config.ts`, `tsconfig.json`, `biome.jsonc` — configuração do projeto.

## Rodando localmente

1. Instale dependências (`pnpm install`).
2. Inicie o dev server: `pnpm dev`.
3. Abra `http://localhost:3000` no navegador.
