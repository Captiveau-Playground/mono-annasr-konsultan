# Strapi + Next.js Monorepo

Monorepo starter with Strapi v5 CMS, Next.js 16 UI, pnpm workspaces, and Turborepo.

## Workspaces

| Path                     | Description                                                             |
| ------------------------ | ----------------------------------------------------------------------- |
| `apps/ui`                | Next.js 16 App Router, React 19, TailwindCSS v4, shadcn/ui              |
| `apps/strapi`            | Strapi v5 CMS with PostgreSQL through Docker                            |
| `packages/strapi-types`  | Auto-generated TypeScript types from Strapi schemas                     |
| `packages/design-system` | Shared TailwindCSS tokens, CKEditor and TipTap editor styles            |
| `packages/shared-data`   | Shared constants and types                                              |
| `packages/logging`       | Structured pino logging + OpenTelemetry trace context (`@repo/logging`) |
| `qa/tests/playwright`    | E2E, accessibility, SEO, visual, and Lighthouse tests                   |

Config-only workspaces (`@repo/eslint-config`, `@repo/typescript-config`, `@repo/semantic-release-config`) are omitted from the table.

## Essential Commands

Run commands from the monorepo root.

```bash
pnpm dev          # Start all apps (UI + Strapi)
pnpm dev:strapi   # Start Strapi only
pnpm dev:ui       # Start Next.js only
pnpm build        # Build all
pnpm lint         # ESLint all packages
pnpm typecheck    # Typecheck all packages
pnpm test         # Vitest in all apps
pnpm run:db       # Start PostgreSQL via Docker
pnpm seed:import  # Import baseline seed content
```

## Generated types

`@repo/strapi-types` is generated from the Strapi schemas and **regenerates automatically when Strapi restarts** after a schema or component change — no manual step in normal dev. If you need fresh types without restarting Strapi, run `pnpm generate:types`.

## Key concepts

- **CMS → frontend loop**: `apps/ui/src/lib/annasr/*` fetches Strapi content (via
  `PublicStrapiClient`) with static fallbacks. Content types: `beranda`, `tentang`,
  `layanan`, `portfolio`, `klien`, `karir`, `kontak`, `artikel`, `situs`.
- **Smart populate**: population uses object form (`populate[hero]=smart`), not a
  flat `populate=smart` string — the `@notum-cz/strapi-plugin-smart-populate`
  plugin only accepts the object form in REST.
- **Public read**: Strapi `setupRbac` (in `apps/strapi/src/utils/rbac.ts`) grants the
  Public role read access to the front-page content types (idempotent on boot).
- **RBAC**: an admin "Editor Konten" role is created automatically at bootstrap.
- **Deployment**: Docker images are built and pushed to GHCR by
  `.github/workflows/docker-publish.yml`; the server runtime lives in `deploy/`
  (docker-compose + `.env.example` + README).

## Commits

Use Conventional Commits. The repo enforces branch naming and commit messages through Lefthook and commitlint.

```bash
pnpm commit    # Interactive Commitizen flow
```

Manual format:

```text
type(scope): subject
```

Allowed scopes: `ui`, `strapi`, `global` (cross-app), plus package names
(`design-system`, `shared-data`, `logging`, `strapi-types`, …).

When adding environment variables, mention them in the commit body as `env.VARIABLE_NAME` or `VARIABLE_NAME` in `CONSTANT_CASE` so the Auto PR workflow can surface them.

## Agent skills

Reusable agent instructions live in [`.claude/skills/`](./.claude/skills/) — the single source of truth, auto-discovered by Claude Code. A committed symlink at [`.agents/skills/`](./.agents/skills/) exposes the same set to any agent following the [agentskills.io](https://agentskills.io) standard (Codex, Copilot CLI, Gemini). Vendored community skills are installed via `skills.sh` and tracked in [`skills-lock.json`](./skills-lock.json).

See [`.claude/skills/README.md`](./.claude/skills/README.md) for the authoring guide and full catalog. Worktree-based isolation is wired through the `start-work` skill.

This file (`CLAUDE.md`) is mirrored as `AGENTS.md` (a symlink) for non-Claude agents; the same pairing exists in `apps/ui` and `apps/strapi`.
