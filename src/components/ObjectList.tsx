import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import type { ManagedObject } from '../types';

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
                                    secondary={`${object.type} · ${object.status} · ${object.currentValue.toFixed(2)}`}
                                />
                            </ListItemButton>
                        ))
                    )}
                </List>
            </CardContent>
        </Card>
    );
}
