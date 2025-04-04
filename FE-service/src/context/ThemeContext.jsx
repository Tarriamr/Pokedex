import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

// 1. Tworzenie kontekstu
const ThemeContext = createContext({
    theme: 'dark', // Domyślny motyw
    toggleTheme: () => {},
});

// 2. Hook do używania kontekstu
export const useTheme = () => useContext(ThemeContext);

// 3. Komponent Dostawcy (Provider)
export const ThemeProvider = ({ children }) => {
    // Stan przechowujący aktualny motyw ('light' lub 'dark')
    // Inicjalizacja z localStorage lub domyślnie 'dark'
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        // Sprawdzamy też preferencje systemowe jako fallback, jeśli nic nie ma w localStorage
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return storedTheme || (prefersDark ? 'dark' : 'light'); // Dajemy priorytet localStorage
        // Zmieniono domyślny na 'dark' zgodnie z ustaleniami, ale priorytet ma localStorage i preferencje systemowe
        // return storedTheme || 'dark';
    });

    // Efekt do aktualizacji klasy na <html> i zapisywania w localStorage
    useEffect(() => {
        const root = window.document.documentElement; // Pobieramy element <html>

        // Usuwamy poprzednią klasę motywu
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        // Dodajemy aktualną klasę motywu
        root.classList.add(theme);

        // Zapisujemy wybór w localStorage
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.error("Nie udało się zapisać motywu w localStorage:", error);
        }
    }, [theme]); // Efekt uruchamia się ponownie, gdy zmieni się 'theme'

    // Funkcja do przełączania motywu
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Wartość dostarczana przez kontekst
    const value = {
        theme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
