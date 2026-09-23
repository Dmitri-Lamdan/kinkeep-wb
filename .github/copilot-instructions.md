# kinkeep-wb

React 19, TypeScript, Vite, and Material UI. Product docs live in `doc/`. Do not duplicate them here.

## Structure

- `src/components/` — UI components. One component per file. Tests and stories sit beside the component.
- `src/api/` — typed fetch clients. One resource per file. Follow `src/api/objects.ts`.
- `src/types.ts` — shared domain types. Do not invent fields that the API does not return.
- `src/theme.ts` — the only theme. Colors: primary `#1976d2`, secondary `#9c27b0`, background `#f5f5f5`.
- `doc/api.md` — update when an endpoint or model changes.

## API

- Browser calls same-origin paths such as `/v1/objects`.
- Vite proxies `/v1` to `http://localhost:8080` in both `server` and `preview`.
- Do not hard-code `http://localhost:8080` in client code.

## Quality bar

- Every new component gets a Vitest + Testing Library test and, when UI is visible, a Storybook story.
- Use semantic Material UI controls with visible labels. Do not use placeholder-only inputs.
- Keep list rendering and filters cheap. Do not refetch data that is already in state.
- Run `npm run build` after substantive changes. On Windows, Node may be missing from PATH; use `C:\Program Files\nodejs\npm.cmd` if `npm` is not recognized.

## Language

Match existing code style: 4-space indent in `src/`, explicit TypeScript types on public props, no unused exports.
