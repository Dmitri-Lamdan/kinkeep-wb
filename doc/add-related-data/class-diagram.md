# Add Related Data — class diagram

Objects Manager already owns the loaded `ManagedObject`. The dialog creates one child and returns it to the manager. Field names match [api.md](../api.md). Write methods are proposed.

```mermaid
classDiagram
    class ObjectsManager {
        +ManagedObject[] objects
        +string selectedId
        +number activeTab
        +boolean addDataOpen
        +openAddData()
        +appendChild(record)
    }

    class ObjectDetails {
        +ManagedObject selectedObject
        +onAddData()
    }

    class AddRelatedDataDialog {
        +ManagedObject parent
        +RelatedDataKind kind
        +boolean saving
        +submit()
        +cancel()
    }

    class EventForm {
        +string userId
        +string timestamp
        +string eventType
        +string message
    }

    class IntervalForm {
        +number intervalValue
        +string intervalUnit
    }

    class ServiceTaskForm {
        +string name
        +string status
        +string dueDate
    }

    class ObjectsApi {
        +fetchObjects(signal) ManagedObject[]
        +createObjectEvent(objectId, body) ObjectEvent
        +createObjectInterval(objectId, body) ObjectInterval
        +createServiceTask(objectId, body) ServiceTask
    }

    class ManagedObject {
        +string id
        +string name
        +ObjectEvent[] events
        +ObjectInterval[] intervals
        +ServiceTask[] serviceTasks
    }

    class ObjectEvent {
        +string id
        +string objectId
        +string userId
        +string timestamp
        +string eventType
        +string message
    }

    class ObjectInterval {
        +string id
        +string objectId
        +number intervalValue
        +string intervalUnit
        +string createdAt
    }

    class ServiceTask {
        +string id
        +string objectId
        +string name
        +string status
        +string dueDate
    }

    class CreateEventRequest {
        +string userId
        +string timestamp
        +string eventType
        +string message
    }

    class CreateIntervalRequest {
        +number intervalValue
        +string intervalUnit
    }

    class CreateServiceTaskRequest {
        +string name
        +string status
        +string dueDate
    }

    ObjectsManager --> ObjectDetails
    ObjectsManager --> AddRelatedDataDialog
    ObjectsManager --> ObjectsApi
    ObjectDetails --> ObjectsManager : Add data click
    AddRelatedDataDialog --> EventForm : kind = event
    AddRelatedDataDialog --> IntervalForm : kind = interval
    AddRelatedDataDialog --> ServiceTaskForm : kind = serviceTask
    AddRelatedDataDialog --> ObjectsApi : POST child
    ObjectsApi ..> ManagedObject : GET /v1/objects
    ObjectsApi ..> ObjectEvent : POST .../events
    ObjectsApi ..> ObjectInterval : POST .../intervals
    ObjectsApi ..> ServiceTask : POST .../service-tasks
    ManagedObject "1" --> "*" ObjectEvent
    ManagedObject "1" --> "*" ObjectInterval
    ManagedObject "1" --> "*" ServiceTask
    EventForm ..> CreateEventRequest : validates
    IntervalForm ..> CreateIntervalRequest : validates
    ServiceTaskForm ..> CreateServiceTaskRequest : validates
    CreateEventRequest ..> ObjectEvent : server adds id
    CreateIntervalRequest ..> ObjectInterval : server adds id, createdAt
    CreateServiceTaskRequest ..> ServiceTask : server adds id
```
