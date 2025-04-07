import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import clsx from 'clsx';
import PokemonList from './subpages/home/PokemonList';
import AuthNav from './components/Navigation/AuthNav';
import MainNav from './components/Navigation/MainNav';
import Login from './subpages/login/Login';
import Register from './subpages/register/Register';
import FavouritesPage from './subpages/favourites/FavouritesPage';
import ArenaPage from './subpages/arena/ArenaPage';
import {useTheme} from "./context/ThemeContext.jsx";
import {useAuth} from './context/AuthContext.jsx';
import Logo from './components/Logo/Logo.jsx';
import ThemeToggleButton from './components/ThemeToggleButton/ThemeToggleButton.jsx';
import {Bars3Icon, UserCircleIcon} from '@heroicons/react/24/solid';
import MobileMenu from './components/Navigation/MobileMenu.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // Import ProtectedRoute

// --- Komponenty-Pośredniki (bez zmian) --- //
const LoginRedirectHandler = ({openModal}) => {
    const navigate = useNavigate();
    useEffect(() => {
        openModal();
        navigate('/', {replace: true});
    }, [openModal, navigate]);
    return null;
};
const RegisterRedirectHandler = ({openModal}) => {
    const navigate = useNavigate();
    useEffect(() => {
        openModal();
        navigate('/', {replace: true});
    }, [openModal, navigate]);
    return null;
};

// --- Główny komponent App --- //
const App = () => {
    const {isLoggedIn, currentUser, logout} = useAuth();
    const {theme} = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);
    const openRegisterModal = () => setIsRegisterModalOpen(true);
    const closeRegisterModal = () => setIsRegisterModalOpen(false);
    const switchToLoginModal = () => {
        closeRegisterModal();
        openLoginModal();
    };
    const switchToRegisterModal = () => {
        closeLoginModal();
        openRegisterModal();
    };
    const handleOpenLoginModal = () => {
        setIsMobileMenuOpen(false);
        openLoginModal();
    };
    const handleOpenRegisterModal = () => {
        setIsMobileMenuOpen(false);
        openRegisterModal();
    };
    const handleLogout = () => {
        setIsMobileMenuOpen(false);
        logout();
    };

    return (
        <div className={clsx(
            "min-h-screen flex flex-col",
            "transition-colors duration-300 ease-in-out",
            "bg-pokemon-neutral-sand dark:bg-pokemon-gray-darker",
            "text-pokemon-gray-darker dark:text-pokemon-gray-light"
        )}>
            <header className={clsx(
                "shadow-md sticky top-0 z-40",
                "transition-colors duration-300 ease-in-out",
                "bg-pokemon-red dark:bg-pokemon-red-dark"
            )}>
                <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Logo/>
                    <div className="flex items-center">
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {isLoggedIn && currentUser ? (
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center space-x-2">
                                        <UserCircleIcon
                                            className="h-6 w-6 text-pokemon-yellow dark:text-pokemon-yellow-light flex-shrink-0"
                                            aria-hidden="true"/>
                                        <span
                                            className="text-sm font-medium text-white dark:text-pokemon-gray-light truncate"
                                            title={currentUser.name}>{currentUser.name}</span>
                                        <ThemeToggleButton/>
                                    </div>
                                    <div className="mt-1"><MainNav/></div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <AuthNav onLoginClick={openLoginModal} onRegisterClick={openRegisterModal}/>
                                    <ThemeToggleButton/>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 md:hidden">
                            {isLoggedIn && currentUser && (
                                <div className="flex items-center space-x-1">
                                    <span
                                        className="text-sm font-medium text-white dark:text-pokemon-gray-light truncate max-w-[100px]"
                                        title={currentUser.name}>{currentUser.name}</span>
                                </div>
                            )}
                            <button onClick={() => setIsMobileMenuOpen(true)}
                                    className="p-1 text-white rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pokemon-yellow hover:bg-white/20 transition-colors duration-150 ease-in-out"
                                    aria-label="Otwórz menu">
                                <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                isLoggedIn={isLoggedIn}
                onLoginClick={handleOpenLoginModal}
                onRegisterClick={handleOpenRegisterModal}
                onLogoutClick={handleLogout}
            />

            <main className="flex-grow">
                <Routes>
                    {/* Trasy publiczne */}
                    <Route path="/" element={<div className="container mx-auto p-4"><PokemonList/></div>}/>
                    <Route path="/login" element={<LoginRedirectHandler openModal={openLoginModal}/>}/>
                    <Route path="/register" element={<RegisterRedirectHandler openModal={openRegisterModal}/>}/>

                    {/* Trasy chronione */}
                    <Route element={<ProtectedRoute/>}>
                        {/* Dodano div z klasami container dla spójności layoutu */}
                        <Route path="/favourites"
                               element={<div className="container mx-auto p-4"><FavouritesPage/></div>}/>
                        {/* Arena nie potrzebuje containera, bo ma własne tło pełnoekranowe */}
                        <Route path="/arena" element={<ArenaPage/>}/>
                        {/* Tutaj można dodać inne chronione trasy */}
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </main>

            <footer className={clsx(
                "text-center p-3 mt-auto text-sm",
                "transition-colors duration-300 ease-in-out",
                "bg-pokemon-blue dark:bg-pokemon-blue-dark",
                "text-pokemon-yellow-light dark:text-pokemon-yellow-light"
            )}>
                Pokedex Project &copy; {new Date().getFullYear()}
            </footer>

            {isLoginModalOpen && <Login onClose={closeLoginModal} onSwitchToRegister={switchToRegisterModal}/>}
            {isRegisterModalOpen && <Register onClose={closeRegisterModal} onSwitchToLogin={switchToLoginModal}/>}
        </div>
    );
};

export default App;
