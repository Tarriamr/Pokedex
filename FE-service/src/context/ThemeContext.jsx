import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {useAuth} from './AuthContext';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateUserPreferences} from '../services/api/auth'; // <<-- Import update function

// Helper function for anonymous theme
const getInitialAnonymousTheme = () => {
    console.log('[ThemeContext] Getting initial anonymous theme...');
    const storedTheme = localStorage.getItem('theme');
    console.log(`[ThemeContext] Theme from localStorage: ${storedTheme}`);
    if (storedTheme) return storedTheme;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log(`[ThemeContext] Prefers dark scheme: ${prefersDark}`);
    return prefersDark ? 'dark' : 'light';
};

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {
    },
    isUserPreference: false,
    isUpdatingTheme: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({children}) => {
    const {currentUser, isLoggedIn} = useAuth();
    const queryClient = useQueryClient();
    const [theme, setTheme] = useState(getInitialAnonymousTheme);
    const [isUserPreference, setIsUserPreference] = useState(false);

    console.log(`[ThemeContext] Initializing Provider. isLoggedIn: ${isLoggedIn}, Initial theme state: ${theme}`);

    // --- Mutation for updating theme preference --- //
    const updateThemeMutation = useMutation({
        mutationFn: ({userId, newTheme}) => updateUserPreferences(userId, {theme: newTheme}),
        onSuccess: (updatedUser) => {
            console.log('[ThemeContext] Theme updated successfully on server', updatedUser);
            queryClient.setQueryData(['user', currentUser?.id], updatedUser);
            setTheme(updatedUser.preferences.theme);
            console.log(`[ThemeContext] Theme state set to (from server): ${updatedUser.preferences.theme}`);
        },
        onError: (error) => {
            console.error("[ThemeContext] Failed to update theme on server:", error);
        },
    });

    // Effect to set initial theme based on auth state
    useEffect(() => {
        console.log(`[ThemeContext] Auth Effect Triggered. isLoggedIn: ${isLoggedIn}`);
        if (isLoggedIn && currentUser?.preferences?.theme) {
            const userTheme = currentUser.preferences.theme;
            console.log(`[ThemeContext] Setting theme from logged in user preference: ${userTheme}`);
            setTheme(userTheme);
            setIsUserPreference(true);
            if (localStorage.getItem('theme') !== userTheme) {
                try {
                    console.log('[ThemeContext] Removing theme from localStorage (user preference found).')
                    localStorage.removeItem('theme');
                } catch (error) {
                    console.error("[ThemeContext] Failed to remove theme from localStorage:", error);
                }
            }
        } else {
            console.log('[ThemeContext] Setting theme for anonymous user or no preference found.');
            const anonymousTheme = getInitialAnonymousTheme();
            setTheme(anonymousTheme);
            setIsUserPreference(false);
            console.log(`[ThemeContext] Theme state set to (anonymous/fallback): ${anonymousTheme}`);
        }
    }, [isLoggedIn, currentUser]);

    // Effect to update HTML class and localStorage (only for anonymous)
    useEffect(() => {
        console.log(`[ThemeContext] DOM/LocalStorage Effect Triggered. Current theme state: ${theme}, isLoggedIn: ${isLoggedIn}`);
        const root = window.document.documentElement;
        const currentClasses = root.className;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        console.log(`[ThemeContext] Updated HTML class. Old: '${currentClasses}', New: '${root.className}'`);

        if (!isLoggedIn) {
            try {
                console.log(`[ThemeContext] Setting theme in localStorage (anonymous): ${theme}`);
                localStorage.setItem('theme', theme);
            } catch (error) {
                console.error("[ThemeContext] Failed to save theme to localStorage:", error);
            }
        } else {
            console.log('[ThemeContext] Skipping localStorage update (user is logged in).');
        }
    }, [theme, isLoggedIn]);

    // Function to toggle theme
    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        console.log(`[ThemeContext] toggleTheme called. Current: ${theme}, New: ${newTheme}, isLoggedIn: ${isLoggedIn}`);

        if (isLoggedIn && currentUser) {
            console.log(`[ThemeContext] Calling mutation to update theme for user ${currentUser.id} to ${newTheme}`);
            updateThemeMutation.mutate({userId: currentUser.id, newTheme});
        } else {
            console.log(`[ThemeContext] Updating local theme state for anonymous user to ${newTheme}`);
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
