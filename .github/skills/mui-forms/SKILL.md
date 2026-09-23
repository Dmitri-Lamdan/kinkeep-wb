---
name: mui-forms
description: "Create Material UI forms. Use when the user asks to create a form, add fields, validation, or создать форму in kinkeep-wb."
argument-hint: "Form purpose and fields"
---

# Forms

## When to use

The user wants a new form or a change to FilterBar or another input group.

## Procedure

1. Read `doc/api.md` before adding a submit action. If no write endpoint exists, build the form UI and keep submit disabled with a short explanation, or wire it only to local state.
2. Put reusable forms in `src/components/<Name>Form.tsx`.
3. Use controlled Material UI `TextField` and `Select` with visible labels, `error`, and `helperText`.
4. Validate required fields before calling an API function from `src/api/`.
5. Show request errors in an `Alert`. Keep entered values after a failed submit.
6. Add `src/components/<Name>Form.test.tsx` that covers a valid submit and one invalid field.
7. Run the test and `npm run build`.

## Field mapping

Use API names in state (`name`, `type`, `status`, `currentValue`, `nextServiceDate`). Format only at the display boundary.
