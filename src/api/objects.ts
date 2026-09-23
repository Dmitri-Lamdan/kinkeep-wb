import type { ManagedObject } from '../types';

const OBJECTS_PATH = '/v1/objects';

export async function fetchObjects(signal?: AbortSignal): Promise<ManagedObject[]> {
    const response = await fetch(OBJECTS_PATH, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal,
    });

    if (!response.ok) {
        throw new Error(`GET ${OBJECTS_PATH} failed (${response.status})`);
    }

    const body: unknown = await response.json();
    if (!Array.isArray(body)) {
        throw new Error(`GET ${OBJECTS_PATH} did not return an array`);
    }

    return body.map(normalizeObject);
}

function normalizeObject(value: unknown): ManagedObject {
    const record = isRecord(value) ? value : {};
    return {
        id: asString(record.id),
        name: asString(record.name),
        type: asString(record.type),
        status: asString(record.status),
        createdAt: asString(record.createdAt),
        updatedAt: asString(record.updatedAt),
        lastChangeDate: asString(record.lastChangeDate),
        currentValue: asNumber(record.currentValue),
        nextServiceDate: asString(record.nextServiceDate),
        events: asArray(record.events).map(normalizeEvent),
        intervals: asArray(record.intervals).map(normalizeInterval),
        serviceTasks: asArray(record.serviceTasks).map(normalizeServiceTask),
    };
}

function normalizeEvent(value: unknown) {
    const record = isRecord(value) ? value : {};
    return {
        id: asString(record.id),
        objectId: asString(record.objectId),
        userId: asString(record.userId),
        timestamp: asString(record.timestamp),
        eventType: asString(record.eventType),
        message: asString(record.message),
    };
}

function normalizeInterval(value: unknown) {
    const record = isRecord(value) ? value : {};
    return {
        id: asString(record.id),
        objectId: asString(record.objectId),
        intervalValue: asNumber(record.intervalValue),
        intervalUnit: asString(record.intervalUnit),
        createdAt: asString(record.createdAt),
    };
}

function normalizeServiceTask(value: unknown) {
    const record = isRecord(value) ? value : {};
    return {
        ...record,
        id: record.id == null ? undefined : asString(record.id),
        objectId: record.objectId == null ? undefined : asString(record.objectId),
        name: record.name == null ? undefined : asString(record.name),
        status: record.status == null ? undefined : asString(record.status),
        dueDate: record.dueDate == null ? undefined : asString(record.dueDate),
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function asArray(value: unknown): unknown[] {
    return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return '';
}

function asNumber(value: unknown): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}
