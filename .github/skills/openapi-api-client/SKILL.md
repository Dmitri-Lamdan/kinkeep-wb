---
name: openapi-api-client
description: "Create a typed API client from an OpenAPI spec. Use when the user asks for an OpenAPI client, API-клиент по OpenAPI, or to connect a documented endpoint such as /v1/objects."
argument-hint: "OpenAPI file or URL, and the operation to implement"
---

# OpenAPI API client

## When to use

The user supplies an OpenAPI file, URL, or asks to generate a client for a known operation.

## Procedure

1. Read the spec. If it is a URL, fetch it. If no spec is available, use `doc/api.md` and say that the client is doc-based, not spec-generated.
2. Implement only the operations the user named. Put them in `src/api/<resource>.ts`.
3. Follow `src/api/objects.ts`: same-origin path, `AbortSignal`, `response.ok`, normalize unknown JSON.
4. Add or update types in `src/types.ts` from the response schema. Keep optional fields optional.
5. Point the UI at the new function. Do not leave a second fetch implementation in a component.
6. Update `doc/api.md` with the method, path, model, and a short UI mapping.
7. Extend the Vite `/v1` proxy only if the spec host differs or the path prefix is not `/v1`.
8. Probe the local endpoint when it is `localhost`. If it is down, report that and still keep the client compiling.

## Output checklist

- Client function exported.
- Types match the schema.
- UI imports the client instead of calling `fetch` directly.
- `npm run build` passes.
