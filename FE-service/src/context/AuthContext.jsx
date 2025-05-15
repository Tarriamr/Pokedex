import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { loginUser, registerUser, getUserData } from "../services/api/auth.js";

const AuthContext = createContext({
  currentUser: null,
  isLoggedIn: false,
  isLoading: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  isLoggingIn: false,
  isRegistering: false,
  isLoadingUser: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loggedInUserId, setLoggedInUserId] = useState(() => {
    return localStorage.getItem("loggedInUserId");
  });
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: currentUser,
    isLoading: isLoadingUser,
    isError: isUserQueryError,
    error: userQueryError,
  } = useQuery({
    queryKey: ["user", loggedInUserId],
    queryFn: () => getUserData(loggedInUserId),
    enabled: !!loggedInUserId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setLoggedInUserId(data.id);
      localStorage.setItem("loggedInUserId", data.id);
      enqueueSnackbar("Pomyślnie zalogowano!", { variant: "success" });
    },
    onError: (err) => {
      const errorMessage =
        err.message || "Logowanie nie powiodło się. Sprawdź email i hasło.";
      enqueueSnackbar(errorMessage, { variant: "error" });
      setLoggedInUserId(null);
      localStorage.removeItem("loggedInUserId");
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      enqueueSnackbar(
        "Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.",
        { variant: "success" },
      );
    },
    onError: (err) => {
      const errorMessage = err.message || "Rejestracja nie powiodła się.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });

  const login = useCallback(
    async (credentials) => {
      await loginMutation.mutateAsync(credentials);
    },
    [loginMutation],
  );

  const logout = useCallback(() => {
    const userIdToClear = loggedInUserId;
    setLoggedInUserId(null);
    localStorage.removeItem("loggedInUserId");
    queryClient.removeQueries({
      queryKey: ["user", userIdToClear],
      exact: true,
    });
    enqueueSnackbar("Pomyślnie wylogowano.", { variant: "info" });
  }, [queryClient, loggedInUserId, enqueueSnackbar]);

  const register = useCallback(
    async (userData) => {
      await registerMutation.mutateAsync(userData);
    },
    [registerMutation],
  );

  const isLoggedIn = !!loggedInUserId && !!currentUser;
  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    (!!loggedInUserId && isLoadingUser);

  useEffect(() => {
    if (isUserQueryError) {
      console.error("Error fetching user data:", userQueryError);
    }
  }, [isUserQueryError, userQueryError]);

  const value = useMemo(
    () => ({
      currentUser,
      isLoggedIn,
      isLoading,
      login,
      logout,
      register,
      isLoggingIn: loginMutation.isPending,
      isRegistering: registerMutation.isPending,
      isLoadingUser: !!loggedInUserId && isLoadingUser,
    }),
    [
      currentUser,
      isLoggedIn,
      isLoading,
      login,
      logout,
      register,
      loginMutation.isPending,
      registerMutation.isPending,
      loggedInUserId,
      isLoadingUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
