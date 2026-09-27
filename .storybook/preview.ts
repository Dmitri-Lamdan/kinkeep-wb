import { createElement } from 'react';
import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../src/theme.js';

const preview: Preview = {
    decorators: [
        (Story) => createElement(ThemeProvider, { theme }, createElement(Story)),
    ],
};

export default preview;