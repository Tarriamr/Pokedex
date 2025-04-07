import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PokemonCard from '../PokemonCard/PokemonCard';

// Komponent do renderowania siatki kart Pokemonów
const PokemonGrid = ({pokemons, onCardClick, userStats, isLoading, loadingMessage, emptyMessage}) => {

    // Stan ładowania
    if (isLoading) {
        return (
            <div
                className="text-center p-10 text-xl text-pokemon-blue dark:text-pokemon-blue-light transition-colors duration-300 ease-in-out">
                {loadingMessage || 'Ładowanie Pokemonów...'}
            </div>
        );
    }

    // Stan pusty (brak Pokemonów)
    if (!pokemons || pokemons.length === 0) {
        return (
            <p className={clsx(
                "col-span-full text-center mt-6 w-full transition-colors duration-300 ease-in-out",
                "text-pokemon-gray-dark dark:text-pokemon-gray-light"
            )}>
                {emptyMessage || 'Nie znaleziono żadnych Pokemonów.'}
            </p>
        );
    }

    // Renderowanie siatki
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-6">
            {pokemons.map(pokemon => (
                <PokemonCard
                    key={pokemon.id} // Klucz dla elementu listy
                    pokemon={pokemon}
                    onClick={onCardClick}
                    userStats={userStats}
                />
            ))}
        </div>
    );
};

PokemonGrid.propTypes = {
    pokemons: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCardClick: PropTypes.func.isRequired,
    userStats: PropTypes.object,
    isLoading: PropTypes.bool,
    loadingMessage: PropTypes.string,
    emptyMessage: PropTypes.string,
};

export default PokemonGrid;
