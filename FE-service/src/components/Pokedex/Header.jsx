import clsx from "clsx";
import Logo from "../Logo/Logo.jsx";
import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/solid/index.js";
import ThemeToggleButton from "../ThemeToggleButton/ThemeToggleButton.jsx";
import MainNav from "../Navigation/MainNav.jsx";
import AuthNav from "../Navigation/AuthNav.jsx";
import React, { useState } from "react";
import MobileMenu from "../Navigation/MobileMenu.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Login from "../../subpages/login/Login.jsx";
import Register from "../../subpages/register/Register.jsx";

export function Header() {
  const {
    isLoggedIn,
    currentUser,
    logout,
    isLoading: isAuthLoading,
  } = useAuth();

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    navigate("/");
  };
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleOpenLoginModal = () => {
    setIsMobileMenuOpen(false);
    setIsLoginModalOpen(true);
  };
  const handleOpenRegisterModal = () => {
    setIsMobileMenuOpen(false);
    setIsRegisterModalOpen(true);
  };

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const switchToLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };
  const switchToRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  return (
    <>
      <header className={styles.header}>
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <div className="flex items-center">
            {/* Desktop Navigation / User Info */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {isLoggedIn && currentUser ? (
                <div className="flex flex-col items-end">
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon
                      className="h-6 w-6 text-pokemon-yellow dark:text-pokemon-yellow-light flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span
                      className="text-sm font-medium text-white dark:text-pokemon-gray-light truncate"
                      title={currentUser.name}
                    >
                      {currentUser.name}
                    </span>
                    <ThemeToggleButton />
                  </div>
                  <div className="mt-1">
                    <MainNav />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <AuthNav
                    onLoginClick={() => setIsLoginModalOpen(true)}
                    onRegisterClick={() => setIsRegisterModalOpen(true)}
                  />
                  <ThemeToggleButton />
                </div>
              )}
            </div>
            {/* Mobile Menu Trigger / User Info */}
            <div className="flex items-center space-x-2 md:hidden">
              {isLoggedIn && currentUser && (
                <div className="flex items-center space-x-1">
                  <span
                    className="text-sm font-medium text-white dark:text-pokemon-gray-light truncate max-w-[100px]"
                    title={currentUser.name}
                  >
                    {currentUser.name}
                  </span>
                </div>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1 text-white rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pokemon-yellow hover:bg-white/20 transition-colors duration-150 ease-in-out"
                aria-label="Otwórz menu"
              >
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      </header>
      {/* Mobile Off-canvas Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        onLoginClick={handleOpenLoginModal}
        onRegisterClick={handleOpenRegisterModal}
        onLogoutClick={handleLogout}
      />

      {/* Modals Rendered Here */}
      {isLoginModalOpen && (
        <Login
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={switchToRegisterModal}
        />
      )}
      {isRegisterModalOpen && (
        <Register
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={switchToLoginModal}
        />
      )}
    </>
  );
}

const styles = {
  header: clsx(
    "shadow-md sticky top-0 z-40",
    "transition-colors duration-300 ease-in-out",
    "bg-pokemon-red dark:bg-pokemon-red-dark",
  ),
};
