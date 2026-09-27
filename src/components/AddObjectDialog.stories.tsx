import type { Meta, StoryObj } from '@storybook/react-vite';
import AddObjectDialog from './AddObjectDialog';

const meta = {
    title: 'Objects/AddObjectDialog',
    component: AddObjectDialog,
    args: {
        open: true,
        onClose: () => undefined,
        onSubmit: async () => undefined,
    },
} satisfies Meta<typeof AddObjectDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};