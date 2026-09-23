import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { ManagedObject, ObjectInterval, ServiceTask } from '../types';
import EventsTable from './EventsTable';

export interface ObjectDetailsProps {
    selectedObject?: ManagedObject;
    activeTab: number;
    onTabChange: (index: number) => void;
}

export default function ObjectDetails({
    selectedObject,
    activeTab,
    onTabChange,
}: ObjectDetailsProps) {
    return (
        <Card className="objectDetailsCard">
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Object Details
                </Typography>
                {!selectedObject ? (
                    <Typography color="text.secondary">
                        Select an object to view details.
                    </Typography>
                ) : (
                    <>
                        <Tabs
                            value={activeTab}
                            onChange={(_event, value: number) => onTabChange(value)}
                            variant="scrollable"
                        >
                            <Tab label="Details" />
                            <Tab label={`Events (${selectedObject.events.length})`} />
                            <Tab label={`Intervals (${selectedObject.intervals.length})`} />
                            <Tab label={`Service tasks (${selectedObject.serviceTasks.length})`} />
                        </Tabs>
                        <Box sx={{ pt: 2 }}>
                            {activeTab === 0 ? <DetailsSection object={selectedObject} /> : null}
                            {activeTab === 1 ? (
                                <EventsTable events={selectedObject.events} />
                            ) : null}
                            {activeTab === 2 ? (
                                <IntervalsTable intervals={selectedObject.intervals} />
                            ) : null}
                            {activeTab === 3 ? (
                                <ServiceTasksTable tasks={selectedObject.serviceTasks} />
                            ) : null}
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function DetailsSection({ object }: { object: ManagedObject }) {
    return (
        <Box className="detailsSection">
            <Typography>Name: {object.name}</Typography>
            <Typography>Type: {object.type}</Typography>
            <Typography>Status: {object.status}</Typography>
            <Typography>Current value: {object.currentValue.toFixed(2)}</Typography>
            <Typography>Next service: {formatDate(object.nextServiceDate)}</Typography>
            <Typography>Created: {formatDate(object.createdAt)}</Typography>
            <Typography>Updated: {formatDate(object.updatedAt)}</Typography>
            <Typography>Last change: {formatDate(object.lastChangeDate)}</Typography>
            <Typography variant="body2" color="text.secondary">
                ID: {object.id}
            </Typography>
        </Box>
    );
}

function IntervalsTable({ intervals }: { intervals: ObjectInterval[] }) {
    if (intervals.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                No intervals for this object.
            </Typography>
        );
    }

    return (
        <Table className="eventsTable" size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Value</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Created</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {intervals.map((interval) => (
                    <TableRow key={interval.id}>
                        <TableCell>{interval.intervalValue}</TableCell>
                        <TableCell>{interval.intervalUnit}</TableCell>
                        <TableCell>{formatDate(interval.createdAt)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function ServiceTasksTable({ tasks }: { tasks: ServiceTask[] }) {
    if (tasks.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                No service tasks for this object.
            </Typography>
        );
    }

    return (
        <Table className="eventsTable" size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Due</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {tasks.map((task, index) => (
                    <TableRow key={task.id ?? index}>
                        <TableCell>{task.name ?? "—"}</TableCell>
                        <TableCell>{task.status ?? "—"}</TableCell>
                        <TableCell>{task.dueDate ? formatDate(task.dueDate) : "—"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function formatDate(value: string): string {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
}
