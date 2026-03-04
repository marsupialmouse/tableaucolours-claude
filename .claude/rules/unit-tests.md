---
paths: src/**/*.test.{ts,tsx}
---

# Unit Testing Conventions

- **Factory functions** — Create `renderComponentName()` helpers that accept `Partial<Props>` overrides. This keeps tests focused on what they're asserting, not boilerplate setup.
- **jsdom limitations** — jsdom does not implement `HTMLCanvasElement.getContext()` or `Element.setPointerCapture()`. Canvas components should be tested for structure and props, not pixel output. Use optional chaining (`?.()`) on `setPointerCapture`/`releasePointerCapture` calls.
- **Mock patterns for drag events** — `React.DragEvent` mocks need at minimum `{ dataTransfer: { effectAllowed: '' } }` for `dragStart` and `{ preventDefault: vi.fn() }` for `drop`.
- **Avoid `toHaveStyle` for computed properties** — jsdom's style handling can be unreliable for properties like `order`. Access `element.style.order` directly instead.
