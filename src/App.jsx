import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CustomsProvider } from './context/CustomsContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <CustomsProvider>
        <AppRoutes />
      </CustomsProvider>
    </BrowserRouter>
  );
}
