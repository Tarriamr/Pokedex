import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { loginUser, registerUser, getUserData } from '../services/api/auth.js';

const AuthContext = createContext({
    currentUser: null,
    isLoggedIn: false,
    isLoading: false,
    // error: null, // Removed error from context value signature
    login: async () => {},
    logout: () => {},
    register: async () => {},
    // clearError: () => {}, // Removed clearError
    isLoggingIn: false,
    isRegistering: false,
    isLoadingUser: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [loggedInUserId, setLoggedInUserId] = useState(() => {
        return localStorage.getItem('loggedInUserId');
    });
    // const [authError, setAuthError] = useState(null); // Removed authError state
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const { data: currentUser, isLoading: isLoadingUser, isError: isUserQueryError, error: userQueryError } = useQuery({
        queryKey: ['user', loggedInUserId],
        queryFn: () => getUserData(loggedInUserId),
        enabled: !!loggedInUserId,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setLoggedInUserId(data.id);
            localStorage.setItem('loggedInUserId', data.id);
            // setAuthError(null); // Removed
            enqueueSnackbar('Pomyślnie zalogowano!', { variant: 'success' });
        },
        onError: (err) => {
            const errorMessage = err.message || "Logowanie nie powiodło się. Sprawdź email i hasło.";
            enqueueSnackbar(errorMessage, { variant: 'error' });
            setLoggedInUserId(null);
            localStorage.removeItem('loggedInUserId');
        },
    });

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            // setAuthError(null); // Removed
            enqueueSnackbar('Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.', { variant: 'success' });
        },
        onError: (err) => {
            const errorMessage = err.message || "Rejestracja nie powiodła się.";
            // Don't set authError, rely on Notistack and local form error handling in Register.jsx
            enqueueSnackbar(errorMessage, { variant: 'error' });
        },
    });

    const login = useCallback(async (credentials) => {
        // setAuthError(null); // Removed
        // Error handling relies on mutation's onError and Notistack
        await loginMutation.mutateAsync(credentials);
    }, [loginMutation]);

    const logout = useCallback(() => {
        const userIdToClear = loggedInUserId;
        setLoggedInUserId(null);
        localStorage.removeItem('loggedInUserId');
        queryClient.removeQueries({ queryKey: ['user', userIdToClear], exact: true });
        enqueueSnackbar('Pomyślnie wylogowano.', { variant: 'info' });
    }, [queryClient, loggedInUserId, enqueueSnackbar]);

    const register = useCallback(async (userData) => {
        // setAuthError(null); // Removed
        // Error handling relies on mutation's onError, Notistack, and local form handling
        await registerMutation.mutateAsync(userData);
    }, [registerMutation]);

    // Removed clearError function as authError state is removed
    // const clearError = useCallback(() => {
    //   setAuthError(null);
    // }, []);

    const isLoggedIn = !!loggedInUserId && !!currentUser;
    const isLoading = loginMutation.isPending || registerMutation.isPending || (!!loggedInUserId && isLoadingUser);

    useEffect(() => {
        if (isUserQueryError) {
            console.error("Error fetching user data:", userQueryError);
            // Consider if automatic logout is desired here upon critical user data fetch failure
            // logout();
        }
    }, [isUserQueryError, userQueryError]);

    const value = useMemo(() => ({
        currentUser,
        isLoggedIn,
        isLoading,
        // error: authError, // Removed error state from value
        login,
        logout,
        register,
        // clearError, // Removed clearError from value
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        isLoadingUser: !!loggedInUserId && isLoadingUser,
    }), [
        currentUser, isLoggedIn, isLoading, /* authError removed */
        login, logout, register, /* clearError removed */
        loginMutation.isPending, registerMutation.isPending,
        loggedInUserId, isLoadingUser
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};