# Loading Process – Objects Manager

The current application provides a two-column dashboard built with React and Material UI.

## Main Features
- Filter bar with dropdowns and search
- Left panel: list of objects with legend
- Right panel: details card with tabs and events table
- Responsive layout using Material UI Grid

## Specifications
- Add Object dialog — implemented as specified in [layout.md](layout.md); its POST contract still needs confirmation against the service
- [Add related data](add-related-data/README.md) — dialog opened from Object Details to create an `ObjectEvent`, `ObjectInterval`, or `ServiceTask`
