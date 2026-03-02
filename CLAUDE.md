# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (v10.30.3).

```bash
pnpm dev              # Start Vite dev server (localhost:5173)
pnpm build            # Type-check (tsconfig.app.json) then Vite build
pnpm lint             # ESLint
pnpm lint:fix         # ESLint with auto-fix
pnpm format           # Prettier write
pnpm format:check     # Prettier check
pnpm test             # Vitest unit tests (single run)
pnpm test -- src/path/to/file.test.tsx  # Run a single test file
pnpm test:coverage    # Unit tests with V8 coverage
pnpm test:e2e         # Playwright e2e (starts dev server automatically)
```

Pre-commit hook (husky + lint-staged) runs ESLint fix and Prettier on staged `.ts`/`.tsx` files.

## Architecture

React 19 + Vite 7 + TypeScript + Tailwind CSS v4 (via `@tailwindcss/vite` plugin, no `tailwind.config` file — uses CSS-based config in `src/index.css`).

- `src/main.tsx` — entry point, renders `<App />` into `#root`
- `src/App.tsx` — root component
- Unit tests: colocated `*.test.tsx` files in `src/`, using Vitest + React Testing Library + jest-dom matchers (setup in `src/test/setup.ts`)
- E2E tests: `e2e/` directory, Playwright, runs against all three browser engines

## Code Style

- **Strict TypeScript** — `tsconfig.app.json` for app code, `tsconfig.node.json` for tooling
- **Strict ESLint** — `strictTypeChecked` + `stylisticTypeChecked` from typescript-eslint
- Use `type` keyword for type-only imports: `import { type Foo } from './bar'` (enforced by `consistent-type-imports` rule)
- Unused variables prefixed with `_` are allowed
- Prettier with `prettier-plugin-tailwindcss` for class sorting

## Workflow Rules

- **Pre-commit verification** — Before committing, run `pnpm build` and `pnpm test` to ensure they pass. The pre-commit hook handles lint and format automatically — never skip it with `--no-verify`.
- **Component file organization** — Components live in subfolders of `src/components/`, with related files colocated (e.g., `src/components/ColorPicker/ColorPicker.tsx`, `src/components/ColorPicker/ColorPicker.test.tsx`).
- **Test data conventions** — Prefer factory/helper functions to generate test data rather than shared mutable state or `beforeEach` setup blocks.
