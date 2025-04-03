import React from 'react';
import PropTypes from 'prop-types';
import usePokemonDetails from "../hooks/usePokemonDetails.jsx";

const PokemonDetailsModal = ({ pokemonId, onClose }) => {
    const { data: pokemonDetails, isLoading, isError, error } = usePokemonDetails(pokemonId);

    if (!pokemonId) {
        return null; // Nic nie renderuj, jeśli nie ma ID
    }

    if (isLoading) {
        return <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            Ładowanie szczegółów...
        </div>;
    }

    if (isError) {
        return <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            Wystąpił błąd podczas pobierania szczegółów: {error?.message || 'Wystąpił nieznany błąd.'}
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded focus:outline-none">Zamknij</button>
        </div>;
    }

    if (!pokemonDetails) {
        return null; // Nie renderuj, jeśli dane jeszcze nie są dostępne
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-md p-6 max-w-lg w-full relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="text-center mb-4">
                    <img
                        src={pokemonDetails.image}
                        alt={pokemonDetails.name}
                        className="w-48 h-48 mx-auto"
                    />
                    <h2 className="text-2xl font-semibold capitalize">{pokemonDetails.name}</h2>
                    <p className="text-gray-600">ID: {pokemonDetails.id}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <div><strong>Wzrost:</strong> {pokemonDetails.height} m</div>
                    <div><strong>Waga:</strong> {pokemonDetails.weight} kg</div>
                    <div><strong>Doświadczenie bazowe:</strong> {pokemonDetails.base_experience}</div>
                    <div><strong>Typy:</strong> {pokemonDetails.types?.map(type => type.type.name).join(', ')}</div>
                    <div>
                        <strong>Umiejętności:</strong>
                        <ul>
                            {pokemonDetails.abilities?.map(ability => (
                                <li key={ability.ability.name}>
                                    {ability.ability.name} {ability.is_hidden && '(ukryta)'}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <strong>Statystyki:</strong>
                        <ul>
                            {Object.entries(pokemonDetails.stats || {}).map(([statName, baseStat]) => (
                                <li key={statName}>
                                    {statName}: {baseStat}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

PokemonDetailsModal.propTypes = {
    pokemonId: PropTypes.number,
    onClose: PropTypes.func.isRequired,
};

export default PokemonDetailsModal;