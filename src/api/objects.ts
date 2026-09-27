import type { ManagedObject } from '../types';

const OBJECTS_PATH = '/v1/objects';

export interface CreateManagedObjectRequest {
    name: string;
    type: string;
    status?: string;
    currentValue?: number;
    nextServiceDate?: string;
}

export class ApiRequestError extends Error {
    public readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiRequestError';
        this.status = status;
    }
}

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

export async function createManagedObject(
    body: CreateManagedObjectRequest,
    signal?: AbortSignal,
): Promise<ManagedObject> {
    const response = await fetch(OBJECTS_PATH, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal,
    });

    if (!response.ok) {
        const details = await readErrorDetails(response);
        throw new ApiRequestError(
            `POST ${OBJECTS_PATH} failed (${response.status})${details ? `: ${details}` : ''}`,
            response.status,
        );
    }

    const created: unknown = await response.json();
    if (!isRecord(created) || typeof created.id !== 'string' || !created.id) {
        throw new Error(`POST ${OBJECTS_PATH} did not return a created object with an id`);
    }

    return normalizeObject(created);
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

async function readErrorDetails(response: Response): Promise<string> {
    const text = await response.text();
    if (!text) return '';

    try {
        const body: unknown = JSON.parse(text);
        if (isRecord(body)) {
            const message = body.message ?? body.detail ?? body.title;
            if (typeof message === 'string') return message;
        }
    } catch {
        return text;
    }

    return text;
}
