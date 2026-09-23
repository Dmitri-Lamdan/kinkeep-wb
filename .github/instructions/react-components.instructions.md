---
description: "Use when creating or editing React components in kinkeep-wb, including ObjectsManager, lists, details, tables, and new UI. Covers Material UI structure, accessibility, and API-backed props."
applyTo: "src/components/**/*.tsx"
---

# React components

- Export a typed props interface from the same file. Keep the component a default export.
- Data displayed in object UI comes from `GET /v1/objects` (`ManagedObject` and nested `events`, `intervals`, `serviceTasks`). Do not restore local mock objects.
- Use the CSS classes in `doc/styles.md`: `filterBar`, `objectListCard`, `objectDetailsCard`, `legend`, `detailsSection`, `eventsTable`.
- Layout stays the two-column grid from `doc/layout.md`: list on the left, details on the right.
- Every input needs a visible `InputLabel` or `label`. Icon-only buttons need `aria-label`.
- Do not fetch inside presentational components. `ObjectsManager` owns loading state.
- Format dates for display. Keep raw ISO strings out of the UI unless they are identifiers.
