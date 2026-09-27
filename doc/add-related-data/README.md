# Add Related Data

Specification for a dialog that creates one `ObjectEvent`, `ObjectInterval`, or `ServiceTask` on the object selected in Objects Manager.

This is a product specification. It does not change the running form until the dialog and write endpoints are implemented.

## Purpose

Objects Manager loads managed objects with `GET /v1/objects`. Each object already carries `events`, `intervals`, and `serviceTasks`. Operators need to append one of those child records without leaving the main form.

This new dialog creates related data, not a ManagedObject. Creating a ManagedObject is a separate flow documented in  [layout.md](../layout.md) and [api.md](../api.md).

Вы
## Entry point

| Control | Where | Behavior |
| --- | --- | --- |
| Button **Add data** | Object Details card on the main form | Opens `AddRelatedDataDialog` for the selected object |

Rules:

- The button is on the main form, in the Object Details header, not on a separate page.
- The button is disabled when no object is selected, while objects are loading, or while a save is in progress.
- Visible helper text when disabled and idle: "Select an object before adding data."
- Click does not navigate. It opens a modal dialog over Objects Manager.
- Cancel, Escape, and the backdrop close the dialog without writing.
- The selected object stays selected after save. The tab that matches the saved kind becomes active: Events, Intervals, or Service tasks.

## Dialog

Component name: `AddRelatedDataDialog`.

The parent object is read-only: name and id of the selected `ManagedObject`. The operator chooses one kind, fills only that kind's fields, and submits.

| Kind | Creates | Server assigns |
| --- | --- | --- |
| Event | `ObjectEvent` | `id` |
| Interval | `ObjectInterval` | `id`, `createdAt` |
| Service task | `ServiceTask` | `id` |

`objectId` is always the selected object's `id`. The operator does not type it.

### Event fields

| Field | Control | Required | Notes |
| --- | --- | --- | --- |
| User | Text field, label "User" | Yes | Maps to `userId` |
| Date | Datetime field, label "Date" | Yes | Maps to `timestamp`. Default: current local time, sent as ISO-8601 |
| Type | Text field, label "Type" | Yes | Maps to `eventType`. Example: `calendar` |
| Message | Multiline text, label "Message" | Yes | Maps to `message` |

### Interval fields

| Field | Control | Required | Notes |
| --- | --- | --- | --- |
| Value | Number field, label "Value" | Yes | Maps to `intervalValue`. Integer greater than 0 |
| Unit | Select, label "Unit" | Yes | Maps to `intervalUnit`. Options: `DAYS`, `WEEKS`, `MONTHS`, `YEARS` |

### Service task fields

| Field | Control | Required | Notes |
| --- | --- | --- | --- |
| Name | Text field, label "Name" | Yes | Maps to `name` |
| Status | Select, label "Status" | Yes | Maps to `status`. Options: `planned`, `in_progress`, `done` |
| Due date | Date field, label "Due date" | Yes | Maps to `dueDate`, date only (`YYYY-MM-DD`) |

Every input has a visible Material UI label. Placeholder-only inputs are not allowed.

## Validation

Client validation runs before the request. The Save button stays enabled; invalid submit focuses the first invalid field and shows helper text.

| Rule | Message |
| --- | --- |
| Required text is blank after trim | "Required." |
| Interval value is missing, not an integer, or less than 1 | "Enter a whole number greater than 0." |
| Date or datetime cannot be parsed | "Enter a valid date." |
| Kind has no selected object | Dialog cannot open |

The service may still reject the body. Show the response problem text in an alert inside the dialog. Keep the entered values.

## Proposed write API

The current service documents only `GET /v1/objects`. These writes are proposed and must be confirmed before implementation. The browser calls same-origin paths. Do not hard-code `http://localhost:8080`.

```http
POST /v1/objects/{objectId}/events
POST /v1/objects/{objectId}/intervals
POST /v1/objects/{objectId}/service-tasks
Content-Type: application/json
Accept: application/json
```

Success: `201 Created` with the created record, using the same fields as [api.md](../api.md).

| Kind | Request body | Response |
| --- | --- | --- |
| Event | `userId`, `timestamp`, `eventType`, `message` | `ObjectEvent` |
| Interval | `intervalValue`, `intervalUnit` | `ObjectInterval` |
| Service task | `name`, `status`, `dueDate` | `ServiceTask` including `id` and `objectId` |

Errors:

| Status | UI |
| --- | --- |
| `400` | Alert with the server message. Dialog stays open |
| `404` | Alert: object no longer exists. Dialog stays open |
| Other or network | Alert: "Could not save. Try again." Dialog stays open |

On `201`, append the returned record to the matching array on the selected object already in memory. Do not call `GET /v1/objects` again. Switch to the matching details tab and close the dialog.

## Components

| Name | Role |
| --- | --- |
| `ObjectsManager` | Owns selected object, opens the dialog, appends the saved record |
| `ObjectDetails` | Renders **Add data** and reports the click |
| `AddRelatedDataDialog` | Kind switch, fields, validation, submit and cancel |
| `ObjectsApi` | `createObjectEvent`, `createObjectInterval`, `createServiceTask` |

Proposed client module: `src/api/objects.ts`, beside `fetchObjects`.

## Related documents

- [Class diagram](class-diagram.md)
- [Sequence diagram](sequence-diagram.md)
- [UI prototype](ui-prototype.md)
