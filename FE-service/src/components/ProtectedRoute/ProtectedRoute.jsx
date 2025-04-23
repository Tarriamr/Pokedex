import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

// Komponent chroniący trasy wymagające zalogowania
const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, isLoading } = useAuth();
    const location = useLocation(); // Pobierz aktualną lokalizację

    // 1. Pokaż loader, jeśli stan autentykacji jest jeszcze sprawdzany
    if (isLoading) {
        return (
            <div className={clsx(
                "flex justify-center items-center min-h-[calc(100vh-160px)]", // Przykładowa wysokość, aby loader był widoczny
                "text-xl text-pokemon-blue dark:text-pokemon-blue-light"
            )}>
                Sprawdzanie autentykacji...
            </div>
        );
    }

    // 2. Jeśli użytkownik nie jest zalogowany, przekieruj na /login
    //    Zapamiętaj obecną lokalizację, aby wrócić po zalogowaniu
    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Jeśli zalogowany, renderuj komponent potomny (Outlet dla zagnieżdżonych tras lub children dla pojedynczej)
    //    Użyjemy Outlet, zakładając, że będziemy go używać do opakowania tras w App.jsx
    //    Jeśli przekazujemy pojedynczy komponent jako children, to return children;
    return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node, // Opcjonalny, jeśli używamy jako wrapper dla <Outlet/>
};

export default ProtectedRoute;
