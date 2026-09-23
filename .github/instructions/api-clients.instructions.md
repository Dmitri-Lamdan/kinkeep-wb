---
description: "Use when creating or editing typed API clients, fetch wrappers, or OpenAPI mappings under src/api."
applyTo: "src/api/**/*.ts"
---

# API clients

- Export async functions, not a class, unless the user asks for a class.
- Call same-origin paths (`/v1/...`). Accept an optional `AbortSignal`.
- Check `response.ok` before parsing JSON. Throw an `Error` that includes the method, path, and status.
- Normalize unknown JSON into the types in `src/types.ts`. Do not trust the payload shape.
- If the OpenAPI spec and `doc/api.md` disagree, keep the spec as the contract and update the doc in the same change.
- Add a new Vite proxy prefix only when the spec uses a path other than `/v1`.
