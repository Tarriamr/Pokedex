import React, { useState } from 'react';
// Usunięto PropTypes, bo jest w PokemonCard
import clsx from 'clsx';
import usePokemonList from '../../hooks/usePokemonList';
import SearchBar from '../../shared/SearchBar';
import PokemonDetailsModal from '../../components/PokemonDetailsModal/PokemonDetailsModal.jsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import PokemonCard from '../../components/PokemonCard/PokemonCard'; // Import współdzielonego komponentu

const POKEMON_LIMIT = 150;
const POKEMONS_PER_PAGE = 15;

// Usunięto wewnętrzny komponent PokemonCard

// --- Komponent Głównej Listy Pokemonów --- //
const PokemonList = () => {
    const { data: allPokemon, isLoading, isError, error } = usePokemonList(POKEMON_LIMIT);
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPokemonId, setSelectedPokemonId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredPokemon = allPokemon?.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / POKEMONS_PER_PAGE));

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const goToNextPage = () => {
        setCurrentPage(prevPage => (prevPage === totalPages ? 1 : prevPage + 1));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prevPage => (prevPage === 1 ? totalPages : prevPage - 1));
    };

    // Handler kliknięcia karty przekazywany do PokemonCard
    const handleCardClick = (id) => {
        setSelectedPokemonId(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedPokemonId(null);
        setIsModalOpen(false);
    };

    const startIndex = (currentPage - 1) * POKEMONS_PER_PAGE;
    const endIndex = startIndex + POKEMONS_PER_PAGE;
    const currentPokemonPage = filteredPokemon.slice(startIndex, endIndex);

    if (isLoading) {
        return (
            <div className="text-center p-10 text-xl text-pokemon-blue dark:text-pokemon-blue-light transition-colors duration-300 ease-in-out">
                Ładowanie Pokemonów...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center p-10 text-xl text-pokemon-red dark:text-red-400 transition-colors duration-300 ease-in-out">
                Wystąpił błąd podczas pobierania Pokemonów: {error?.message || 'Wystąpił nieznany błąd.'}
            </div>
        );
    }

    return (
        <div className="p-4">
            <SearchBar onSearch={handleSearch} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-6">
                {currentPokemonPage.length > 0 ? (
                    currentPokemonPage.map(pokemon => (
                        // Używamy współdzielonego komponentu PokemonCard
                        <PokemonCard
                            key={pokemon.id} // Klucz jest potrzebny tutaj w .map()
                            pokemon={pokemon}
                            onClick={handleCardClick} // Przekazujemy handler
                            userStats={currentUser?.pokemonStats}
                        />
                    ))
                ) : (
                    <p className={clsx(
                        "col-span-full text-center mt-6 w-full transition-colors duration-300 ease-in-out",
                        "text-pokemon-gray-dark dark:text-pokemon-gray-light"
                    )}>
                        Nie znaleziono Pokemonów pasujących do wyszukiwania.
                    </p>
                )}
            </div>

            {/* Paginacja (bez zmian) */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-3">
                    <button
                        onClick={goToPreviousPage}
                        className={clsx(
                            "p-2 rounded-full shadow-md transition-all duration-150 ease-in-out",
                            "outline-none focus:outline-none focus:ring-2 focus:ring-pokemon-yellow focus:ring-opacity-50",
                            "bg-pokemon-yellow hover:bg-pokemon-yellow-dark text-pokemon-blue-dark",
                            "dark:bg-pokemon-yellow dark:hover:bg-pokemon-yellow-dark dark:text-pokemon-blue-dark",
                            "active:scale-95 active:brightness-90"
                        )}
                        aria-label="Poprzednia strona"
                    >
                        <ChevronLeftIcon className="h-6 w-6"/>
                    </button>
                    <span className={clsx(
                        "text-lg font-bold transition-colors duration-300 ease-in-out",
                        "text-pokemon-gray-darker dark:text-pokemon-gray-light",
                        "min-w-[5ch] text-center"
                    )}>
                         {currentPage}&nbsp;/&nbsp;{totalPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        className={clsx(
                            "p-2 rounded-full shadow-md transition-all duration-150 ease-in-out",
                            "outline-none focus:outline-none focus:ring-2 focus:ring-pokemon-yellow focus:ring-opacity-50",
                            "bg-pokemon-yellow hover:bg-pokemon-yellow-dark text-pokemon-blue-dark",
                            "dark:bg-pokemon-yellow dark:hover:bg-pokemon-yellow-dark dark:text-pokemon-blue-dark",
                            "active:scale-95 active:brightness-90"
                        )}
                        aria-label="Następna strona"
                    >
                        <ChevronRightIcon className="h-6 w-6"/>
                    </button>
                </div>
            )}

            {isModalOpen && (
                <PokemonDetailsModal pokemonId={selectedPokemonId} onClose={closeModal}/>
            )}
        </div>
    );
};

export default PokemonList;
