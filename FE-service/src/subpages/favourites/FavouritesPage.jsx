import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext.jsx';
import usePokemonList from '../../hooks/usePokemonList.jsx';
import PokemonDetailsModal from '../../components/PokemonDetailsModal/PokemonDetailsModal.jsx';
import PokemonCard from '../../components/PokemonCard/PokemonCard';

const POKEMON_LIMIT = 251;

const FavouritesPage = () => {
    // Pobieramy tylko currentUser, bo isLoggedIn jest sprawdzane przez ProtectedRoute
    const { currentUser } = useAuth();
    const { data: allPokemon, isLoading: isLoadingList, isError: isErrorList, error: errorList } = usePokemonList(POKEMON_LIMIT);

    const [selectedPokemonId, setSelectedPokemonId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const favoriteIds = useMemo(() => currentUser?.favoritePokemonIds?.map(String) || [], [currentUser]);

    const favoritePokemons = useMemo(() => {
        if (!allPokemon || favoriteIds.length === 0) {
            return [];
        }
        const favoriteIdSet = new Set(favoriteIds);
        return allPokemon.filter(pokemon => favoriteIdSet.has(String(pokemon.id)));
    }, [allPokemon, favoriteIds]);

    const handleCardClick = (id) => {
        setSelectedPokemonId(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedPokemonId(null);
        setIsModalOpen(false);
    };

    // Usunięto blok `if (!isLoggedIn) { ... }`

    if (isLoadingList) {
        return (
            <div className="text-center p-10 text-xl text-pokemon-blue dark:text-pokemon-blue-light transition-colors duration-300 ease-in-out">
                Ładowanie ulubionych...
            </div>
        );
    }

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

            {favoritePokemons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-6">
                    {favoritePokemons.map(pokemon => (
                        <PokemonCard
                            key={pokemon.id}
                            pokemon={pokemon}
                            onClick={handleCardClick}
                            userStats={currentUser?.pokemonStats}
                        />
                    ))}
                </div>
            ) : (
                <p className={clsx(
                    "col-span-full text-center mt-6 w-full transition-colors duration-300 ease-in-out",
                    "text-pokemon-gray-dark dark:text-pokemon-gray-light"
                )}>
                    Nie masz jeszcze żadnych ulubionych Pokémonów. Dodaj je, klikając serce w widoku szczegółów!
                </p>
            )}

            {isModalOpen && (
                <PokemonDetailsModal pokemonId={selectedPokemonId} onClose={closeModal}/>
            )}
        </div>
    );
};

export default FavouritesPage;
