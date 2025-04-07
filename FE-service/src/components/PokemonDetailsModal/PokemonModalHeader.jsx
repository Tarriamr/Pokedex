import React from 'react';
import PropTypes from 'prop-types';
import TypeBadge from './TypeBadge'; // Import nowego komponentu

// Komponent dla sekcji nagłówka w modalu (Obraz, Nazwa, Typy)
const PokemonModalHeader = ({pokemonDetails}) => {
    if (!pokemonDetails) return null;

    return (
        <div
            className="text-center pt-8 mt-6 mb-5 border-b border-pokemon-gray-medium dark:border-pokemon-gray-dark pb-4">
            <img
                src={pokemonDetails.image || './src/assets/pokeball.svg'}
                alt={pokemonDetails.name}
                className="w-48 h-48 mx-auto mb-3"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/pokeball.svg';
                }} // Fallback
            />
            <h2 className="text-3xl font-bold text-pokemon-gray-darker dark:text-pokemon-gray-light capitalize"
                id="pokemon-modal-title">
                {pokemonDetails.name}
            </h2>
            {/* Usunięto wyświetlanie ID */}
            <div
                className="flex justify-center flex-wrap gap-2 mt-2"> {/* Dodano mały margines górny po usunięciu ID */}
                {pokemonDetails.types?.map((type) => (
                    <TypeBadge key={type} type={type}/> // Użycie komponentu TypeBadge
                ))}
            </div>
        </div>
    );
};

PokemonModalHeader.propTypes = {
    pokemonDetails: PropTypes.shape({
        // Usunięto id z propTypes, bo nie jest już bezpośrednio wyświetlane w tym komponencie,
        // ale nadal może być potrzebne w komponencie nadrzędnym lub hookach.
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
        types: PropTypes.arrayOf(PropTypes.string),
    }),
};

export default PokemonModalHeader;
