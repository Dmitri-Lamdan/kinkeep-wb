import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ObjectsManager from './ObjectsManager';

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('ObjectsManager Add Object flow', () => {
    it('clears active filters and selects the created object', async () => {
        const existingObject = {
            id: 'existing-id',
            name: 'Existing object',
            type: 'event',
            status: 'inactive',
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
            lastChangeDate: '2026-01-01T00:00:00Z',
            currentValue: 0,
            events: [],
            intervals: [],
            serviceTasks: [],
        };
        const createdObject = {
            id: 'created-id',
            name: 'Pump',
            type: 'calendar',
            status: 'active',
            createdAt: '2026-09-27T00:00:00Z',
            updatedAt: '2026-09-27T00:00:00Z',
            lastChangeDate: '2026-09-27T00:00:00Z',
            currentValue: 0,
        };
        const fetchMock = vi.fn(async (_input: RequestInfo | URL, options?: RequestInit) => {
            if (options?.method === 'POST') {
                return new Response(JSON.stringify(createdObject), {
                    status: 201,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            return new Response(JSON.stringify([existingObject]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        });
        vi.stubGlobal('fetch', fetchMock);
        const user = userEvent.setup();
        render(React.createElement(ObjectsManager));

        await screen.findByText('Existing object');
        await user.click(screen.getByRole('combobox', { name: 'Filter Type' }));
        await user.click(screen.getByRole('option', { name: 'event' }));
        await user.click(screen.getByRole('combobox', { name: 'Filter Status' }));
        await user.click(screen.getByRole('option', { name: 'inactive' }));
        await user.type(screen.getByRole('textbox', { name: 'Search' }), 'does not match');
        await user.click(screen.getByRole('button', { name: 'Add Object' }));

        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Pump');
        await user.click(screen.getByRole('combobox', { name: 'Type' }));
        await user.click(screen.getByRole('option', { name: 'calendar' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Name: Pump')).toBeInTheDocument());
        expect(screen.getByRole('combobox', { name: 'Filter Type' })).toHaveTextContent('All');
        expect(screen.getByRole('combobox', { name: 'Filter Status' })).toHaveTextContent('All');
        expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('');
        expect(screen.getByRole('tab', { name: 'Events (0)' })).toBeInTheDocument();

        const postCall = fetchMock.mock.calls.find(([, options]) => options?.method === 'POST');
        expect(JSON.parse(String(postCall?.[1]?.body))).toEqual({
            name: 'Pump',
            type: 'calendar',
            status: 'active',
            currentValue: 0,
        });
    });
});