// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';

import { baselightTheme } from "./theme/DefaultColors";
import { UserProvider } from './context/UserContext';

function App() {
  
  const routing = useRoutes(Router);
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        {routing}
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;