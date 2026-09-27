# Layout Structure

## Root
- `<Box>` container with padding
- `<Typography>` header: "Loading Process – Objects Manager"

## Filter Bar
- `<Select>`: Filter Type
- `<Select>`: Filter Status
- `<TextField>`: Search
- `<Button>`: + Add Object. Clicking it opens the Add Object modal form; it does not navigate away from the main form.

## Add Object modal form

> **Implementation status:** The Add Object button, modal, validation, and client-side submission are implemented. The assumed `POST /v1/objects` contract still needs confirmation against the service or its OpenAPI specification.

- Opened in modal mode by clicking **+ Add Object** in the Filter Bar. The user stays on the Objects Manager page.
- Submitting creates an object with `POST /v1/objects`; request fields and server errors are defined in [api.md](api.md)
- Cancel closes the modal without sending a request

### Form fields

| Field | Control | Required | Initial value | Constraints |
| --- | --- | --- | --- | --- |
| Name | Text field | Yes | Empty | Trim before validation and submit; 1-255 characters after trimming. Uniqueness is checked by the server. |
| Type | Select | Yes | No selection | Must be `calendar`, `mileage`, `event`, `combined`, or `other`. |
| Status | Select with `active` and `inactive` options | Yes | `active` | Form sends the selected value. If omitted by another client, the API defaults it to `active`. |
| Current value | Numeric field | No | `0.00` | Step `0.01`; at most 8 integer digits and 2 fractional digits (`decimal(10,2)`). No non-negative minimum is specified. |
| Next service date | Date field | No | Empty | Must be a valid calendar date in `YYYY-MM-DD` format. Past dates are allowed. |

The Type select offers `calendar`, `mileage`, `event`, `combined`, and `other`.

### User actions and outcomes

- Selecting **Cancel** closes the modal without sending a request. The user can also close it with **Escape**.
- Selecting **Save** validates all field constraints below and submits the form to `POST /v1/objects` only when valid. Focus the first invalid field and show its helper text.
- If Next service date is empty, the request omits `nextServiceDate`.
- The form trims `name` before submission. Server-side duplicate-name errors (`409 Conflict`) are shown on the Name field; keep the form open and preserve its values.
- While the request is in progress, prevent duplicate submissions.
- On success, clear the search query and both type and status filters, close the modal, add the returned object to the loaded list, and select it. Clearing the filters ensures the new object is visible in the list.
- If the request fails, keep the modal open, preserve the entered values, and show the error.

### Validation messages

| Condition | Message |
| --- | --- |
| Name is blank after trimming | `Enter a name.` |
| Name exceeds 255 characters after trimming | `Name must be 255 characters or fewer.` |
| Type is not selected | `Select a type.` |
| Current value has more than 8 integer digits or 2 fractional digits | `Enter a number with up to 8 integer digits and 2 decimal places.` |
| Next service date is not a valid `YYYY-MM-DD` calendar date | `Enter a valid date in YYYY-MM-DD format.` |
| Server reports a duplicate name (`409`) | `An object with this name already exists.` |

Request fields, allowed values, and response details are defined in [api.md](api.md).

## Main Grid
- Left column (xs=4): Objects List
- Right column (xs=8): Object Details
