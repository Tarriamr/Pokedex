import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchPokemonDetails } from '../services/api/pokemon';
import { useAuth } from '../context/AuthContext';
// Import the shared combiner function
import { combinePokemonData } from '../utils/pokemonUtils.js';

const usePokemonDetails = (pokemonId) => {
    const pokemonIdStr = useMemo(() => pokemonId ? String(pokemonId) : null, [pokemonId]);
    const { currentUser } = useAuth();

    // Query: Fetch base details from PokeAPI for the given ID
    const {
        data: baseDetails, // Renamed from apiDetails for clarity
        isLoading: isLoadingDetails,
        isError: isErrorDetails,
        error: errorDetails
    } = useQuery({
        queryKey: ['pokemonDetails', pokemonIdStr], // Use a consistent key with usePokemonList
        queryFn: () => fetchPokemonDetails(pokemonIdStr),
        enabled: !!pokemonIdStr,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    // Get user-specific stats for this Pokemon
    const userStat = useMemo(() => currentUser?.pokemonStats?.[pokemonIdStr] || null, [
        currentUser?.pokemonStats,
        pokemonIdStr
    ]);

    // Combine data using the shared utility function
    const combinedDetails = useMemo(() => {
        if (!pokemonIdStr) return null;
        // Wait until base details are fetched (or failed)
        if (isLoadingDetails) return null;

        // Call the utility function
        // It handles cases where baseDetails might be null (due to API error)
        return combinePokemonData(baseDetails, userStat, pokemonIdStr);

    }, [pokemonIdStr, baseDetails, userStat, isLoadingDetails]);

    // Return combined data and status based on the API query
    return {
        data: combinedDetails,
        isLoading: isLoadingDetails, // Loading state is determined by the API fetch
        // Error if API failed AND we couldn't construct fallback data (handled inside combinePokemonData)
        isError: isErrorDetails && !combinedDetails,
        error: errorDetails,
    };
};

export default usePokemonDetails;
