---
name: storybook-stories
description: "Generate Storybook stories for React components. Use when the user asks for Storybook stories, stories, or сгенерировать Storybook."
argument-hint: "Component to document"
---

# Storybook stories

## When to use

The user wants stories for an existing or new component.

## Procedure

1. If Storybook is not configured, add the official Storybook for Vite + React and a `storybook` script. Do not switch the app bundler away from Vite.
2. Add a preview decorator that applies `src/theme.ts` and `CssBaseline`.
3. Create `src/components/<Name>.stories.tsx` next to the component.
4. Include a default story. Include empty and error stories when the component already has those states.
5. Build fixtures from `doc/api.md` field names. Do not call `/v1/objects` from a story.
6. Run the Storybook build or a one-story smoke check if a build script exists.

## Story shape

Use Component Story Format 3. Title the story `Components/<Name>`. Export `Default` and any extra states as named stories.
