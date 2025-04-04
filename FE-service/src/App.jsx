import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Usunięto nieużywany import Link
import clsx from 'clsx';
import PokemonList from './subpages/home/PokemonList';
import AuthNav from './components/Navigation/AuthNav';
import MainNav from './components/Navigation/MainNav';
import Login from './subpages/login/Login';
import Register from './subpages/register/Register';
import { useTheme } from "./context/ThemeContext.jsx";
import Logo from './components/Logo/Logo.jsx';
import ThemeToggleButton from './components/ThemeToggleButton/ThemeToggleButton.jsx'; // <<-- IMPORT Przycisku

const App = () => {
    const isLoggedIn = false;
    const { theme } = useTheme();

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
                    <Logo />
                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? <MainNav /> : <AuthNav />}
                        {/* DODANO Przycisk przełączania motywu */}
                        <ThemeToggleButton />
                    </div>
                </nav>
            </header>

            <main className="container mx-auto p-4 flex-grow">
                <Routes>
                    <Route path="/" element={<PokemonList />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* <Route path="/favourites" element={<div>Strona Ulubionych (TODO)</div>} /> */}
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
        </div>
    );
};

export default App;
