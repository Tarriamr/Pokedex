import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext'; // Poprawiono ścieżkę do ThemeContext

const Logo = () => {
    const { theme } = useTheme(); // Pobierz aktualny motyw

    return (
        <Link
            to="/"
            // Użyjemy ciemniejszego niebieskiego cienia dla logo w trybie light,
            // a jaśniejszego żółtego/białego w trybie dark
            className={clsx(
                "text-3xl font-bold tracking-wider",
                "text-pokemon-yellow", // Żółty tekst zawsze
                // Dodano cień zależny od motywu
                theme === 'light'
                    ? "drop-shadow-[2px_2px_3px_rgba(42,117,187,0.6)]" // Niebieski cień w light mode
                    : "drop-shadow-[2px_2px_3px_rgba(255,203,5,0.5)]" // Żółty cień w dark mode

            )}
        >
            PokéMoN
        </Link>
    );
};

export default Logo;
