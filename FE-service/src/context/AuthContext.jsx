import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getUserData, loginUser, registerUser} from '../services/api/auth.js';

const AuthContext = createContext({
    currentUser: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
    login: async () => {
    },
    logout: () => {
    },
    register: async () => {
    },
    clearError: () => {
    },
    isLoggingIn: false,
    isRegistering: false,
    isLoadingUser: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();

    const {
        data: currentUser,
        isLoading: isLoadingUser,
        isError: isUserQueryError,
        error: userQueryError
    } = useQuery({
        queryKey: ['user', loggedInUserId],
        queryFn: () => getUserData(loggedInUserId),
        enabled: !!loggedInUserId,
        staleTime: 5 * 60 * 1000,
        retry: 1
    });

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            // console.log("Login successful, userId:", data.id); // Usunięto log
            setLoggedInUserId(data.id);
            setError(null);
        },
        onError: (err) => {
            setError(err.message || "Logowanie nie powiodło się.");
            setLoggedInUserId(null);
        },
    });

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            // console.log("Registration successful:", data); // Usunięto log
            setError(null);
        },
        onError: (err) => {
            setError(err.message || "Rejestracja nie powiodła się.");
        },
    });

    const login = useCallback(async (credentials) => {
        setError(null);
        await loginMutation.mutateAsync(credentials);
    }, [loginMutation]);

    const logout = useCallback(() => {
        // console.log("Wylogowywanie"); // Usunięto log
        setLoggedInUserId(null);
        queryClient.removeQueries({queryKey: ['user', loggedInUserId], exact: true});
    }, [queryClient, loggedInUserId]);

    const register = useCallback(async (userData) => {
        setError(null);
        await registerMutation.mutateAsync(userData);
    }, [registerMutation]);

    const clearError = useCallback(() => {
        setError(null);
        loginMutation.reset();
        registerMutation.reset();
    }, [loginMutation, registerMutation]);

    const isLoggedIn = !!loggedInUserId && !!currentUser;
    const isLoading = loginMutation.isPending || registerMutation.isPending || (!!loggedInUserId && isLoadingUser);

    useEffect(() => {
        if (isUserQueryError) {
            // console.error("Error fetching user data:", userQueryError); // Zostawiono error
            setError("Nie udało się pobrać danych użytkownika. Spróbuj odświeżyć stronę.");
        }
    }, [isUserQueryError, userQueryError]); // Dodano userQueryError do zależności

    const value = useMemo(() => ({
        currentUser,
        isLoggedIn,
        isLoading,
        error,
        login,
        logout,
        register,
        clearError,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        isLoadingUser: !!loggedInUserId && isLoadingUser,
    }), [
        currentUser, isLoggedIn, isLoading, error,
        login, logout, register, clearError,
        loginMutation.isPending, registerMutation.isPending,
        loggedInUserId, isLoadingUser
    ]);

    useEffect(() => {
        // Logika sprawdzania tokena
    }, []);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
