import React from "react";
import PropTypes from "prop-types";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import clsx from "clsx";

// component protecting routes requiring logging in
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation(); // Download the current location
  // Show loader, if the state of authentication is still checked
  if (isLoading) {
    return (
      <div
        className={clsx(
          "flex justify-center items-center min-h-[calc(100vh-160px)]",
          "text-xl text-pokemon-blue dark:text-pokemon-blue-light",
        )}
      >
        Sprawdzanie autentykacji...
      </div>
    );
  }

  // If the user is not logged in, redirect to /login
  // Remember the current location to come back after logging in
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, render the Post -Common Complex (outlet for nested routes or children for a single)
  // We will use the outlet, assuming that we will use it for the packaging of routes at APP.JSX
  // If we pass a single component as Children, then Return Children;
  return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
