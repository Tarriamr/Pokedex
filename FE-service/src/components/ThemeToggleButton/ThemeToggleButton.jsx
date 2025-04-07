import React from 'react';
import {useTheme} from '../../context/ThemeContext';
import {MoonIcon, SunIcon} from '@heroicons/react/24/solid';
import clsx from 'clsx';

const ThemeToggleButton = () => {
    const {theme, toggleTheme, isUpdatingTheme} = useTheme();

    const ariaLabel = `Przełącz na tryb ${theme === 'light' ? 'ciemny' : 'jasny'}`;

    return (
        <button
            onClick={toggleTheme}
            disabled={isUpdatingTheme}
            aria-label={ariaLabel}
            title={ariaLabel}
            className={clsx(
                "p-2 rounded-full transition-all duration-150 ease-in-out",
                "focus:outline-none", // Usunięcie domyślnego outline
                // Style wskaźnika fokusu tylko dla `focus-visible`
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                // Kolory
                "text-pokemon-yellow-light hover:text-white",
                "dark:text-pokemon-yellow-light dark:hover:text-white",
                // Kolory wskaźnika fokusu
                "focus-visible:ring-pokemon-yellow focus-visible:ring-offset-pokemon-red dark:focus-visible:ring-offset-pokemon-red-dark",
                "active:scale-95 active:brightness-90",
                isUpdatingTheme && "opacity-50 cursor-not-allowed"
            )}
        >
            {theme === 'light' ? (
                <MoonIcon className="h-6 w-6" aria-hidden="true"/>
            ) : (
                <SunIcon className="h-6 w-6" aria-hidden="true"/>
            )}
        </button>
    );
};

export default ThemeToggleButton;
