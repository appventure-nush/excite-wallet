import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00a499',
    },
    secondary: {
      main: '#333f48',
    },
    error: {
      main: red.A400,
    },
  },
});


export default theme;