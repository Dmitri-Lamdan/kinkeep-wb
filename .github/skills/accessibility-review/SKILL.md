---
name: accessibility-review
description: "Review and fix accessibility. Use when the user asks to check accessibility, a11y, keyboard access, labels, contrast, or проверить доступность."
argument-hint: "Screen or component to review"
---

# Accessibility review

## When to use

The user wants an accessibility check or fix for the Objects Manager or a new component.

## Procedure

1. Read the target component and `src/theme.ts`.
2. Check these items and fix the failures in code:
   - Every input has a visible label tied with `labelId` or `htmlFor`.
   - Buttons and icon buttons have an accessible name.
   - Selected list items expose `aria-current` or remain a selected `ListItemButton`.
   - Tab panels are reachable by keyboard. Do not remove MUI Tabs keyboard behavior.
   - Status and errors are text, not color alone. Use `Alert` for load failures.
   - Text contrast against `#f5f5f5` and white cards stays at least WCAG AA for normal text.
   - Loading state uses `CircularProgress` with `aria-label="Loading objects"` or equivalent text.
3. Add or update a Testing Library test that finds the control by its accessible name.
4. Run that test.

## Report

List each issue as fixed or left open, with the file changed. Do not only describe problems when a local fix is possible.
