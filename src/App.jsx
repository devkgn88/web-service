// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';

import { baselightTheme } from "./theme/DefaultColors";
import { AuthProvider } from './auth/AuthContext';


function App() {
  const theme = baselightTheme;
  const routing = useRoutes(Router);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
          {routing}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;