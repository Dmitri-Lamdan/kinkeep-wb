---
description: "Use when creating or editing Material UI forms, filters, validation, and submit handlers."
applyTo: "src/components/**/*{Form,Filter}*.tsx"
---

# Forms

- Controlled Material UI fields only. Visible labels, not placeholder-only fields.
- Keep filter and form state in the parent when the result must update a list or details panel.
- Validate before submit. Show the error on the field with `error` and `helperText`.
- Disable the submit button while a request is in flight, and surface API errors in an `Alert`.
- Do not add a create or update call unless that endpoint exists in the OpenAPI spec or `doc/api.md`.
