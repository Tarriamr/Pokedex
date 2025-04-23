import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserPreferences } from '../services/api/auth';

// Helper function for anonymous theme
const getInitialAnonymousTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
};

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {},
    isUserPreference: false,
    isUpdatingTheme: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const { currentUser, isLoggedIn } = useAuth();
    const queryClient = useQueryClient();
    const [theme, setTheme] = useState(getInitialAnonymousTheme);
    const [isUserPreference, setIsUserPreference] = useState(false);

    // --- Mutation for updating theme preference --- //
    const updateThemeMutation = useMutation({
        mutationFn: ({ userId, newTheme }) => updateUserPreferences(userId, { theme: newTheme }),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['user', currentUser?.id], updatedUser);
            setTheme(updatedUser.preferences.theme);
        },
        onError: (error) => {
            console.error("[ThemeContext] Failed to update theme on server:", error);
        },
    });

    // Effect to set initial theme based on auth state
    useEffect(() => {
        if (isLoggedIn && currentUser?.preferences?.theme) {
            const userTheme = currentUser.preferences.theme;
            setTheme(userTheme);
            setIsUserPreference(true);
            // Remove anonymous theme preference if user preference exists
            if (localStorage.getItem('theme') !== userTheme) {
                try {
                    localStorage.removeItem('theme');
                } catch (error) {
                    console.error("[ThemeContext] Failed to remove theme from localStorage:", error);
                }
            }
        } else {
            const anonymousTheme = getInitialAnonymousTheme();
            setTheme(anonymousTheme);
            setIsUserPreference(false);
        }
    }, [isLoggedIn, currentUser]);

    // Effect to update HTML class and localStorage (only for anonymous)
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Only store in localStorage if user is NOT logged in
        if (!isLoggedIn) {
            try {
                localStorage.setItem('theme', theme);
            } catch (error) {
                console.error("[ThemeContext] Failed to save theme to localStorage:", error);
            }
        }
    }, [theme, isLoggedIn]);

    // Function to toggle theme
    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        if (isLoggedIn && currentUser) {
            updateThemeMutation.mutate({ userId: currentUser.id, newTheme });
        } else {
            setTheme(newTheme);
        }
    }, [theme, isLoggedIn, currentUser, updateThemeMutation]);

    const value = useMemo(() => ({
        theme,
        toggleTheme,
        isUserPreference,
        isUpdatingTheme: updateThemeMutation.isPending,
    }), [theme, toggleTheme, isUserPreference, updateThemeMutation.isPending]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};