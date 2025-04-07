import React, {useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {XMarkIcon} from '@heroicons/react/24/solid';

// Import hooków i komponentów
import usePokemonDetails from "../../hooks/usePokemonDetails.jsx";
import {useAuth} from '../../context/AuthContext.jsx';
import {useFavoriteManagement} from '../../hooks/useFavoriteManagement.js';
import {useArenaManagement} from '../../hooks/useArenaManagement.js';
import ModalActionButtons from './ModalActionButtons.jsx';
import PokemonModalHeader from './PokemonModalHeader.jsx';
import PokemonModalBody from './PokemonModalBody.jsx';

// Główny komponent modalu
const PokemonDetailsModal = ({pokemonId, onClose}) => {
    // --- Hooki Podstawowe ---
    const pokemonIdStr = useMemo(() => pokemonId ? String(pokemonId) : null, [pokemonId]);
    const {isLoggedIn, currentUser} = useAuth();
    const {
        data: pokemonDetails,
        isLoading: isLoadingDetails,
        isError: isErrorDetails,
        error: errorDetails
    } = usePokemonDetails(pokemonIdStr);

    // --- Hooki Zarządzania (Ulubione/Arena) ---
    const {isFavorite, toggleFavorite, isUpdatingFavorite} = useFavoriteManagement(pokemonIdStr);
    const {isOnArena, canAddToArena, toggleArena, isUpdatingArena} = useArenaManagement(pokemonIdStr);

    // --- Efekt blokady scrolla tła ---
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Pobranie statystyk użytkownika dla bieżącego Pokemona
    const userPokemonStats = useMemo(() => {
        return currentUser?.pokemonStats?.[pokemonIdStr];
    }, [currentUser?.pokemonStats, pokemonIdStr]);

    // --- Renderowanie Zawartości ---
    const renderContent = () => {
        // Stan ładowania
        if (isLoadingDetails) {
            return <div className="text-center p-10 text-pokemon-blue-dark dark:text-pokemon-blue-light">Ładowanie
                szczegółów...</div>;
        }
        // Stan błędu
        if (isErrorDetails) {
            return (
                <div className="text-center p-10 text-pokemon-red-dark dark:text-pokemon-red">
                    <p>Wystąpił błąd: {errorDetails?.message || 'Nieznany błąd.'}</p>
                    <button onClick={onClose}
                            className="mt-4 px-4 py-2 bg-pokemon-red hover:bg-pokemon-red-dark text-white rounded focus:outline-none shadow transition-colors">
                        Zamknij
                    </button>
                </div>
            );
        }
        // Brak danych
        if (!pokemonDetails) {
            return <div className="text-center p-10 text-pokemon-gray-dark dark:text-pokemon-gray-light">Brak danych dla
                tego Pokemona.</div>;
        }

        // Pomyślne załadowanie danych
        return (
            <>
                {/* Przycisk Zamknięcia */}
                <button
                    onClick={onClose}
                    className={clsx(
                        "absolute top-3 right-3 p-1 rounded-full transition-colors z-20", // Podniesiony z-index
                        "text-pokemon-gray-dark hover:text-pokemon-gray-darker hover:bg-pokemon-gray-medium",
                        "dark:text-pokemon-gray-light dark:hover:text-pokemon-gray-darker dark:hover:bg-pokemon-gray-dark",
                        "focus:outline-none focus:ring-2 focus:ring-pokemon-red focus:ring-opacity-50"
                    )}
                    aria-label="Zamknij modal"
                >
                    <XMarkIcon className="h-6 w-6"/>
                </button>

                {/* Przyciski Akcji (Ulubione/Arena) - tylko dla zalogowanych */}
                {isLoggedIn && (
                    <ModalActionButtons
                        isFavorite={isFavorite}
                        isOnArena={isOnArena}
                        canAddToArena={canAddToArena}
                        toggleFavorite={toggleFavorite}
                        toggleArena={toggleArena}
                        isUpdatingFavorite={isUpdatingFavorite}
                        isUpdatingArena={isUpdatingArena}
                    />
                )}

                {/* Nagłówek Modala */}
                <PokemonModalHeader pokemonDetails={pokemonDetails}/>

                {/* Ciało Modala (Info, Umiejętności, Staty) */}
                <PokemonModalBody
                    pokemonDetails={pokemonDetails}
                    userPokemonStats={userPokemonStats}
                />
            </>
        );
    };

    // --- Renderowanie Głównego Kontenera Modala ---
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out"
            onClick={onClose} // Kliknięcie na tło zamyka modal
            role="dialog"
            aria-modal="true"
            aria-labelledby={pokemonDetails ? "pokemon-modal-title" : undefined}
        >
            <div
                className={clsx(
                    "rounded-xl shadow-2xl p-6 max-w-lg w-full relative transform transition-all duration-300 ease-out",
                    "bg-pokemon-gray-light dark:bg-pokemon-gray-darker",
                    "max-h-[90vh] overflow-y-auto", // Scroll wewnątrz modala
                    (isLoadingDetails || isErrorDetails) ? "flex justify-center items-center min-h-[200px]" : ""
                )}
                onClick={e => e.stopPropagation()} // Kliknięcie wewnątrz modala nie zamyka go
            >
                {renderContent()}
            </div>
        </div>
    );
};

PokemonDetailsModal.propTypes = {
    pokemonId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func.isRequired,
};

export default PokemonDetailsModal;
