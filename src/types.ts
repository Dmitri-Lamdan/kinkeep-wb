export type ObjectType = string;
export type ObjectStatus = string;
export type IntervalUnit = 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS' | string;

export interface ObjectEvent {
    id: string;
    objectId: string;
    userId: string;
    timestamp: string;
    eventType: string;
    message: string;
}

export interface ObjectInterval {
    id: string;
    objectId: string;
    intervalValue: number;
    intervalUnit: IntervalUnit;
    createdAt: string;
}

export interface ServiceTask {
    id?: string;
    objectId?: string;
    name?: string;
    status?: string;
    dueDate?: string;
    [key: string]: unknown;
}

export interface ManagedObject {
    id: string;
    name: string;
    type: ObjectType;
    status: ObjectStatus;
    createdAt: string;
    updatedAt: string;
    lastChangeDate: string;
    currentValue: number;
    nextServiceDate: string;
    events: ObjectEvent[];
    intervals: ObjectInterval[];
    serviceTasks: ServiceTask[];
}
