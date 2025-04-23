import { useMemo } from 'react';
// Corrected import path for AuthContext
import { useAuth } from '../context/AuthContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../services/api/auth.js';
import { useArenaPokemonDetails } from '../hooks/useArenaPokemonDetails.js';
import { combinePokemonData } from '../utils/pokemonUtils.js';

export const useArenaData = () => {
    const { currentUser } = useAuth();

    // 1. Fetch User Data
    const {
        data: userData,
        isLoading: isLoadingUser,
        isError: isUserError,
        error: userError
    } = useQuery({
        queryKey: ['user', currentUser?.id],
        queryFn: () => getUserData(currentUser.id),
        enabled: !!currentUser?.id,
        staleTime: 30 * 1000, // Cache user data slightly shorter
    });

    // 2. Extract IDs and Stats from User Data
    const arenaPokemonIds = useMemo(() => userData?.arenaPokemonIds?.map(String) || [], [userData]);
    const pokemonStats = useMemo(() => userData?.pokemonStats || {}, [userData]);

    const pokemonId1 = arenaPokemonIds[0] || null;
    const pokemonId2 = arenaPokemonIds[1] || null;

    // 3. Fetch Base Pokemon Details
    const {
        pokemon1Details: basePokemon1Details,
        pokemon2Details: basePokemon2Details,
        isLoadingDetails,
        isErrorDetails,
        error: detailsError,
    } = useArenaPokemonDetails(pokemonId1, pokemonId2);

    // 4. Combine Base Details with User Stats
    const pokemon1 = useMemo(() => {
        if (!pokemonId1 || isLoadingDetails) return null;
        return combinePokemonData(basePokemon1Details, pokemonStats[pokemonId1], pokemonId1);
    }, [pokemonId1, basePokemon1Details, pokemonStats, isLoadingDetails]);

    const pokemon2 = useMemo(() => {
        if (!pokemonId2 || isLoadingDetails) return null;
        return combinePokemonData(basePokemon2Details, pokemonStats[pokemonId2], pokemonId2);
    }, [pokemonId2, basePokemon2Details, pokemonStats, isLoadingDetails]);

    // 5. Aggregate Loading and Error States
    const isLoading = isLoadingUser || (!!pokemonId1 && isLoadingDetails) || (!!pokemonId2 && isLoadingDetails);

    const isError = isUserError || (!!pokemonId1 && isErrorDetails) || (!!pokemonId2 && isErrorDetails);

    const error = useMemo(() => {
        if (isUserError) return userError;
        if (isErrorDetails) return detailsError;
        return null;
    }, [isUserError, isErrorDetails, userError, detailsError]);

    const errorMessage = useMemo(() => {
        if (!isError) return null;
        if (isUserError) return "Błąd ładowania danych użytkownika.";
        // Provide more context if possible for details error
        if (isErrorDetails) return `Błąd ładowania danych Pokémona/ów z API (${error?.message || 'nieznany błąd API'}).`;
        return "Wystąpił nieznany błąd ładowania.";
    }, [isError, isUserError, isErrorDetails, error]);


    return {
        pokemon1,
        pokemon2,
        isLoading,
        isError,
        errorMessage,
        arenaPokemonIds, // Keep returning this, needed for fight conditions
        pokemonStats,   // Keep returning this, might be needed
    };
};
