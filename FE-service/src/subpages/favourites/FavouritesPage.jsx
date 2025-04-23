import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext.jsx';
import usePokemonList from '../../hooks/usePokemonList.jsx';
import { usePagination } from '../../hooks/usePagination.js';
import PokemonDetailsModal from '../../components/PokemonDetailsModal/PokemonDetailsModal.jsx';
import PokemonGrid from '../../components/PokemonGrid/PokemonGrid.jsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { POKEMON_API_LIMIT, POKEMONS_PER_PAGE } from '../../config/constants';

const FavouritesPage = () => {
    const { currentUser } = useAuth();
    const {
        data: allPokemon,
        isLoading: isLoadingList,
        isError: isErrorList,
        error: errorList
    } = usePokemonList(POKEMON_API_LIMIT, currentUser?.pokemonStats);

    const [selectedPokemonId, setSelectedPokemonId] = useState(null);

    const favoriteIds = useMemo(() => new Set(currentUser?.favoritePokemonIds?.map(String) || []), [currentUser?.favoritePokemonIds]);

    const favoritePokemons = useMemo(() => {
        if (!allPokemon) return [];
        return allPokemon
            .filter(pokemon => favoriteIds.has(String(pokemon.id)))
            .sort((a, b) => a.id - b.id); // Sort by ID numerically
    }, [allPokemon, favoriteIds]);

    // Destructure only the needed values from usePagination
    const {
        currentPage,
        totalPages,
        goToNextPage,
        goToPreviousPage,
        startIndex,
        endIndex,
    } = usePagination(favoritePokemons.length, POKEMONS_PER_PAGE);

    const currentFavoritesPage = useMemo(() => {
        if (!Array.isArray(favoritePokemons)) return [];
        return favoritePokemons.slice(startIndex, endIndex);
    }, [favoritePokemons, startIndex, endIndex]);

    const handleCardClick = (id) => {
        setSelectedPokemonId(id);
    };

    const closeModal = () => {
        setSelectedPokemonId(null);
    };

    if (isErrorList) {
        return (
            <div className="text-center p-10 text-xl text-pokemon-red dark:text-red-400 transition-colors duration-300 ease-in-out">
                Wystąpił błąd podczas pobierania danych: {errorList?.message || 'Wystąpił nieznany błąd.'}
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-pokemon-blue-dark dark:text-pokemon-blue-light">
                Ulubione Pokémony
            </h1>

            <PokemonGrid
                pokemons={currentFavoritesPage}
                onCardClick={handleCardClick}
                userStats={currentUser?.pokemonStats}
                isLoading={isLoadingList}
                loadingMessage="Ładowanie ulubionych..."
                emptyMessage="Nie masz jeszcze żadnych ulubionych Pokémonów. Dodaj je, klikając serce w widoku szczegółów!"
            />

            {!isLoadingList && totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-3">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={clsx(
                            "p-2 rounded-full shadow-md transition-all duration-150 ease-in-out",
                            "outline-none focus:outline-none focus:ring-2 focus:ring-pokemon-yellow focus:ring-opacity-50",
                            "bg-pokemon-yellow hover:bg-pokemon-yellow-dark text-pokemon-blue-dark",
                            "dark:bg-pokemon-yellow dark:hover:bg-pokemon-yellow-dark dark:text-pokemon-blue-dark",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-pokemon-gray-medium disabled:text-pokemon-gray-dark",
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
                        disabled={currentPage === totalPages}
                        className={clsx(
                            "p-2 rounded-full shadow-md transition-all duration-150 ease-in-out",
                            "outline-none focus:outline-none focus:ring-2 focus:ring-pokemon-yellow focus:ring-opacity-50",
                            "bg-pokemon-yellow hover:bg-pokemon-yellow-dark text-pokemon-blue-dark",
                            "dark:bg-pokemon-yellow dark:hover:bg-pokemon-yellow-dark dark:text-pokemon-blue-dark",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-pokemon-gray-medium disabled:text-pokemon-gray-dark",
                            "active:scale-95 active:brightness-90"
                        )}
                        aria-label="Następna strona"
                    >
                        <ChevronRightIcon className="h-6 w-6"/>
                    </button>
                </div>
            )}

            {selectedPokemonId !== null && (
                <PokemonDetailsModal pokemonId={selectedPokemonId} onClose={closeModal}/>
            )}
        </div>
    );
};

export default FavouritesPage;
