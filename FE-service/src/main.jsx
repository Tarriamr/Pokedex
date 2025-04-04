import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query'; // Zakładając użycie React Query
import { BrowserRouter } from 'react-router-dom'; // Zakładając użycie React Router
import App from './App.jsx';
import queryClient from './queryClient.js'; // Zakładając istnienie pliku konfiguracyjnego queryClient
import { ThemeProvider } from './context/ThemeContext.jsx'; // <<-- IMPORT ThemeProvider
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Owijamy aplikację w ThemeProvider */}
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
                {/* Opcjonalne devtools dla React Query */}
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
