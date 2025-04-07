import React, {useMemo, useState} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import usePokemonList from '../../hooks/usePokemonList.jsx';
import PokemonDetailsModal from '../../components/PokemonDetailsModal/PokemonDetailsModal.jsx';
import PokemonGrid from '../../components/PokemonGrid/PokemonGrid.jsx';
import {POKEMON_API_LIMIT} from '../../config/constants'; // Import stałej

const FavouritesPage = () => {
    const {currentUser} = useAuth();
    // Użycie stałej z pliku konfiguracyjnego
    const {
        data: allPokemon,
        isLoading: isLoadingList,
        isError: isErrorList,
        error: errorList
    } = usePokemonList(POKEMON_API_LIMIT);

    const [selectedPokemonId, setSelectedPokemonId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const favoriteIds = useMemo(() => currentUser?.favoritePokemonIds?.map(String) || [], [currentUser?.favoritePokemonIds]);

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

    if (isErrorList) {
        return (
            <div
                className="text-center p-10 text-xl text-pokemon-red dark:text-red-400 transition-colors duration-300 ease-in-out">
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
                pokemons={favoritePokemons}
                onCardClick={handleCardClick}
                userStats={currentUser?.pokemonStats}
                isLoading={isLoadingList}
                loadingMessage="Ładowanie ulubionych..."
                emptyMessage="Nie masz jeszcze żadnych ulubionych Pokémonów. Dodaj je, klikając serce w widoku szczegółów!"
            />

            {isModalOpen && (
                <PokemonDetailsModal pokemonId={selectedPokemonId} onClose={closeModal}/>
            )}
        </div>
    );
};

export default FavouritesPage;
