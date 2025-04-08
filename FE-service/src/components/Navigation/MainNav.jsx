import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

// Style podstawowe
const buttonBaseStyle = "px-4 py-2 rounded font-semibold shadow transition-colors duration-200 ease-in-out focus:outline-none text-sm";

// Style dla nieaktywnych linków (z focus-visible)
const inactiveNavLinkStyle = "bg-pokemon-yellow text-pokemon-blue-dark hover:bg-pokemon-yellow-dark focus-visible:ring-2 focus-visible:ring-pokemon-yellow focus-visible:ring-offset-1";

// Style dla AKTYWNEGO linku (ze stałym ringiem)
const activeNavLinkStyle = "bg-pokemon-yellow-dark text-pokemon-blue-dark font-bold ring-2 ring-pokemon-blue-dark ring-offset-1";

// Style dla przycisku "Wyloguj" (z focus-visible)
const logoutButtonBaseBgTextStyle = "bg-pokemon-gray-dark text-white";
const logoutButtonHoverFocusStyle = "hover:bg-pokemon-gray-darker focus-visible:ring-2 focus-visible:ring-pokemon-gray-dark focus-visible:ring-offset-1";

const MainNav = () => {
    const { logout } = useAuth();
    const { theme } = useTheme();
    const location = useLocation();
    const currentPath = location.pathname;

    const handleLogout = () => {
        logout();
    };

    // Klasy dla pierścienia (konturu) zależne od motywu - dla NIEAKTYWNYCH przycisków
    const ringClass = theme === 'light'
        ? "ring-1 ring-pokemon-blue-dark"
        : "dark:ring-1 dark:ring-pokemon-yellow";

    // Funkcja pomocnicza do generowania klas dla linków nawigacyjnych
    const getNavLinkClasses = (path) => {
        const isActive = currentPath === path;
        return clsx(
            buttonBaseStyle,
            isActive ? activeNavLinkStyle : inactiveNavLinkStyle,
            !isActive && ringClass // Dodaj ring tylko dla nieaktywnych
        );
    };

    return (
        <div className="flex items-center space-x-2">

            <Link
                to="/"
                className={getNavLinkClasses('/')}
                aria-current={currentPath === '/' ? 'page' : undefined}
            >
                Pokedex
            </Link>

            <Link
                to="/favourites"
                className={getNavLinkClasses('/favourites')}
                aria-current={currentPath === '/favourites' ? 'page' : undefined}
            >
                Ulubione
            </Link>

            <Link
                to="/arena"
                className={getNavLinkClasses('/arena')}
                aria-current={currentPath === '/arena' ? 'page' : undefined}
            >
                Arena
            </Link>

            {/* Dodano link do Rankingu */}
            <Link
                to="/ranking"
                className={getNavLinkClasses('/ranking')}
                aria-current={currentPath === '/ranking' ? 'page' : undefined}
            >
                Ranking
            </Link>

            {/* Usunięto link do Edycji (zgodnie z harmonogramem jeszcze nie istnieje?) */}
            {/* <Link
                to="/edit"
                className={getNavLinkClasses('/edit')}
                aria-current={currentPath === '/edit' ? 'page' : undefined}
            >
                Edycja
            </Link> */}

            <button
                onClick={handleLogout}
                className={clsx(buttonBaseStyle, logoutButtonBaseBgTextStyle, logoutButtonHoverFocusStyle, ringClass)}
            >
                Wyloguj
            </button>
        </div>
    );
};

export default MainNav;
