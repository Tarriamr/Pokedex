import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {XMarkIcon} from '@heroicons/react/24/solid';
import usePokemonDetails from "../../hooks/usePokemonDetails.jsx"; // Ikona zamknięcia

// Funkcja pomocnicza do mapowania typów na kolory Tailwind (przykładowa)
const getTypeColor = (type) => {
    switch (type) {
        case 'fire':
            return 'bg-red-500';
        case 'water':
            return 'bg-blue-500';
        case 'grass':
            return 'bg-green-500';
        case 'electric':
            return 'bg-yellow-400';
        case 'psychic':
            return 'bg-pink-500';
        case 'poison':
            return 'bg-purple-500';
        case 'bug':
            return 'bg-lime-500';
        case 'ground':
            return 'bg-amber-700';
        case 'rock':
            return 'bg-stone-500';
        case 'ghost':
            return 'bg-indigo-500';
        case 'dragon':
            return 'bg-violet-700';
        case 'steel':
            return 'bg-slate-400';
        case 'fairy':
            return 'bg-rose-300';
        case 'fighting':
            return 'bg-orange-700';
        case 'normal':
            return 'bg-gray-400';
        case 'flying':
            return 'bg-sky-400';
        default:
            return 'bg-gray-400';
    }
}

const PokemonDetailsModal = ({pokemonId, onClose}) => {
    const {data: pokemonDetails, isLoading, isError, error} = usePokemonDetails(pokemonId);

    // --- Ulepszone stany ładowania/błędu ---
    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center p-10 text-pokemon-blue-dark">Ładowanie szczegółów...</div>;
        }

        if (isError) {
            return (
                <div className="text-center p-10 text-pokemon-red-dark">
                    <p>Wystąpił błąd: {error?.message || 'Nieznany błąd.'}</p>
                    <button onClick={onClose}
                            className="mt-4 px-4 py-2 bg-pokemon-red hover:bg-pokemon-red-dark text-white rounded focus:outline-none shadow transition-colors">
                        Zamknij
                    </button>
                </div>
            );
        }

        if (!pokemonDetails) {
            // Można tu zwrócić null lub komunikat "Brak danych"
            return <div className="text-center p-10 text-pokemon-gray-dark">Brak danych dla tego Pokemona.</div>;
        }

        // --- Główna zawartość modala ---
        return (
            <>
                {/* Przycisk Zamknij */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-pokemon-gray-dark hover:text-pokemon-gray-darker focus:outline-none p-1 rounded-full hover:bg-pokemon-gray-medium transition-colors"
                    aria-label="Zamknij modal"
                >
                    <XMarkIcon className="h-6 w-6"/>
                </button>

                {/* Górna sekcja: Obrazek, Nazwa, ID, Typy */}
                <div className="text-center mb-5 border-b border-pokemon-gray-medium pb-4">
                    <img
                        src={pokemonDetails.image || './src/assets/pokeball.svg'} // Fallback
                        alt={pokemonDetails.name}
                        className="w-48 h-48 mx-auto mb-3"
                    />
                    <h2 className="text-3xl font-bold text-pokemon-gray-darker capitalize">{pokemonDetails.name}</h2>
                    <p className="text-sm text-pokemon-gray-dark mb-2">ID:
                        #{String(pokemonDetails.id).padStart(3, '0')}</p>
                    <div className="flex justify-center space-x-2">
                        {pokemonDetails.types?.map((type) => (
                            <span key={type} className={clsx(
                                "px-3 py-1 rounded-full text-xs font-semibold capitalize text-white shadow",
                                getTypeColor(type) // Dynamiczny kolor tła
                            )}>
                                 {type}
                             </span>
                        ))}
                    </div>
                </div>

                {/* Dolna sekcja: Statystyki, Info, Umiejętności */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-pokemon-gray-darker">
                    {/* Informacje Podstawowe */}
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold mb-2 border-b border-pokemon-gray-medium pb-1">Informacje</h3>
                        <p><strong>Wzrost:</strong> {pokemonDetails.height} m</p>
                        <p><strong>Waga:</strong> {pokemonDetails.weight} kg</p>
                        <p><strong>Dośw. bazowe:</strong> {pokemonDetails.base_experience}</p>
                    </div>

                    {/* Umiejętności */}
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold mb-2 border-b border-pokemon-gray-medium pb-1">Umiejętności</h3>
                        <ul className="list-disc list-inside pl-1">
                            {pokemonDetails.abilities?.map(abilityInfo => (
                                <li key={abilityInfo.ability.name} className="capitalize">
                                    {abilityInfo.ability.name.replace('-', ' ')}
                                    {abilityInfo.is_hidden &&
                                        <span className="text-xs text-pokemon-blue-dark ml-1">(ukryta)</span>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Statystyki */}
                    <div className="md:col-span-2 space-y-1 mt-2">
                        <h3 className="text-lg font-semibold mb-2 border-b border-pokemon-gray-medium pb-1">Statystyki
                            Bazowe</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                            {Object.entries(pokemonDetails.stats || {}).map(([statName, baseStat]) => (
                                <div key={statName} className="flex justify-between capitalize">
                                    <span>{statName.replace('-', ' ')}:</span>
                                    <strong>{baseStat}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    // --- Struktura Modala ---
    return (
        // Tło modala
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out"
            onClick={onClose} // Zamykanie po kliknięciu tła
            role="dialog"
            aria-modal="true"
            aria-labelledby="pokemon-modal-title"
        >
            {/* Kontener treści modala */}
            <div
                className={clsx(
                    "bg-pokemon-gray-light rounded-xl shadow-2xl p-6 max-w-lg w-full relative transform transition-all duration-300 ease-out",
                    "max-h-[90vh] overflow-y-auto", // Scrollowanie dla długiej treści
                    isLoading || isError ? "flex justify-center items-center min-h-[200px]" : "" // Minimalna wysokość dla loader/error
                )}
                onClick={e => e.stopPropagation()} // Zapobiega zamknięciu po kliknięciu wewnątrz modala
            >
                {renderContent()}
            </div>
        </div>
    );
};

PokemonDetailsModal.propTypes = {
    pokemonId: PropTypes.number,
    onClose: PropTypes.func.isRequired,
};

export default PokemonDetailsModal;
