import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // Ikony słońca i księżyca
import clsx from 'clsx';

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useTheme();

    // Określenie etykiety dla dostępności
    const ariaLabel = `Przełącz na tryb ${theme === 'light' ? 'ciemny' : 'jasny'}`;

    return (
        <button
            onClick={toggleTheme}
            aria-label={ariaLabel}
            title={ariaLabel} // Dodatkowy tooltip dla jasności
            className={clsx(
                "p-2 rounded-full transition-colors duration-200 ease-in-out",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                // Kolory - dopasowane do stopki i nawigacji, aby były widoczne na czerwonym/ciemnym tle nagłówka
                "text-pokemon-yellow-light hover:text-white", // Jasnożółty, biały na hover
                "dark:text-pokemon-yellow-light dark:hover:text-white", // Takie same kolory w dark mode na ciemnym tle nagłówka
                "focus:ring-pokemon-yellow focus:ring-offset-pokemon-red dark:focus:ring-offset-pokemon-red-dark" // Pierścień focus
            )}
        >
            {theme === 'light' ? (
                <MoonIcon className="h-6 w-6" aria-hidden="true" /> // Pokaż ikonę księżyca, aby przełączyć na dark
            ) : (
                <SunIcon className="h-6 w-6" aria-hidden="true" /> // Pokaż ikonę słońca, aby przełączyć na light
            )}
        </button>
    );
};

export default ThemeToggleButton;
