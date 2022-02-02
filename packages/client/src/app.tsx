import React, { FC } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import primary from '@mui/material/colors/indigo';
import secondary from '@mui/material/colors/amber';
import CssBaseline from '@mui/material/CssBaseline';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';

import { GOOGLE_FONT } from 'const/theme';
import Routers from 'routers';
import Notification from 'components/notification';

const THEME = createTheme({
  shape: {
    borderRadius: 21,
  },
  typography: {
    fontFamily: GOOGLE_FONT,
  },
  palette: {
    background: {
      default: grey[200],
    },
    primary: {
      main: primary[600],
    },
    secondary: {
      main: secondary[600],
    },
  },
});

const App: FC = () => {
  return (
    <ThemeProvider theme={THEME}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <CssBaseline>
          <Routers />
          <Notification />
        </CssBaseline>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
