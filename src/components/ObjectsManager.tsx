import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { fetchObjects } from '../api/objects';
import type { ManagedObject } from '../types';
import FilterBar from './FilterBar';
import ObjectDetails from './ObjectDetails';
import ObjectList from './ObjectList';

export default function ObjectsManager() {
    const [objects, setObjects] = useState<ManagedObject[]>([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadObjects = useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        setError(null);
        try {
            const loaded = await fetchObjects(signal);
            setObjects(loaded);
            setSelectedId((current) =>
                current && loaded.some((object) => object.id === current)
                    ? current
                    : loaded[0]?.id,
            );
        } catch (cause) {
            if (signal?.aborted) return;
            const message =
                cause instanceof Error ? cause.message : 'Failed to load objects';
            setError(message);
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        void loadObjects(controller.signal);
        return () => controller.abort();
    }, [loadObjects]);

    const typeOptions = useMemo(
        () => uniqueValues(objects.map((object) => object.type)),
        [objects],
    );
    const statusOptions = useMemo(
        () => uniqueValues(objects.map((object) => object.status)),
        [objects],
    );

    const filteredObjects = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return objects.filter((object) => {
            if (typeFilter && object.type !== typeFilter) return false;
            if (statusFilter && object.status !== statusFilter) return false;
            if (query && !object.name.toLowerCase().includes(query)) return false;
            return true;
        });
    }, [objects, typeFilter, statusFilter, searchQuery]);

    const selectedObject = objects.find((object) => object.id === selectedId);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Loading Process – Objects Manager
            </Typography>
            <FilterBar
                typeFilter={typeFilter}
                statusFilter={statusFilter}
                searchQuery={searchQuery}
                typeOptions={typeOptions}
                statusOptions={statusOptions}
                onTypeFilterChange={setTypeFilter}
                onStatusFilterChange={setStatusFilter}
                onSearchQueryChange={setSearchQuery}
            />
            {error ? (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Button color="inherit" size="small" onClick={() => void loadObjects()}>
                            Retry
                        </Button>
                    }
                >
                    Could not load objects from GET /v1/objects. {error}
                </Alert>
            ) : null}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <ObjectList
                            objects={filteredObjects}
                            selectedId={selectedId}
                            onSelectObject={(object) => {
                                setSelectedId(object.id);
                                setActiveTab(0);
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <ObjectDetails
                            selectedObject={selectedObject}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}

function uniqueValues(values: string[]): string[] {
    return [...new Set(values.filter(Boolean))].sort();
}
