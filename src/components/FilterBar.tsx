import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import type { SelectChangeEvent } from '@mui/material/Select';

export interface FilterBarProps {
    header: React.ReactNode;
    typeFilter: string;
    statusFilter: string;
    searchQuery: string;
    typeOptions: string[];
    statusOptions: string[];
    addDisabled?: boolean;
    onTypeFilterChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
    onSearchQueryChange: (value: string) => void;
    onAddObject: React.MouseEventHandler<HTMLButtonElement>;
}

export default function FilterBar({
    header,
    typeFilter,
    statusFilter,
    searchQuery,
    typeOptions,
    statusOptions,
    addDisabled = false,
    onTypeFilterChange,
    onStatusFilterChange,
    onSearchQueryChange,
    onAddObject,
}: FilterBarProps) {
    const handleType = (event: SelectChangeEvent) => {
        onTypeFilterChange(event.target.value);
    };

    const handleStatus = (event: SelectChangeEvent) => {
        onStatusFilterChange(event.target.value);
    };

    return (
        <Box className="filterBar">
            <Box className="filterBarHeader">
                {header}
                <Box className="filterBarControls">
                    <Box className="filterBarPrimaryFilters">
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel id="filter-type-label" shrink>
                                Filter Type
                            </InputLabel>
                            <Select
                                labelId="filter-type-label"
                                label="Filter Type"
                                value={typeFilter}
                                displayEmpty
                                onChange={handleType}
                            >
                                <MenuItem value="">All</MenuItem>
                                {typeOptions.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel id="filter-status-label" shrink>
                                Filter Status
                            </InputLabel>
                            <Select
                                labelId="filter-status-label"
                                label="Filter Status"
                                value={statusFilter}
                                displayEmpty
                                onChange={handleStatus}
                            >
                                <MenuItem value="">All</MenuItem>
                                {statusOptions.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box className="filterBarActions">
                        <TextField
                            size="small"
                            label="Search"
                            value={searchQuery}
                            onChange={(event) => onSearchQueryChange(event.target.value)}
                            sx={{ minWidth: 220, flex: 1 }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={onAddObject}
                            disabled={addDisabled}
                        >
                            Add Object
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
