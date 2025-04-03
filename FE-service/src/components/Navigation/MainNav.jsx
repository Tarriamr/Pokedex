import React from 'react';
import {Link} from 'react-router-dom';
import clsx from 'clsx';

const buttonBaseStyle = "px-4 py-2 rounded font-semibold text-white shadow transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"; // Zmniejszono tekst

const MainNav = () => {
    // Tutaj w przyszłości będzie funkcja wylogowująca
    const handleLogout = () => {
        console.log("Wylogowano!");
        // Implementacja logiki wylogowania (np. czyszczenie localStorage, kontekstu)
    };

    return (
        <div className="flex items-center space-x-2"> {/* Zmniejszono odstępy */}
            <Link to="/favourites"
                  className={clsx(buttonBaseStyle, "bg-pink-500 hover:bg-pink-600 focus:ring-pink-500")}>
                Ulubione
            </Link>
            <Link to="/arena"
                  className={clsx(buttonBaseStyle, "bg-purple-500 hover:bg-purple-600 focus:ring-purple-500")}>
                Arena
            </Link>
            <Link to="/ranking"
                  className={clsx(buttonBaseStyle, "bg-orange-500 hover:bg-orange-600 focus:ring-orange-500")}>
                Ranking
            </Link>
            <Link to="/edit" className={clsx(buttonBaseStyle, "bg-teal-500 hover:bg-teal-600 focus:ring-teal-500")}>
                Edycja
            </Link>
            <button
                onClick={handleLogout}
                className={clsx(
                    buttonBaseStyle,
                    "bg-pokemon-red hover:bg-pokemon-red-dark focus:ring-pokemon-red"
                )}
            >
                Wyloguj
            </button>
        </div>
    );
};

export default MainNav;
