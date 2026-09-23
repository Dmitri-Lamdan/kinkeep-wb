import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { ObjectEvent } from '../types';

export interface EventsTableProps {
    events: ObjectEvent[];
}

export default function EventsTable({ events }: EventsTableProps) {
    if (events.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                No events for this object.
            </Typography>
        );
    }

    return (
        <Table className="eventsTable" size="small">
            <TableHead>
                <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Message</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {events.map((event) => (
                    <TableRow key={event.id}>
                        <TableCell>{event.userId}</TableCell>
                        <TableCell>{formatTimestamp(event.timestamp)}</TableCell>
                        <TableCell>{event.eventType}</TableCell>
                        <TableCell>{event.message}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function formatTimestamp(value: string): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
}
