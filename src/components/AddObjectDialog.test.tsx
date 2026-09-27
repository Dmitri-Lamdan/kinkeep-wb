import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '../api/objects';
import AddObjectDialog from './AddObjectDialog';

describe('AddObjectDialog', () => {
    it('shows required-field validation before submitting', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(
            React.createElement(AddObjectDialog, {
                open: true,
                onClose: vi.fn(),
                onSubmit,
            }),
        );

        expect(screen.queryByText('Select a type')).not.toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(screen.getByText('Enter a name.')).toBeInTheDocument();
        expect(screen.getByText('Select a type.')).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('trims the name and submits a valid request', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        render(
            React.createElement(AddObjectDialog, {
                open: true,
                onClose: vi.fn(),
                onSubmit,
            }),
        );

        await user.type(screen.getByRole('textbox', { name: 'Name' }), '  Pump  ');
        await user.click(screen.getByRole('combobox', { name: 'Type' }));
        await user.click(screen.getByRole('option', { name: 'mileage' }));
        const valueField = screen.getByRole('spinbutton', { name: 'Current value' });
        await user.clear(valueField);
        await user.type(valueField, '-12.50');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() =>
            expect(onSubmit).toHaveBeenCalledWith({
                name: 'Pump',
                type: 'mileage',
                status: 'active',
                currentValue: -12.5,
            }),
        );
    });

    it('shows a duplicate-name response on the Name field', async () => {
        const user = userEvent.setup();
        const onSubmit = vi
            .fn()
            .mockRejectedValue(new ApiRequestError('Duplicate name', 409));
        render(
            React.createElement(AddObjectDialog, {
                open: true,
                onClose: vi.fn(),
                onSubmit,
            }),
        );

        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Pump');
        await user.click(screen.getByRole('combobox', { name: 'Type' }));
        await user.click(screen.getByRole('option', { name: 'mileage' }));
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(
            await screen.findByText('An object with this name already exists.'),
        ).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});