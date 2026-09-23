# React Components

All object data comes from `GET /v1/objects`. Nested `events`, `intervals`, and `serviceTasks` are read from the selected object. There is no second request.

## ObjectsManager
- Root component, holds state and layout
- Loads `ManagedObject[]` from `GET /v1/objects`
- Filters by `type`, `status`, and `name`

## FilterBar
Props:
- `typeFilter`, `statusFilter`, `searchQuery`
- `typeOptions`, `statusOptions` from the API response

## ObjectList
Props:
- `objects[]` from `GET /v1/objects`
- `onSelectObject(object)`

## ObjectDetails
Props:
- `selectedObject` (`ManagedObject` from the API)
- `activeTab`
- `onTabChange(index)`
- Renders Details, Events, Intervals, and Service tasks from that object

## EventsTable
Props:
- `events[]` (`ObjectEvent` from the selected object)
