import React, { useEffect, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { ApiRequestError } from '../api/objects';
import type { CreateManagedObjectRequest } from '../api/objects';

export interface AddObjectDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (body: CreateManagedObjectRequest) => Promise<void>;
}

type FieldName = 'name' | 'type' | 'status' | 'currentValue' | 'nextServiceDate';
type FieldErrors = Partial<Record<FieldName, string>>;

interface FormValues {
    name: string;
    type: string;
    status: string;
    currentValue: string;
    nextServiceDate: string;
}

const OBJECT_TYPES = ['calendar', 'mileage', 'event', 'combined', 'other'];
const INITIAL_VALUES: FormValues = {
    name: '',
    type: '',
    status: 'active',
    currentValue: '0.00',
    nextServiceDate: '',
};

export default function AddObjectDialog({ open, onClose, onSubmit }: AddObjectDialogProps) {
    const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [requestError, setRequestError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const inputRefs = useRef<Partial<Record<FieldName, HTMLElement | null>>>({});

    useEffect(() => {
        if (!open) return;
        setValues(INITIAL_VALUES);
        setErrors({});
        setRequestError(null);
    }, [open]);

    const updateField = (field: FieldName, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
        setRequestError(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validateForm(values);
        setErrors(validationErrors);
        setRequestError(null);

        const invalidField = firstInvalidField(validationErrors);
        if (invalidField) {
            inputRefs.current[invalidField]?.focus();
            return;
        }

        const body: CreateManagedObjectRequest = {
            name: values.name.trim(),
            type: values.type,
            status: values.status,
        };
        if (values.currentValue.trim()) {
            body.currentValue = Number(values.currentValue);
        }
        if (values.nextServiceDate) {
            body.nextServiceDate = values.nextServiceDate;
        }

        setSubmitting(true);
        try {
            await onSubmit(body);
            onClose();
        } catch (cause) {
            if (cause instanceof ApiRequestError && cause.status === 409) {
                setErrors((current) => ({
                    ...current,
                    name: 'An object with this name already exists.',
                }));
                inputRefs.current.name?.focus();
            } else {
                setRequestError(
                    cause instanceof Error ? cause.message : 'Could not create object. Try again.',
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                if (!submitting) onClose();
            }}
            fullWidth
            maxWidth="sm"
            aria-labelledby="add-object-title"
        >
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogTitle id="add-object-title">Add Object</DialogTitle>
                <DialogContent dividers>
                    {requestError ? (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {requestError}
                        </Alert>
                    ) : null}
                    <TextField
                        inputRef={(element: HTMLInputElement | null) => {
                            inputRefs.current.name = element;
                        }}
                        autoFocus
                        autoComplete="off"
                        margin="normal"
                        fullWidth
                        required
                        label="Name"
                        value={values.name}
                        onChange={(event) => updateField('name', event.target.value)}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />
                    <FormControl fullWidth margin="normal" required error={Boolean(errors.type)}>
                        <InputLabel id="add-object-type-label">Type</InputLabel>
                        <Select
                            inputRef={(element: HTMLElement | null) => {
                                inputRefs.current.type = element;
                            }}
                            labelId="add-object-type-label"
                            id="add-object-type"
                            label="Type"
                            value={values.type}
                            onChange={(event) => updateField('type', event.target.value)}
                        >
                            {OBJECT_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.type ? <FormHelperText>{errors.type}</FormHelperText> : null}
                    </FormControl>
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="add-object-status-label">Status</InputLabel>
                        <Select
                            inputRef={(element: HTMLElement | null) => {
                                inputRefs.current.status = element;
                            }}
                            labelId="add-object-status-label"
                            id="add-object-status"
                            label="Status"
                            value={values.status}
                            onChange={(event) => updateField('status', event.target.value)}
                        >
                            <MenuItem value="active">active</MenuItem>
                            <MenuItem value="inactive">inactive</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        inputRef={(element: HTMLInputElement | null) => {
                            inputRefs.current.currentValue = element;
                        }}
                        margin="normal"
                        fullWidth
                        type="number"
                        label="Current value"
                        value={values.currentValue}
                        onChange={(event) => updateField('currentValue', event.target.value)}
                        error={Boolean(errors.currentValue)}
                        helperText={errors.currentValue ?? 'Up to 8 integer digits and 2 decimal places.'}
                        slotProps={{ htmlInput: { step: '0.01' } }}
                    />
                    <TextField
                        inputRef={(element: HTMLInputElement | null) => {
                            inputRefs.current.nextServiceDate = element;
                        }}
                        margin="normal"
                        fullWidth
                        type="date"
                        label="Next service date"
                        value={values.nextServiceDate}
                        onChange={(event) => updateField('nextServiceDate', event.target.value)}
                        error={Boolean(errors.nextServiceDate)}
                        helperText={errors.nextServiceDate}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? <CircularProgress size={20} color="inherit" /> : 'Save'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

function validateForm(values: FormValues): FieldErrors {
    const errors: FieldErrors = {};
    const trimmedName = values.name.trim();

    if (!trimmedName) {
        errors.name = 'Enter a name.';
    } else if (trimmedName.length > 255) {
        errors.name = 'Name must be 255 characters or fewer.';
    }

    if (!OBJECT_TYPES.includes(values.type)) {
        errors.type = 'Select a type.';
    }

    if (values.currentValue.trim() && !/^-?\d{1,8}(?:\.\d{1,2})?$/.test(values.currentValue)) {
        errors.currentValue = 'Enter a number with up to 8 integer digits and 2 decimal places.';
    }

    if (values.nextServiceDate && !isValidDate(values.nextServiceDate)) {
        errors.nextServiceDate = 'Enter a valid date in YYYY-MM-DD format.';
    }

    return errors;
}

function firstInvalidField(errors: FieldErrors): FieldName | undefined {
    return (['name', 'type', 'status', 'currentValue', 'nextServiceDate'] as const).find(
        (field) => Boolean(errors[field]),
    );
}

function isValidDate(value: string): boolean {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (year < 1 || month < 1 || month > 12) return false;

    const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const daysByMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return day >= 1 && day <= daysByMonth[month - 1];
}