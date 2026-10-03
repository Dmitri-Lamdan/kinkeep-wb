import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ManagedObject } from '../types';
import ObjectList from './ObjectList';

describe('ObjectList', () => {
    it('shows details from the latest event for event objects', () => {
        const latestTimestamp = '2026-09-28T10:30:00Z';
        const eventObject = createObject({
            name: 'Event item',
            type: 'event',
            currentValue: 123.45,
            events: [
                {
                    id: 'old-event',
                    objectId: 'event-1',
                    userId: 'user-1',
                    timestamp: '2026-09-27T10:30:00Z',
                    eventType: 'inspection',
                    message: 'Older event',
                },
                {
                    id: 'latest-event',
                    objectId: 'event-1',
                    userId: 'user-1',
                    timestamp: latestTimestamp,
                    eventType: 'repair',
                    message: 'Replaced the filter',
                },
            ],
        });

        render(
            <ObjectList
                objects={[eventObject]}
                onSelectObject={() => undefined}
            />,
        );

        const eventRow = screen.getByRole('button', { name: /Event item/ });
        expect(eventRow).toContainElement(screen.getByRole('img', { name: 'Event' }));
        expect(eventRow).toHaveTextContent('Event: repair');
        expect(eventRow).toHaveTextContent('Message: Replaced the filter');
        expect(eventRow).toHaveTextContent(
            `Timestamp: ${new Date(latestTimestamp).toLocaleString()}`,
        );
        expect(eventRow).not.toHaveTextContent('Older event');
        expect(eventRow).not.toHaveTextContent('123.45');
        expect(screen.getByRole('group', { name: 'Object type legend' })).toHaveTextContent(
            'CalendarMileageEventCombinedOther',
        );
    });

    it('shows the next service date and latest interval for calendar objects', () => {
        const calendarObject = createObject({
            type: 'calendar',
            currentValue: 123.45,
            nextServiceDate: '2026-10-15',
            intervals: [
                {
                    id: 'old-interval',
                    objectId: 'calendar-1',
                    intervalValue: 12,
                    intervalUnit: 'MONTHS',
                    createdAt: '2025-01-01T00:00:00Z',
                },
                {
                    id: 'new-interval',
                    objectId: 'calendar-1',
                    intervalValue: 6,
                    intervalUnit: 'MONTHS',
                    createdAt: '2026-01-01T00:00:00Z',
                },
            ],
        });
        const mileageObject = createObject({
            id: 'mileage-1',
            name: 'Mileage item',
            type: 'mileage',
            currentValue: 123.45,
        });

        render(
            <ObjectList
                objects={[calendarObject, mileageObject]}
                onSelectObject={() => undefined}
            />,
        );

        const calendarRow = screen.getByRole('button', { name: /Calendar item/ });
        expect(calendarRow).toHaveTextContent('Next service:');
        expect(calendarRow).toHaveTextContent('10/15/2026');
        expect(calendarRow).toHaveTextContent('Interval: 6 MONTHS');
        expect(calendarRow).not.toHaveTextContent('123.45');
        expect(calendarRow).toContainElement(screen.getByRole('img', { name: 'Calendar' }));

        expect(screen.getByRole('button', { name: /Mileage item/ })).toHaveTextContent(
            '123.45',
        );
    });
});

function createObject(overrides: Partial<ManagedObject> = {}): ManagedObject {
    return {
        id: 'calendar-1',
        name: 'Calendar item',
        type: 'event',
        status: 'active',
        createdAt: '',
        updatedAt: '',
        lastChangeDate: '',
        currentValue: 0,
        nextServiceDate: '',
        events: [],
        intervals: [],
        serviceTasks: [],
        ...overrides,
    };
}