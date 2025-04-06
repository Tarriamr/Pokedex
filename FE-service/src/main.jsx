import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import queryClient from './queryClient.js';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* QueryClientProvider musi być na zewnątrz, aby AuthProvider i ThemeProvider miały dostęp */}
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                {/* AuthProvider obejmuje ThemeProvider */}
                <AuthProvider>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </AuthProvider>
            </BrowserRouter>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    </React.StrictMode>,
);
