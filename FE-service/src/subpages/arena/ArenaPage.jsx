import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext.jsx';
import usePokemonDetails from '../../hooks/usePokemonDetails.jsx';
import { updateUserArena } from '../../services/api/auth.js';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Swords } from 'lucide-react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { getUserData } from '../../services/api/auth.js';

import arena1 from '../../assets/arena/arena_1.webp';
import arena2 from '../../assets/arena/arena_2.webp';
import arena3 from '../../assets/arena/arena_3.webp';

const arenas = [arena1, arena2, arena3];

// --- Komponent Slotu Pokemona na Arenie ---
const ArenaSlot = ({ pokemonId, userStats }) => {
    const { data: pokemonDetails, isLoading, isError, error } = usePokemonDetails(pokemonId, { enabled: !!pokemonId });
    const { enqueueSnackbar } = useSnackbar();
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();

    const removeMutation = useMutation({
        mutationFn: () => {
            const currentArena = currentUser?.arenaPokemonIds?.map(String) || [];
            const updatedArena = currentArena.filter(id => id !== String(pokemonId));
            return updateUserArena(currentUser.id, updatedArena);
        },
        onSuccess: (updatedUserData) => {
            queryClient.setQueryData(['user', currentUser?.id], updatedUserData);
        },
        onError: (error) => {
            enqueueSnackbar(`Błąd podczas usuwania Pokemona z Areny: ${error.message}`, { variant: 'error' });
        },
    });

    const handleRemove = () => {
        if (!currentUser || !pokemonId || removeMutation.isPending) return;
        removeMutation.mutate();
    };

    if (!pokemonId) {
        return (
            <div className="w-64 h-80 bg-black bg-opacity-40 rounded-lg flex flex-col items-center justify-center text-white text-shadow-sm p-4 border-2 border-dashed border-gray-500">
                <p className="text-xl font-semibold">Wybierz Pokemona</p>
                <p className="text-sm text-gray-300">(Z widoku szczegółów)</p>
            </div>
        );
    }

    if (isLoading) {
        return <div className="w-64 h-80 bg-black bg-opacity-40 rounded-lg flex items-center justify-center text-white animate-pulse">Ładowanie...</div>;
    }

    if (isError) {
        return <div className="w-64 h-80 bg-black bg-opacity-40 rounded-lg flex items-center justify-center text-red-400">Błąd: {error?.message}</div>;
    }

    if (!pokemonDetails) {
        return <div className="w-64 h-80 bg-black bg-opacity-40 rounded-lg flex items-center justify-center text-yellow-400">Nie znaleziono danych Pokemona</div>;
    }

    const stats = userStats ? userStats[String(pokemonId)] : null;
    const displayBaseExperience = pokemonDetails.base_experience ?? 0;

    return (
        <div className="w-64 h-80 bg-black bg-opacity-60 rounded-lg flex flex-col items-center p-4 relative border-2 border-gray-600 shadow-lg">
            <button
                onClick={handleRemove}
                disabled={removeMutation.isPending}
                className="absolute top-2 right-2 p-1 text-gray-300 hover:text-white bg-red-600 hover:bg-red-700 rounded-full disabled:opacity-50 transition-colors z-10"
                title="Usuń z Areny"
            >
                <XMarkIcon className="h-5 w-5" />
            </button>

            {/* {stats && (stats.wins > 0 || stats.losses > 0) && (...)} */}

            <img
                src={pokemonDetails.image || '/src/assets/pokeball.svg'}
                alt={pokemonDetails.name}
                className="w-40 h-40 object-contain mt-4 mb-2"
            />
            <h3 className="text-xl font-bold capitalize text-white text-shadow-sm mb-2 text-center break-words">{pokemonDetails.name}</h3>
            <p className="text-sm text-gray-200">Dośw. Bazowe: {displayBaseExperience}</p>
            <p className="text-sm text-gray-200 mt-1">Waga: {pokemonDetails.weight} kg</p>
        </div>
    );
};

// --- Główny Komponent Strony Areny ---
const ArenaPage = () => {
    const { currentUser } = useAuth();
    const [backgroundImage, setBackgroundImage] = useState('');
    const [isBgLoading, setIsBgLoading] = useState(true);

    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const { data: userData, isLoading: isUserDataLoading } = useQuery({
        queryKey: ['user', currentUser?.id],
        queryFn: () => getUserData(currentUser.id),
        staleTime: 1 * 60 * 1000,
    });

    const arenaPokemonIds = useMemo(() => userData?.arenaPokemonIds || [], [userData]);
    const pokemonStats = useMemo(() => userData?.pokemonStats || {}, [userData]);

    useEffect(() => {
        setIsBgLoading(true);
        const randomIndex = Math.floor(Math.random() * arenas.length);
        const selectedArena = arenas[randomIndex];
        const img = new Image();
        img.onload = () => { setBackgroundImage(selectedArena); setIsBgLoading(false); };
        img.onerror = () => {
            // console.error("Error loading arena bg"); // Zostawiono error
            setIsBgLoading(false);
        };
        img.src = selectedArena;
        return () => { img.onload = null; img.onerror = null; };
    }, []);

    const handleFight = () => {
        // console.log("Walka! (Logika do implementacji)"); // Usunięto log
        enqueueSnackbar("Logika walki nie została jeszcze zaimplementowana.", { variant: 'info' });
    };

    const pageStyle = {
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
    };

    const isLoading = isBgLoading || isUserDataLoading;
    const canFight = arenaPokemonIds.length === 2;

    return (
        <div
            style={pageStyle}
            className={clsx(
                "arena-page",
                "transition-opacity duration-500 ease-in-out",
                "bg-pokemon-gray-darker"
            )}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="text-white text-2xl font-bold animate-pulse">Ładowanie danych...</div>
                </div>
            )}

            <div
                className={clsx(
                    "w-full flex flex-col items-center transition-opacity duration-500 ease-in-out",
                    isLoading ? "opacity-0" : "opacity-100"
                )}
            >
                <h1 className="text-4xl md:text-5xl font-bold text-white text-shadow-lg mb-8 md:mb-12">Arena Pokemon</h1>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8 md:mb-12 w-full max-w-4xl">
                    <ArenaSlot pokemonId={arenaPokemonIds[0] || null} userStats={pokemonStats} />
                    <div className="text-5xl font-extrabold text-white text-shadow-md mx-4 my-4 md:my-0">VS</div>
                    <ArenaSlot pokemonId={arenaPokemonIds[1] || null} userStats={pokemonStats} />
                </div>

                <div className="mt-4 h-16 flex items-center justify-center">
                    <button
                        onClick={handleFight}
                        disabled={!canFight || isLoading}
                        className={clsx(
                            "px-8 py-4 text-xl font-bold text-white rounded-lg shadow-lg transition-all duration-200 ease-in-out",
                            "flex items-center gap-2",
                            (!canFight || isLoading)
                                ? "bg-gray-500 cursor-not-allowed opacity-70"
                                : "bg-red-600 hover:bg-red-700 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        )}
                    >
                        <Swords className="h-6 w-6" />
                        WALCZ!
                    </button>
                </div>
            </div>
        </div>
    );
};

ArenaSlot.propTypes = {
    pokemonId: PropTypes.string,
    userStats: PropTypes.object,
};

export default ArenaPage;
