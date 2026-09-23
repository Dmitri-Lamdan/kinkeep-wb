import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import type { SelectChangeEvent } from '@mui/material/Select';

export interface FilterBarProps {
    typeFilter: string;
    statusFilter: string;
    searchQuery: string;
    typeOptions: string[];
    statusOptions: string[];
    onTypeFilterChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
    onSearchQueryChange: (value: string) => void;
}

export default function FilterBar({
    typeFilter,
    statusFilter,
    searchQuery,
    typeOptions,
    statusOptions,
    onTypeFilterChange,
    onStatusFilterChange,
    onSearchQueryChange,
}: FilterBarProps) {
    const handleType = (event: SelectChangeEvent) => {
        onTypeFilterChange(event.target.value);
    };

    const handleStatus = (event: SelectChangeEvent) => {
        onStatusFilterChange(event.target.value);
    };

    return (
        <Box className="filterBar">
            <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="filter-type-label">Filter Type</InputLabel>
                <Select
                    labelId="filter-type-label"
                    label="Filter Type"
                    value={typeFilter}
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
                <InputLabel id="filter-status-label">Filter Status</InputLabel>
                <Select
                    labelId="filter-status-label"
                    label="Filter Status"
                    value={statusFilter}
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

            <TextField
                size="small"
                label="Search"
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                sx={{ minWidth: 220, flex: 1 }}
            />
        </Box>
    );
}
