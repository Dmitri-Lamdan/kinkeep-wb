---
name: react-component-tests
description: "Generate a React component and its tests. Use when the user asks to generate components with tests, создать компонент с тестами, or add a tested Material UI component to kinkeep-wb."
argument-hint: "Component name and what it should show"
---

# Component with tests

## When to use

The user wants a new or updated React component and a test in the same change.

## Procedure

1. Read `doc/components.md`, `doc/layout.md`, and `src/types.ts`.
2. If the component shows API data, read `doc/api.md` and pass data in through props. Do not fetch inside the component.
3. Create `src/components/<Name>.tsx` with a typed props interface and a default export.
4. If Vitest is not installed, add `vitest`, `jsdom`, and `@testing-library/react` as dev dependencies, and add a `test` script: `vitest run`. Add the Vite test config only if `vite.config.ts` has no `test` block.
5. Create `src/components/<Name>.test.tsx` beside the component.
6. Run the new test, then `npm run build`.

## Test checklist

- Renders the main content from props.
- Covers an empty state when the component has one.
- Simulates the primary user action with `userEvent` when the component is interactive.
- Does not call the network.

## Do not

- Do not add Storybook in this skill unless the user also asked for stories.
- Do not copy mock objects back into `src/data.ts`.
