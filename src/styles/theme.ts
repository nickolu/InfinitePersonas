// styles/theme.ts
import {createTheme} from '@mui/material/styles';

const spacing = 8;
const theme = createTheme({
  typography: {
    fontFamily: '"Courier Prime", monospace',
    h1: {
      fontSize: '2rem',
    },
  },
  spacing,
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          marginBottom: `${spacing * 2}px`,
        },
      },
    },
  },
});

export default theme;
