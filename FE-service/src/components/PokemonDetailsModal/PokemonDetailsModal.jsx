import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { XMarkIcon, HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { Swords } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import usePokemonDetails from "../../hooks/usePokemonDetails.jsx";
import { useAuth } from '../../context/AuthContext.jsx';
import { updateUserFavorites, updateUserArena } from '../../services/api/auth.js';

const PokemonDetailsModal = ({ pokemonId, onClose }) => {
    const pokemonIdStr = useMemo(() => pokemonId ? String(pokemonId) : null, [pokemonId]);

    const { data: pokemonDetails, isLoading: isLoadingDetails, isError: isErrorDetails, error: errorDetails } = usePokemonDetails(pokemonIdStr);
    const { isLoggedIn, currentUser } = useAuth();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    // --- Favorite Mutation ---
    const updateFavoritesMutation = useMutation({
        mutationFn: ({ userId, updatedFavorites }) => updateUserFavorites(userId, updatedFavorites),
        onSuccess: (updatedUserData) => {
            queryClient.setQueryData(['user', currentUser?.id], updatedUserData);
            enqueueSnackbar('Lista ulubionych zaktualizowana!', { variant: 'success' });
        },
        onError: (error) => {
            enqueueSnackbar(`Błąd aktualizacji ulubionych: ${error.message}`, { variant: 'error' });
            // console.error("Błąd podczas aktualizacji ulubionych:", error); // Można zostawić lub usunąć
        },
    });

    // --- Arena Mutation ---
    const updateArenaMutation = useMutation({
        mutationFn: ({ userId, updatedArena }) => updateUserArena(userId, updatedArena),
        onSuccess: (updatedUserData) => {
            queryClient.setQueryData(['user', currentUser?.id], updatedUserData);
            enqueueSnackbar('Arena zaktualizowana!', { variant: 'success' });
        },
        onError: (error) => {
            enqueueSnackbar(`Błąd aktualizacji Areny: ${error.message}`, { variant: 'error' });
            // console.error("Błąd podczas aktualizacji Areny:", error); // Można zostawić lub usunąć
        },
    });

    // --- Memoized States ---
    const isFavorite = useMemo(() => {
        return isLoggedIn && currentUser?.favoritePokemonIds?.map(String).includes(pokemonIdStr);
    }, [isLoggedIn, currentUser?.favoritePokemonIds, pokemonIdStr]);

    const isOnArena = useMemo(() => {
        return isLoggedIn && currentUser?.arenaPokemonIds?.map(String).includes(pokemonIdStr);
    }, [isLoggedIn, currentUser?.arenaPokemonIds, pokemonIdStr]);

    const isArenaFull = useMemo(() => {
        return isLoggedIn && currentUser?.arenaPokemonIds?.length >= 2;
    }, [isLoggedIn, currentUser?.arenaPokemonIds]);

    // --- Handlers ---
    const handleToggleFavorite = () => {
        if (!isLoggedIn || !currentUser || !pokemonIdStr) return;
        const currentFavorites = currentUser.favoritePokemonIds?.map(String) || [];
        let updatedFavorites;

        if (isFavorite) {
            updatedFavorites = currentFavorites.filter(id => id !== pokemonIdStr);
        } else {
            updatedFavorites = [...currentFavorites, pokemonIdStr];
        }
        updateFavoritesMutation.mutate({ userId: currentUser.id, updatedFavorites });
    };

    const handleToggleArena = () => {
        if (!isLoggedIn || !currentUser || !pokemonIdStr) return;

        const currentArena = currentUser.arenaPokemonIds?.map(String) || [];
        let updatedArena;

        if (isOnArena) {
            updatedArena = currentArena.filter(id => id !== pokemonIdStr);
            updateArenaMutation.mutate({ userId: currentUser.id, updatedArena });
        } else {
            if (isArenaFull) {
                enqueueSnackbar('Arena jest pełna (max 2 Pokemony)', { variant: 'warning' });
                return;
            }
            updatedArena = [...currentArena, pokemonIdStr];
            updateArenaMutation.mutate({ userId: currentUser.id, updatedArena });
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // --- Render Logic ---
    const renderContent = () => {
        if (isLoadingDetails) {
            return <div className="text-center p-10 text-pokemon-blue-dark dark:text-pokemon-blue-light">Ładowanie szczegółów...</div>;
        }
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
        if (!pokemonDetails) {
            return <div className="text-center p-10 text-pokemon-gray-dark dark:text-pokemon-gray-light">Brak danych dla tego Pokemona.</div>;
        }

        const userPokemonStats = currentUser?.pokemonStats?.[pokemonIdStr];
        const displayBaseExperience = userPokemonStats?.modified_base_experience ?? pokemonDetails.base_experience;

        return (
            <>
                <button
                    onClick={onClose}
                    className={clsx(
                        "absolute top-3 right-3 p-1 rounded-full transition-colors z-10",
                        "text-pokemon-gray-dark hover:text-pokemon-gray-darker hover:bg-pokemon-gray-medium",
                        "dark:text-pokemon-gray-light dark:hover:text-pokemon-gray-darker dark:hover:bg-pokemon-gray-dark",
                        "focus:outline-none focus:ring-2 focus:ring-pokemon-red focus:ring-opacity-50"
                    )}
                    aria-label="Zamknij modal"
                >
                    <XMarkIcon className="h-6 w-6"/>
                </button>

                <div className="absolute top-3 left-3 flex space-x-2">
                    {isLoggedIn && (
                        <button
                            onClick={handleToggleFavorite}
                            disabled={updateFavoritesMutation.isPending}
                            className={clsx(
                                "p-1 rounded-full transition-colors",
                                "focus:outline-none focus:ring-2 focus:ring-pokemon-red focus:ring-opacity-50",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "text-pokemon-red",
                                "hover:text-pokemon-gray-darker dark:hover:text-pokemon-gray-light"
                            )}
                            aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                            title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                        >
                            {isFavorite ? <HeartIcon className="h-6 w-6" /> : <HeartIconOutline className="h-6 w-6" />}
                        </button>
                    )}
                    {isLoggedIn && (
                        <button
                            onClick={handleToggleArena}
                            disabled={updateArenaMutation.isPending || (!isOnArena && isArenaFull)}
                            className={clsx(
                                "p-1 rounded-full transition-colors",
                                "focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:ring-opacity-50",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                isOnArena ? "text-pokemon-blue-dark dark:text-pokemon-blue-light" : "text-pokemon-gray-dark dark:text-pokemon-gray-light",
                                !updateArenaMutation.isPending && !(!isOnArena && isArenaFull) && "hover:text-pokemon-blue-darker dark:hover:text-pokemon-blue"
                            )}
                            aria-label={isOnArena ? "Usuń z Areny" : (isArenaFull ? "Arena pełna" : "Dodaj do Areny")}
                            title={isOnArena ? "Usuń z Areny" : (isArenaFull ? "Arena pełna" : "Dodaj do Areny")}
                        >
                            <Swords className="h-6 w-6" strokeWidth={isOnArena ? 2.5 : 2} />
                        </button>
                    )}
                </div>

                <div className="text-center pt-8 mt-6 mb-5 border-b border-pokemon-gray-medium dark:border-pokemon-gray-dark pb-4">
                    <img
                        src={pokemonDetails.image || './src/assets/pokeball.svg'}
                        alt={pokemonDetails.name}
                        className="w-48 h-48 mx-auto mb-3"
                    />
                    <h2 className="text-3xl font-bold text-pokemon-gray-darker dark:text-pokemon-gray-light capitalize" id="pokemon-modal-title">{pokemonDetails.name}</h2>
                    <p className="text-sm text-pokemon-gray-dark dark:text-pokemon-gray-light mb-2">ID: #{String(pokemonDetails.id).padStart(3, '0')}</p>
                    <div className="flex justify-center flex-wrap gap-2">
                        {pokemonDetails.types?.map((type) => (
                            <span key={type} className={clsx(
                                "px-3 py-1 rounded-full text-xs font-semibold capitalize text-white shadow",
                                `bg-pokemon-type-${type}`
                            )}>{type}</span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-pokemon-gray-darker dark:text-pokemon-gray-light">
                    <h3 className="md:col-span-1 text-lg font-semibold mb-1 border-b border-pokemon-gray-medium dark:border-pokemon-gray-dark pb-1">Informacje</h3>
                    <h3 className="md:col-span-1 text-lg font-semibold mb-1 border-b border-pokemon-gray-medium dark:border-pokemon-gray-dark pb-1">Umiejętności</h3>
                    <div className="space-y-1">
                        <p><strong>Wzrost:</strong> {pokemonDetails.height} m</p>
                        <p><strong>Waga:</strong> {pokemonDetails.weight} kg</p>
                        <p><strong>Dośw. bazowe:</strong> {displayBaseExperience}
                            {userPokemonStats?.modified_base_experience && (
                                <span className="text-xs text-pokemon-green dark:text-pokemon-green-light ml-1">(Zmodyfikowane)</span>
                            )}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <ul className="list-disc list-inside pl-1">
                            {pokemonDetails.abilities?.map(abilityInfo => (
                                <li key={abilityInfo.ability.name} className="capitalize">
                                    {abilityInfo.ability.name.replace('-', ' ')}
                                    {abilityInfo.is_hidden && <span className="text-xs text-pokemon-blue-dark dark:text-pokemon-blue-light ml-1">(ukryta)</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="md:col-span-2 space-y-1 mt-2">
                        <h3 className="text-lg font-semibold mb-1 border-b border-pokemon-gray-medium dark:border-pokemon-gray-dark pb-1">Statystyki Bazowe</h3>
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

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby={pokemonDetails ? "pokemon-modal-title" : undefined}
        >
            <div
                className={clsx(
                    "rounded-xl shadow-2xl p-6 max-w-lg w-full relative transform transition-all duration-300 ease-out",
                    "bg-pokemon-gray-light dark:bg-pokemon-gray-darker",
                    "max-h-[90vh] overflow-y-auto",
                    (isLoadingDetails || isErrorDetails) ? "flex justify-center items-center min-h-[200px]" : ""
                )}
                onClick={e => e.stopPropagation()}
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
