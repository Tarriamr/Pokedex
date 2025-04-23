import React, { useState } from 'react'; // Removed useEffect import
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import clsx from 'clsx';
import PokemonList from './subpages/home/PokemonList';
import AuthNav from './components/Navigation/AuthNav';
import MainNav from './components/Navigation/MainNav';
import Login from './subpages/login/Login';
import Register from './subpages/register/Register';
import FavouritesPage from './subpages/favourites/FavouritesPage';
import ArenaPage from './subpages/arena/ArenaPage';
import RankingPage from './subpages/ranking/RankingPage';
import EditPage from './subpages/edit/EditPage';
import { useAuth } from './context/AuthContext.jsx';
import Logo from './components/Logo/Logo.jsx';
import ThemeToggleButton from './components/ThemeToggleButton/ThemeToggleButton.jsx';
import { UserCircleIcon, Bars3Icon } from '@heroicons/react/24/solid';
import MobileMenu from './components/Navigation/MobileMenu.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Comments about removed handlers removed

const App = () => {
    const { isLoggedIn, currentUser, logout, isLoading: isAuthLoading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const navigate = useNavigate();

    // Modal control functions
    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);
    const openRegisterModal = () => setIsRegisterModalOpen(true);
    const closeRegisterModal = () => setIsRegisterModalOpen(false);
    const switchToLoginModal = () => { closeRegisterModal(); openLoginModal(); };
    const switchToRegisterModal = () => { closeLoginModal(); openRegisterModal(); };
    const handleOpenLoginModal = () => { setIsMobileMenuOpen(false); openLoginModal(); };
    const handleOpenRegisterModal = () => { setIsMobileMenuOpen(false); openRegisterModal(); };
    const handleLogout = () => { setIsMobileMenuOpen(false); logout(); navigate('/'); };

    if (isAuthLoading) {
        return (
            <div className="h-screen flex justify-center items-center bg-pokemon-neutral-sand dark:bg-pokemon-gray-darker">
                <p className="text-xl text-pokemon-blue dark:text-pokemon-blue-light animate-pulse">Ładowanie aplikacji...</p>
            </div>
        );
    }

    return (
        <div className={clsx(
            "h-screen flex flex-col",
            "transition-colors duration-300 ease-in-out",
            "bg-pokemon-neutral-sand dark:bg-pokemon-gray-darker",
            "text-pokemon-gray-darker dark:text-pokemon-gray-light"
        )}>
            {/* Header */}
            <header className={clsx(
                "shadow-md sticky top-0 z-40",
                "transition-colors duration-300 ease-in-out",
                "bg-pokemon-red dark:bg-pokemon-red-dark"
            )}>
                <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Logo />
                    <div className="flex items-center">
                        {/* Desktop Navigation / User Info */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {isLoggedIn && currentUser ? (
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center space-x-2">
                                        <UserCircleIcon className="h-6 w-6 text-pokemon-yellow dark:text-pokemon-yellow-light flex-shrink-0" aria-hidden="true" />
                                        <span className="text-sm font-medium text-white dark:text-pokemon-gray-light truncate" title={currentUser.name}>{currentUser.name}</span>
                                        <ThemeToggleButton />
                                    </div>
                                    <div className="mt-1"><MainNav /></div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <AuthNav onLoginClick={openLoginModal} onRegisterClick={openRegisterModal} />
                                    <ThemeToggleButton />
                                </div>
                            )}
                        </div>
                        {/* Mobile Menu Trigger / User Info */}
                        <div className="flex items-center space-x-2 md:hidden">
                            {isLoggedIn && currentUser && (
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm font-medium text-white dark:text-pokemon-gray-light truncate max-w-[100px]" title={currentUser.name}>{currentUser.name}</span>
                                </div>
                            )}
                            <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 text-white rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pokemon-yellow hover:bg-white/20 transition-colors duration-150 ease-in-out" aria-label="Otwórz menu">
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

            {/* Main Content Area with Routing */}
            <main className="flex-grow overflow-y-auto">
                <Routes>
                    {/* Public Route */}
                    <Route path="/" element={<div className="container mx-auto p-4"><PokemonList /></div>} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/favourites" element={<div className="container mx-auto p-4"><FavouritesPage /></div>} />
                        <Route path="/arena" element={<ArenaPage />} />
                        <Route path="/ranking" element={<div className="container mx-auto p-4 h-full"><RankingPage /></div>} />
                        <Route path="/edit" element={<EditPage />} />
                    </Route>

                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            {/* Footer */}
            <footer className={clsx(
                "text-center p-3 text-sm",
                "transition-colors duration-300 ease-in-out",
                "bg-pokemon-blue dark:bg-pokemon-blue-dark",
                "text-pokemon-yellow-light dark:text-pokemon-yellow-light",
                "flex-shrink-0"
            )}>
                Pokedex Project &copy; {new Date().getFullYear()}
            </footer>

            {/* Modals Rendered Here */}
            {isLoginModalOpen && <Login onClose={closeLoginModal} onSwitchToRegister={switchToRegisterModal} />}
            {isRegisterModalOpen && <Register onClose={closeRegisterModal} onSwitchToLogin={switchToLoginModal} />}
        </div>
    );
};

export default App;
