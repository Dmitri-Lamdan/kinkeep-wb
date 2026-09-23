---
name: project-structure
description: "Standardize project structure. Use when the user asks to standardize structure, move files into the project layout, or стандартизировать структуру проекта."
argument-hint: "Area to normalize"
---

# Project structure

## Target layout

```text
src/
  api/            typed fetch clients
  components/     UI, colocated tests and stories
  assets/
  App.tsx
  main.tsx
  theme.ts
  types.ts
doc/              product description, not agent rules
.github/
  agents/
  instructions/
  skills/
```

## Procedure

1. List `src/` and compare it with the layout above.
2. Move files only when the new path matches this layout and imports can be updated safely.
3. Delete unused mock modules if nothing imports them.
4. Keep one theme file and one types module unless a file exceeds a few hundred lines.
5. Do not create `src/data.ts` for live API screens.
6. Update `doc/components.md` if a component is added, renamed, or removed.
7. Run `npm run build` after moves.

## Rules

- Tests: `Component.test.tsx` beside the component.
- Stories: `Component.stories.tsx` beside the component.
- API: `src/api/<resource>.ts`.
- No new top-level framework folder without the user's request.
