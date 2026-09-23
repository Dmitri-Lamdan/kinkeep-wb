---
description: "Use when creating or editing Storybook stories for kinkeep-wb React components."
applyTo: "**/*.stories.tsx"
---

# Storybook stories

- Colocate `Component.stories.tsx` with the component.
- Wrap stories in the app `ThemeProvider` and `CssBaseline` from `src/main.tsx` conventions.
- Provide at least a default story and an empty or error story when the component has those states.
- Pass plain props. Do not call the live API from a story.
- Use the API field names from `doc/api.md` in story fixtures.
