import React, {useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {useAuth} from '../../context/AuthContext.jsx';
import usePokemonDetails from '../../hooks/usePokemonDetails.jsx';
import {usePokemonFight} from '../../hooks/usePokemonFight.js';
import {getUserData, updateUserArena} from '../../services/api/auth.js';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useSnackbar} from 'notistack';
import {LogOut, Swords} from 'lucide-react';
import {XMarkIcon} from '@heroicons/react/24/solid';

import arena1 from '../../assets/arena/arena_1.webp';
import arena2 from '../../assets/arena/arena_2.webp';
import arena3 from '../../assets/arena/arena_3.webp';

const arenas = [arena1, arena2, arena3];

// --- Komponent Slotu Pokemona na Arenie (z poprawkami themingu) ---
const ArenaSlot = ({
                       pokemonId,
                       userStats,
                       pokemonDetails,
                       isLoading,
                       isError,
                       error,
                       fightResult,
                       isFighting,
                       onRemove
                   }) => {
    const {enqueueSnackbar} = useSnackbar();
    const {currentUser} = useAuth();
    const queryClient = useQueryClient();

    const removeMutation = useMutation({
        mutationFn: (currentArenaIds) => {
            const updatedArena = currentArenaIds.filter(id => id !== String(pokemonId));
            return updateUserArena(currentUser.id, updatedArena);
        },
        onSuccess: (updatedUserData) => {
            queryClient.setQueryData(['user', currentUser?.id], updatedUserData);
            queryClient.invalidateQueries({queryKey: ['user', currentUser?.id]});
            if (onRemove) onRemove();
            enqueueSnackbar('Pokemon usunięty z areny.', {variant: 'info'});
        },
        onError: (error) => {
            enqueueSnackbar(`Błąd podczas usuwania Pokemona z Areny: ${error.message}`, {variant: 'error'});
        },
    });

    const handleRemove = () => {
        const userData = queryClient.getQueryData(['user', currentUser?.id]);
        const currentArenaIds = userData?.arenaPokemonIds?.map(String) || [];
        if (!currentUser || !pokemonId || removeMutation.isPending || isFighting || fightResult) return;
        removeMutation.mutate(currentArenaIds);
    };

    // --- Stany ładowania, błędu, pustego slotu (dodano style dark mode) ---
    if (!pokemonId) {
        return (
            <div
                className="w-64 h-80 bg-black bg-opacity-40 dark:bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white text-shadow-sm p-4 border-2 border-dashed border-gray-500 dark:border-gray-400 relative">
                <p className="text-xl font-semibold">Wybierz Pokemona</p>
                <p className="text-sm text-gray-300 dark:text-gray-400">(Z widoku szczegółów)</p>
            </div>
        );
    }
    if (isLoading) {
        return <div
            className="w-64 h-80 bg-black bg-opacity-40 dark:bg-opacity-50 rounded-lg flex items-center justify-center text-white animate-pulse relative">Ładowanie...</div>;
    }
    if (isError) {
        return <div
            className="w-64 h-80 bg-black bg-opacity-40 dark:bg-opacity-50 rounded-lg flex items-center justify-center text-red-400 dark:text-red-500 relative">Błąd: {error?.message}</div>;
    }
    if (!pokemonDetails) {
        return <div
            className="w-64 h-80 bg-black bg-opacity-40 dark:bg-opacity-50 rounded-lg flex items-center justify-center text-yellow-400 dark:text-yellow-500 relative">Nie
            znaleziono danych</div>;
    }

    const stats = userStats ? userStats[String(pokemonId)] : null;
    const currentBaseExperience = stats?.modified_base_experience ?? pokemonDetails.base_experience ?? 0;

    // --- Efekty wizualne (bez zmian w logice) ---
    let imageFilterClass = '';
    let winnerShadowClass = '';
    const isWinner = fightResult && !fightResult.draw && String(fightResult.winner?.id) === pokemonId;
    const isLoser = fightResult && !fightResult.draw && String(fightResult.loser?.id) === pokemonId;
    if (isWinner) {
        const primaryType = pokemonDetails?.types?.[0]?.toLowerCase();
        winnerShadowClass = primaryType ? `shadow-pokemon-type-${primaryType}` : 'shadow-pokemon-gray-light';
    } else if (isLoser) {
        imageFilterClass = 'grayscale';
    }

    return (
        <div
            className={clsx(
                "w-64 h-80 bg-black rounded-lg flex flex-col items-center p-4 relative border-2 transition-all duration-500 ease-in-out",
                // Dostosowanie tła i ramki dla dark mode
                "bg-opacity-60 dark:bg-opacity-70",
                "border-gray-600 dark:border-gray-400",
                winnerShadowClass
            )}
        >
            {/* Przycisk usuwania - dostosowanie hover dla dark mode */}
            {!isFighting && !fightResult && (
                <button
                    onClick={handleRemove}
                    disabled={removeMutation.isPending}
                    className="absolute top-2 right-2 p-1 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 rounded-full disabled:opacity-50 transition-colors z-10"
                    title="Usuń z Areny"
                >
                    <XMarkIcon className="h-5 w-5"/>
                </button>
            )}
            {/* Etykieta statystyk W/L - dostosowanie tła i tekstu */}
            {stats && (stats.wins > 0 || stats.losses > 0) && (
                <div
                    className="absolute top-2 left-2 bg-black bg-opacity-70 dark:bg-opacity-80 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                    W: {stats.wins} / L: {stats.losses}
                </div>
            )}
            <img
                src={pokemonDetails.image || '/src/assets/pokeball.svg'}
                alt={pokemonDetails.name}
                className={clsx(
                    "w-40 h-40 object-contain mt-4 mb-2 transition-all duration-500 ease-in-out",
                    imageFilterClass
                )}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/pokeball.svg';
                }}
            />
            {/* Nazwa i statystyki - zapewnienie czytelności tekstu */}
            <h3 className="text-xl font-bold capitalize text-white dark:text-gray-100 text-shadow-sm mb-2 text-center break-words">{pokemonDetails.name}</h3>
            <p className="text-sm text-gray-200 dark:text-gray-300">Aktualne Dośw.: {currentBaseExperience}</p>
            {stats?.modified_base_experience !== undefined && stats.modified_base_experience !== pokemonDetails.base_experience && (
                <p className="text-xs text-yellow-300 dark:text-yellow-400">(Bazowe: {pokemonDetails.base_experience ?? 'N/A'})</p>
            )}
            <p className="text-sm text-gray-200 dark:text-gray-300 mt-1">Waga: {pokemonDetails.weight ?? 'N/A'} kg</p>
        </div>
    );
};

