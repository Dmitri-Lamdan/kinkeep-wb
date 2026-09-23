---
description: "Use when writing or editing Vitest and Testing Library tests for kinkeep-wb components, API clients, or forms."
applyTo: "**/*.{test,spec}.{ts,tsx}"
---

# Component tests

- Use Vitest and `@testing-library/react`. Query by role, label, or text. Do not query by CSS class unless no accessible name exists.
- Mock `fetch` for API tests. Do not call `http://localhost:8080` from a unit test.
- Cover the success path, the empty state, and one failure or validation path.
- Do not snapshot the whole Material UI tree.
- A component test must render the component, perform the user action when there is one, and assert the visible result.
