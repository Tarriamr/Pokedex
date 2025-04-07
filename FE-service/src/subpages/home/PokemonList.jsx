import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import usePokemonList from '../../hooks/usePokemonList';
import {usePagination} from '../../hooks/usePagination.js';
import SearchBar from '../../shared/SearchBar';
import PokemonDetailsModal from '../../components/PokemonDetailsModal/PokemonDetailsModal.jsx';
import PokemonGrid from '../../components/PokemonGrid/PokemonGrid.jsx';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/solid';
import {useAuth} from '../../context/AuthContext';
import {POKEMON_API_LIMIT, POKEMONS_PER_PAGE} from '../../config/constants'; // Import stałych

const PokemonList = () => {
    // Użycie stałej z pliku konfiguracyjnego
    const {data: allPokemon, isLoading, isError, error} = usePokemonList(POKEMON_API_LIMIT);
    const {currentUser} = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPokemonId, setSelectedPokemonId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredPokemon = useMemo(() => {
        return allPokemon?.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];
    }, [allPokemon, searchQuery]);

    // Użycie stałej z pliku konfiguracyjnego
    const {
        currentPage,
        totalPages,
        goToNextPage,
        goToPreviousPage,
        setCurrentPage,
        startIndex,
        endIndex,
    } = usePagination(filteredPokemon.length, POKEMONS_PER_PAGE);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleCardClick = (id) => {
        setSelectedPokemonId(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedPokemonId(null);
        setIsModalOpen(false);
    };

    const currentPokemonPage = useMemo(() => {
        return filteredPokemon.slice(startIndex, endIndex);
    }, [filteredPokemon, startIndex, endIndex]);

    if (isError) {
        return (
            <div
                className="text-center p-10 text-xl text-pokemon-red dark:text-red-400 transition-colors duration-300 ease-in-out">
                Wystąpił błąd podczas pobierania Pokemonów: {error?.message || 'Wystąpił nieznany błąd.'}
            </div>
        );
    }

    return (
        <div className="p-4">
            <SearchBar onSearch={handleSearch}/>

            <PokemonGrid
                pokemons={currentPokemonPage}
                onCardClick={handleCardClick}
                userStats={currentUser?.pokemonStats}
                isLoading={isLoading}
                loadingMessage="Ładowanie Pokemonów..."
                emptyMessage="Nie znaleziono Pokemonów pasujących do wyszukiwania."
            />

            {!isLoading && totalPages > 1 && (
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