// --- Główny Komponent Strony Areny (z poprawkami themingu) ---
const ArenaPage = () => {
    const {currentUser} = useAuth();
    const [backgroundImage, setBackgroundImage] = useState('');
    const [isBgLoading, setIsBgLoading] = useState(true);

    const queryClient = useQueryClient();
    const {enqueueSnackbar} = useSnackbar();

    const {data: userData, isLoading: isUserDataLoading, isError: isUserError} = useQuery({
        queryKey: ['user', currentUser?.id],
        queryFn: () => getUserData(currentUser.id),
        enabled: !!currentUser?.id,
        staleTime: 1 * 60 * 1000,
    });

    const arenaPokemonIds = useMemo(() => userData?.arenaPokemonIds?.map(String) || [], [userData]);
    const pokemonStats = useMemo(() => userData?.pokemonStats || {}, [userData]);

    const pokemonId1 = arenaPokemonIds[0] || null;
    const pokemonId2 = arenaPokemonIds[1] || null;

    const {
        data: pokemonDetails1,
        isLoading: isLoading1,
        isError: isError1,
        error: error1
    } = usePokemonDetails(pokemonId1, {enabled: !!pokemonId1});
    const {
        data: pokemonDetails2,
        isLoading: isLoading2,
        isError: isError2,
        error: error2
    } = usePokemonDetails(pokemonId2, {enabled: !!pokemonId2});

    useEffect(() => {
        setIsBgLoading(true);
        const randomIndex = Math.floor(Math.random() * arenas.length);
        const selectedArena = arenas[randomIndex];
        const img = new Image();
        img.onload = () => {
            setBackgroundImage(selectedArena);
            setIsBgLoading(false);
        };
        img.onerror = () => {
            setBackgroundImage(arenas[0]);
            setIsBgLoading(false);
        };
        img.src = selectedArena;
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, []);

    const {performFight, fightResult, isFighting, resetFightResult} = usePokemonFight(pokemonDetails1, pokemonDetails2);

    const leaveArenaMutation = useMutation({
        mutationFn: () => updateUserArena(currentUser.id, []),
        onSuccess: (updatedUserData) => {
            queryClient.setQueryData(['user', currentUser?.id], updatedUserData);
            resetFightResult();
            enqueueSnackbar('Opuściłeś arenę.', {variant: 'info'});
            queryClient.invalidateQueries({queryKey: ['user', currentUser?.id]});
        },
        onError: (error) => {
            enqueueSnackbar(`Błąd podczas opuszczania areny: ${error.message}`, {variant: 'error'});
        }
    });

    const handleLeaveArena = () => {
        if (leaveArenaMutation.isPending || isFighting) return;
        leaveArenaMutation.mutate();
    };

    const pageStyle = useMemo(() => ({
        backgroundImage: !isBgLoading && backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center 75%',
        backgroundRepeat: 'no-repeat',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '2rem',
        position: 'relative',
    }), [isBgLoading, backgroundImage]);

    const isLoadingOverall = isBgLoading || isUserDataLoading || (!!pokemonId1 && isLoading1) || (!!pokemonId2 && isLoading2);
    const hasLoadingError = isUserError || (!!pokemonId1 && isError1) || (!!pokemonId2 && isError2);
    const detailsReadyForFight = pokemonDetails1 && pokemonDetails2 && !isLoading1 && !isLoading2 && !isError1 && !isError2;

    const canFight = arenaPokemonIds.length === 2 && detailsReadyForFight && !isLoadingOverall && !isFighting && !fightResult && !hasLoadingError;
    const showLeaveButton = fightResult !== null && !isFighting;
    const showFightButton = !showLeaveButton && !isFighting && !hasLoadingError && arenaPokemonIds.length === 2;

    let fightResultMessage = null;
    if (fightResult) {
        if (fightResult.draw) {
            fightResultMessage = "Walka zakończyła się remisem!";
        } else if (fightResult.winner && fightResult.loser) {
            const winnerNameDisplay = fightResult.winner.name ? fightResult.winner.name.charAt(0).toUpperCase() + fightResult.winner.name.slice(1) : 'Zwycięzca';
            const loserNameDisplay = fightResult.loser.name ? fightResult.loser.name.charAt(0).toUpperCase() + fightResult.loser.name.slice(1) : 'Przegrany';
            fightResultMessage = `${winnerNameDisplay} pokonuje ${loserNameDisplay}!`;
        }
    }

    return (
        <div
            style={pageStyle}
            className={clsx(
                "arena-page",
                "transition-opacity duration-500 ease-in-out",
                "bg-pokemon-gray-darker" // Tło fallback, gdy obraz się nie załaduje
            )}
        >
            {/* Overlay ładowania (dostosowanie tekstu) */}
            {isLoadingOverall && !backgroundImage && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 dark:bg-opacity-80 z-50">
                    <div className="text-white dark:text-gray-200 text-2xl font-bold animate-pulse">Ładowanie Areny...
                    </div>
                </div>
            )}
            {/* Overlay błędu (dostosowanie tekstu i tła) */}
            {hasLoadingError && !isLoadingOverall && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-80 dark:bg-opacity-90 z-40">
                    <div className="text-white dark:text-red-100 text-xl font-bold text-center p-4">
                        Wystąpił błąd podczas ładowania danych Areny. <br/>
                        {isUserError && "Błąd ładowania danych użytkownika. "}
                        {(isError1 || isError2) && "Błąd ładowania danych Pokemona. "}
                        Spróbuj odświeżyć stronę.
                    </div>
                </div>
            )}

            {/* Główna zawartość */}
            <div
                className={clsx(
                    "w-full flex flex-col items-center transition-opacity duration-500 ease-in-out",
                    (isBgLoading || (hasLoadingError && !isLoadingOverall)) ? "opacity-0" : "opacity-100"
                )}
            >
                {/* Tytuł strony - zapewnienie widoczności */}
                <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-gray-100 text-shadow-lg mb-8 md:mb-12">Arena
                    Pokemon</h1>

                {/* Kontener slotów */}
                <div
                    className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8 md:mb-12 w-full max-w-4xl">
                    <ArenaSlot
                        pokemonId={pokemonId1}
                        userStats={pokemonStats}
                        pokemonDetails={pokemonDetails1}
                        isLoading={isLoading1 && !!pokemonId1}
                        isError={isError1}
                        error={error1}
                        fightResult={fightResult}
                        isFighting={isFighting}
                        onRemove={resetFightResult}
                    />
                    {/* Separator VS - zapewnienie widoczności */}
                    <div
                        className="text-5xl font-extrabold text-white dark:text-gray-100 text-shadow-md mx-4 my-4 md:my-0 select-none">VS
                    </div>
                    <ArenaSlot
                        pokemonId={pokemonId2}
                        userStats={pokemonStats}
                        pokemonDetails={pokemonDetails2}
                        isLoading={isLoading2 && !!pokemonId2}
                        isError={isError2}
                        error={error2}
                        fightResult={fightResult}
                        isFighting={isFighting}
                        onRemove={resetFightResult}
                    />
                </div>

                {/* Komunikat wyniku walki (dostosowanie tła i tekstu) */}
                {fightResultMessage && (
                    <div
                        className="text-center text-2xl font-bold text-white dark:text-gray-100 text-shadow-md my-4 px-4 py-2 bg-black bg-opacity-60 dark:bg-opacity-75 rounded-lg">
                        {fightResultMessage}
                    </div>
                )}

                {/* Przyciski akcji (dostosowanie tekstu) */}
                <div className="mt-4 h-16 flex items-center justify-center">
                    {showFightButton && (
                        <button
                            onClick={performFight}
                            disabled={!canFight}
                            className={clsx(
                                "px-8 py-4 text-xl font-bold rounded-lg shadow-lg transition-all duration-200 ease-in-out",
                                "flex items-center gap-2",
                                !canFight
                                    ? "bg-gray-500 text-white dark:text-gray-300 cursor-not-allowed opacity-70"
                                    : "bg-red-600 text-white hover:bg-red-700 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 animate-pulse-slow"
                            )}
                        >
                            <> <Swords className="h-6 w-6"/> WALCZ!</>
                        </button>
                    )}
                    {isFighting && (
                        <button
                            disabled={true}
                            className={clsx(
                                "px-8 py-4 text-xl font-bold rounded-lg shadow-lg",
                                "flex items-center gap-2 bg-yellow-600 text-white dark:text-yellow-100 opacity-80 cursor-wait"
                            )}
                        >
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Walka trwa...
                        </button>
                    )}
                    {showLeaveButton && (
                        <button
                            onClick={handleLeaveArena}
                            disabled={leaveArenaMutation.isPending}
                            className={clsx(
                                "px-8 py-4 text-xl font-bold rounded-lg shadow-lg transition-all duration-200 ease-in-out",
                                "flex items-center gap-2",
                                leaveArenaMutation.isPending
                                    ? "bg-gray-500 text-white dark:text-gray-300 cursor-not-allowed opacity-70"
                                    : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            )}
                        >
                            {leaveArenaMutation.isPending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                                         fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Opuszczanie...
                                </>
                            ) : (
                                <>
                                    <LogOut className="h-6 w-6"/>
                                    Opuść arenę
                                </>
                            )}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

ArenaSlot.propTypes = {
    pokemonId: PropTypes.string,
    userStats: PropTypes.object,
    pokemonDetails: PropTypes.object,
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
    error: PropTypes.object,
    fightResult: PropTypes.shape({
        winner: PropTypes.object,
        loser: PropTypes.object,
        draw: PropTypes.bool.isRequired,
    }),
    isFighting: PropTypes.bool,
    onRemove: PropTypes.func,
};

export default ArenaPage;
