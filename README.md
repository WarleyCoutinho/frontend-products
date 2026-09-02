# Products Frontend

> Painel de gerenciamento de produtos construído com **Next.js 16** (App Router), **React 19**, **TypeScript**, **TanStack Query** e **shadcn/ui**, consumindo a Products API via cliente gerado com **Orval**. Referência de arquitetura front-end usada pela **[Adapticode](https://adapticode.com.br)** como base em projetos reais de clientes.

Auth por sessão (Better-Auth + Google), fetching server-first com fallback client-side via TanStack Query, formulários com React Hook Form + Zod validados ponta a ponta contra o schema da API — o mesmo padrão que roda em produção em sistemas entregues pela Adapticode, aqui exposto com um domínio simples (Produtos) só pra servir de referência pública.

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict)
- **UI:** Tailwind CSS v4 + shadcn/ui (new-york style) + Radix UI
- **Formulários:** React Hook Form + Zod
- **Data fetching:** Orval (gera cliente a partir do OpenAPI da API) + TanStack Query
- **Autenticação:** Better-Auth (client) + OAuth Google

## Arquitetura

\```
Server Component (fetch inicial, cookies via next/headers)
↓ initialData
Client Component (TanStack Query, mutations, interatividade)
\```

- `app/_lib/api/fetch-generated/` — funções fetch pra Server Components (cookie forwarding manual)
- `app/_lib/api/rc-generated/` — hooks TanStack Query pra Client Components (cookie via `credentials: "include"`)
- Nenhuma verificação de auth em middleware — cada página protegida checa a sessão diretamente e redireciona pra `/auth`

## Rodando localmente

\```bash
pnpm install
cp .env.example .env # aponte NEXT_PUBLIC_API_URL pra sua instância da Products API
pnpm dev
\```

Front em `http://localhost:3379`. Pra regenerar o cliente de API depois de alterar o backend:

\```bash
npx orval
\```

---

Desenvolvido por **[Warley Coutinho](https://adapticode.com.br)** — desenvolvimento de software sob medida (apps mobile, sistemas web, SaaS).
📩 contatoadapticode@gmail.com · 📱 WhatsApp +55 62 9 9152-7514
