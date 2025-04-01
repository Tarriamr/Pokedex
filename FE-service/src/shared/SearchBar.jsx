import React, {useState} from 'react';

const SearchBar = ({onSearch}) => {
    const [searchText, setSearchText] = useState('');

    const handleInputChange = (event) => {
        const newSearchText = event.target.value;
        setSearchText(newSearchText);
        if (onSearch) {
            onSearch(newSearchText);
        }
    };

    return (
        <input
            type="text"
            placeholder="Wyszukaj Pokemona..."
            className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchText}
            onChange={handleInputChange}
        />
    );
};

export default SearchBar;
