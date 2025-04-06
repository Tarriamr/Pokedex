import React, { useState } from 'react';
import clsx from 'clsx';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Import ikony

const SearchBar = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');

    const handleInputChange = (event) => {
        const newSearchText = event.target.value;
        setSearchText(newSearchText);
        if (onSearch) {
            onSearch(newSearchText);
        }
    };

    return (
        // Kontener dla ikony i inputa
        <div className={clsx(
            "relative flex items-center w-full max-w-lg mx-auto", // Responsywna szerokość i centrowanie
            "transition-colors duration-300 ease-in-out", // Płynne przejście kolorów
            "rounded-lg shadow-md", // Zaokrąglenie i cień
            // Style Light Mode
            "bg-white border border-pokemon-gray-medium",
            "focus-within:border-pokemon-blue focus-within:ring-1 focus-within:ring-pokemon-blue", // Focus na kontenerze
            // Style Dark Mode
            "dark:bg-gray-700 dark:border-gray-600",
            "dark:focus-within:border-pokemon-blue-light dark:focus-within:ring-1 dark:focus-within:ring-pokemon-blue-light" // Jaśniejszy focus w dark mode
        )}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className={clsx(
                    "h-5 w-5",
                    "text-pokemon-gray-dark dark:text-pokemon-gray-light" // Kolor ikony (ZMIENIONO w dark na gray-light)
                )} aria-hidden="true" />
            </div>
            <input
                type="text"
                placeholder="Wyszukaj Pokemona..."
                className={clsx(
                    "block w-full pl-10 pr-3 py-2", // Padding dla ikony po lewej
                    "border-none rounded-lg", // Usunięto ramkę inputa (jest na divie)
                    "bg-transparent", // Przezroczyste tło inputa
                    "focus:outline-none focus:ring-0", // Usunięto domyślny ring focusa (jest na divie)
                    // Kolory tekstu i placeholdera
                    "text-pokemon-gray-darker dark:text-pokemon-gray-light",
                    "placeholder-pokemon-gray-dark dark:placeholder-gray-400", // Placeholder (ZMIENIONO w dark na gray-400)
                    "transition-colors duration-300 ease-in-out" // Dodano transition do inputa dla płynności zmiany koloru tekstu/placeholdera
                )}
                value={searchText}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default SearchBar;
