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
- `onAddObject()` is called when **+ Add Object** is clicked.

## Add Object workflow

The Add Object button, dialog, validation, and client-side submission are implemented. The POST contract is based on [api.md](api.md) and still needs confirmation against the service or its OpenAPI specification.

### ObjectsManager
- Owns the Add Object modal open state and submits its form through `POST /v1/objects`
- After a successful response, clears the search query and both type and status filters, adds the created object to the loaded list, and selects it so it remains visible

### AddObjectDialog
- Modal form opened from the Filter Bar through `ObjectsManager`
- Shows all five managed-object fields: `name`, `type`, `status`, `currentValue`, and `nextServiceDate`
- Displays `nextServiceDate` as an initially empty, optional date field; if left empty, omit `nextServiceDate` from the `POST /v1/objects` body
- Shows `status` as a labeled select control with `active` and `inactive` options; `active` is selected initially and the user can choose `inactive`
- Shows `currentValue` as a numeric field, initially set to `0.00`
- Sends the selected `status` value in the `POST /v1/objects` request
- Trims `name` before submit; requires 1-255 characters after trimming and validates the type against the supported values
- Constrains `currentValue` to increments of `0.01`, with at most 8 integer digits and 2 fractional digits; does not impose a non-negative minimum
- Validates `nextServiceDate` as a real calendar date in `YYYY-MM-DD` format when provided; past dates are allowed
- Focuses the first invalid field and shows the corresponding helper text; maps a server `409 Conflict` duplicate-name response to the Name field and preserves entered values
- Cancel closes the modal without making an API request
- Submits through a callback owned by `ObjectsManager`; displays API errors and keeps entered values on failure

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
