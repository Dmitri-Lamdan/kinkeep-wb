---
name: react-performance
description: "Optimize React performance. Use when the user asks to optimize performance, reduce rerenders, speed up lists, or оптимизировать производительность."
argument-hint: "Screen or interaction that feels slow"
---

# Performance

## When to use

The user asks to optimize the Objects Manager or a new list, table, or form.

## Procedure

1. Read the component before changing it. Do not memoize blindly.
2. Prefer these fixes, in order:
   - Fetch once in `ObjectsManager`. Filter with `useMemo`. Do not refetch on filter changes.
   - Pass stable callbacks only when a child is memoized.
   - Avoid creating new object literals in hot list item props when the list is large.
   - Do not derive the same arrays twice per render.
   - Keep heavy dialogs or unused tabs from mounting only if measurement shows a cost. MUI tabs may stay mounted if the panel is small.
3. For lists that can grow past a few hundred rows, virtualize with a small maintained library. Do not add a virtualization dependency for the current three-row payload.
4. After a change, run `npm run build`.
5. Report what was slow, what changed, and what was deliberately left alone.

## Do not

- Do not rewrite the app to another framework.
- Do not remove accessibility attributes to save renders.
