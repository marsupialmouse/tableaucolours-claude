---
paths: e2e/**/*.ts
---

# E2E Testing Conventions

- **Page object model** — Use page objects in `e2e/pages/`, don't put locator logic in test files.
- **Custom fixtures** — Import `test` and `expect` from `e2e/fixtures.ts`, not `@playwright/test`.
- **Test state setup** — Use `palettePage.setupPalette()` to set known state via XML import.
- **Fast iteration** — Use `pnpm test:e2e --project=chromium` during development; full suite before committing.
