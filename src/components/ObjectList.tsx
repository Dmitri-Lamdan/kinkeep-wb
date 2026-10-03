import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';
import HandshakeIcon from '@mui/icons-material/Handshake';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import SpeedIcon from '@mui/icons-material/Speed';
import type { ManagedObject, ObjectEvent, ObjectInterval } from '../types';

const OBJECT_TYPES = [
    { type: 'calendar', label: 'Calendar' },
    { type: 'mileage', label: 'Mileage' },
    { type: 'event', label: 'Event' },
    { type: 'combined', label: 'Combined' },
    { type: 'other', label: 'Other' },
] as const;

export interface ObjectListProps {
    objects: ManagedObject[];
    selectedId?: string;
    onSelectObject: (object: ManagedObject) => void;
}

export default function ObjectList({
    objects,
    selectedId,
    onSelectObject,
}: ObjectListProps) {
    return (
        <Card className="objectListCard">
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Objects
                </Typography>
                <Typography className="legend" variant="body2">
                    Loaded from GET /v1/objects
                </Typography>
                <Box className="objectTypeLegend" role="group" aria-label="Object type legend">
                    {OBJECT_TYPES.map(({ type, label }) => (
                        <Box className="objectTypeLegendItem" component="span" key={type}>
                            <ObjectTypeIcon type={type} />
                            <span>{label}</span>
                        </Box>
                    ))}
                </Box>
                <List dense disablePadding>
                    {objects.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No objects match the current filters.
                        </Typography>
                    ) : (
                        objects.map((object) => (
                            <ListItemButton
                                key={object.id}
                                selected={object.id === selectedId}
                                onClick={() => onSelectObject(object)}
                            >
                                <ListItemText
                                    primary={object.name}
                                    secondary={
                                        <Box className="objectSummary" component="span">
                                            <Box
                                                className="objectTypeIcon"
                                                component="span"
                                                role="img"
                                                aria-label={getObjectTypeLabel(object.type)}
                                            >
                                                <ObjectTypeIcon type={object.type} />
                                            </Box>
                                            <span>{getObjectSummary(object)}</span>
                                        </Box>
                                    }
                                />
                            </ListItemButton>
                        ))
                    )}
                </List>
            </CardContent>
        </Card>
    );
}

function getObjectSummary(object: ManagedObject): string {
    if (object.type === 'event') {
        const event = getLatestEvent(object.events);
        if (!event) {
            return `${object.status} · Event: — · Message: — · Timestamp: —`;
        }

        return `${object.status} · Event: ${event.eventType || '—'} · Message: ${event.message || '—'} · Timestamp: ${formatTimestamp(event.timestamp)}`;
    }

    if (object.type !== 'calendar') {
        return `${object.status} · ${object.currentValue.toFixed(2)}`;
    }

    const interval = getLatestInterval(object.intervals);
    const nextServiceDate = object.nextServiceDate
        ? new Date(`${object.nextServiceDate}T00:00:00`).toLocaleDateString()
        : '—';
    const intervalValue = interval
        ? `${interval.intervalValue} ${interval.intervalUnit}`
        : '—';

    return `${object.status} · Next service: ${nextServiceDate} · Interval: ${intervalValue}`;
}

function getObjectTypeLabel(type: string): string {
    return OBJECT_TYPES.find((objectType) => objectType.type === type)?.label ?? 'Other';
}

function ObjectTypeIcon({ type }: { type: string }) {
    switch (type) {
        case 'calendar':
            return <CalendarMonthIcon fontSize="small" aria-hidden="true" />;
        case 'mileage':
            return <SpeedIcon fontSize="small" aria-hidden="true" />;
        case 'event':
            return <HandshakeIcon fontSize="small" aria-hidden="true" />;
        case 'combined':
            return <MergeTypeIcon fontSize="small" aria-hidden="true" />;
        default:
            return <CategoryIcon fontSize="small" aria-hidden="true" />;
    }
}

function getLatestInterval(intervals: ObjectInterval[]): ObjectInterval | undefined {
    return intervals.reduce<ObjectInterval | undefined>((latest, interval) => {
        if (!latest) return interval;

        const intervalDate = Date.parse(interval.createdAt);
        const latestDate = Date.parse(latest.createdAt);
        return Number.isFinite(intervalDate) &&
            (!Number.isFinite(latestDate) || intervalDate > latestDate)
            ? interval
            : latest;
    }, undefined);
}

function getLatestEvent(events: ObjectEvent[]): ObjectEvent | undefined {
    return events.reduce<ObjectEvent | undefined>((latest, event) => {
        if (!latest) return event;

        const eventDate = Date.parse(event.timestamp);
        const latestDate = Date.parse(latest.timestamp);
        return Number.isFinite(eventDate) &&
            (!Number.isFinite(latestDate) || eventDate > latestDate)
            ? event
            : latest;
    }, undefined);
}

function formatTimestamp(value: string): string {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}
