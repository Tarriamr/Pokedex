import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import clsx from 'clsx';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');

    // Use useCallback for stable function reference if passed down heavily,
    // though not strictly necessary here.
    const handleInputChange = useCallback((event) => {
        const newSearchText = event.target.value;
        setSearchText(newSearchText);
        if (onSearch) {
            onSearch(newSearchText);
        }
    }, [onSearch]);

    return (
        <div className={clsx(
            "relative flex items-center w-full max-w-lg mx-auto",
            "transition-colors duration-300 ease-in-out",
            "rounded-lg shadow-md",
            "bg-white border border-pokemon-gray-medium",
            "focus-within:border-pokemon-blue focus-within:ring-1 focus-within:ring-pokemon-blue",
            "dark:bg-gray-700 dark:border-gray-600",
            "dark:focus-within:border-pokemon-blue-light dark:focus-within:ring-1 dark:focus-within:ring-pokemon-blue-light"
        )}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-pokemon-gray-dark dark:text-pokemon-gray-light" aria-hidden="true" />
            </div>
            <input
                type="search" // Use type="search" for better semantics and potential browser features (like clear button)
                placeholder="Wyszukaj Pokemona..."
                className={clsx(
                    "block w-full pl-10 pr-3 py-2",
                    "border-none rounded-lg",
                    "bg-transparent",
                    "focus:outline-none focus:ring-0",
                    "text-pokemon-gray-darker dark:text-pokemon-gray-light",
                    "placeholder-pokemon-gray-dark dark:placeholder-gray-400",
                    "transition-colors duration-300 ease-in-out"
                )}
                value={searchText}
                onChange={handleInputChange}
            />
        </div>
    );
};

// Add PropTypes definition
SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
