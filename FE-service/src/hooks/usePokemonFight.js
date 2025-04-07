import {useState} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useSnackbar} from 'notistack';
import {updatePokemonStats} from '../services/api/auth.js';
import {useAuth} from '../context/AuthContext.jsx';

// Function to calculate fight score, considering potential modified experience
const calculateFightScore = (pokemon, userStats) => {
    if (!pokemon?.base_experience || !pokemon?.weight) return 0;
    // Use modified base experience from userStats if available, otherwise use API base_experience
    const baseExperience = userStats?.modified_base_experience ?? pokemon.base_experience;
    // Ensure weight is treated as a number, default to 1 if missing/invalid
    const weight = typeof pokemon.weight === 'number' ? pokemon.weight : 1;
    return baseExperience * weight;
};

export const usePokemonFight = (pokemon1, pokemon2) => {
    const {enqueueSnackbar} = useSnackbar();
    const queryClient = useQueryClient();
    const {currentUser} = useAuth();
    const [fightResult, setFightResult] = useState(null); // { winner: pokemon | null, loser: pokemon | null, draw: boolean }

    const updateStatsMutation = useMutation({
        mutationFn: (statsUpdate) => {
            if (!currentUser) throw new Error("Użytkownik nie jest zalogowany");
            // Fetch current user data to merge stats correctly
            // Ensure we get the most recent data before mutation if possible, though stale data is often fine here
            const userData = queryClient.getQueryData(['user', currentUser.id]);
            const existingStats = userData?.pokemonStats || {};

            // Deep merge might be safer if stats structure gets complex, but for now, shallow is likely fine
            // Create a new object for the merged stats to avoid mutating the cache directly
            const mergedStats = {...existingStats};
            for (const pokemonId in statsUpdate) {
                mergedStats[pokemonId] = {...(existingStats[pokemonId] || {}), ...statsUpdate[pokemonId]};
            }

            return updatePokemonStats(currentUser.id, mergedStats);
        },
        onSuccess: (updatedUserData) => {
            // Update the user query data in the cache with the response from the server
            queryClient.setQueryData(['user', currentUser?.id], updatedUserData);
            // Optionally invalidate user query if other components might need absolutely fresh data immediately
            // queryClient.invalidateQueries({ queryKey: ['user', currentUser?.id] });
            // Let's not invalidate here, onSuccess updates cache, which should be sufficient for ArenaPage
            enqueueSnackbar('Statystyki walki zaktualizowane!', {variant: 'success'});
        },
        onError: (error) => {
            // Use template literal correctly
            enqueueSnackbar(`Błąd aktualizacji statystyk: ${error.message}`, {variant: 'error'});
        },
    });

    const performFight = () => {
        // Ensure both Pokemon have data needed for fight calculation
        if (!pokemon1?.id || !pokemon2?.id || !currentUser || typeof pokemon1.base_experience !== 'number' || typeof pokemon1.weight !== 'number' || typeof pokemon2.base_experience !== 'number' || typeof pokemon2.weight !== 'number') {
            enqueueSnackbar('Nie można rozpocząć walki: brak kompletnych danych Pokemonów lub użytkownika.', {variant: 'warning'});
            return;
        }

        // Fetch potentially updated user data right before the fight calculation
        const userData = queryClient.getQueryData(['user', currentUser.id]);
        const userStats = userData?.pokemonStats || {};
        const id1 = String(pokemon1.id);
        const id2 = String(pokemon2.id);
        const stats1 = userStats[id1] || {wins: 0, losses: 0};
        const stats2 = userStats[id2] || {wins: 0, losses: 0};

        const score1 = calculateFightScore(pokemon1, stats1);
        const score2 = calculateFightScore(pokemon2, stats2);

        let result = {winner: null, loser: null, draw: false};
        let statsUpdate = {};

        // Get base experience, preferring modified if available
        const baseExp1 = stats1.modified_base_experience ?? pokemon1.base_experience;
        const baseExp2 = stats2.modified_base_experience ?? pokemon2.base_experience;

        if (score1 > score2) {
            result = {winner: pokemon1, loser: pokemon2, draw: false};
            statsUpdate[id1] = {
                wins: stats1.wins + 1,
                losses: stats1.losses,
                modified_base_experience: baseExp1 + 10, // Winner gets +10 exp
            };
            statsUpdate[id2] = {
                wins: stats2.wins,
                losses: stats2.losses + 1,
                modified_base_experience: baseExp2, // Loser keeps their current exp
            };
            // Use template literal correctly
            enqueueSnackbar(`${pokemon1.name} wygrywa!`, {variant: 'info'});

        } else if (score2 > score1) {
            result = {winner: pokemon2, loser: pokemon1, draw: false};
            statsUpdate[id1] = {
                wins: stats1.wins,
                losses: stats1.losses + 1,
                modified_base_experience: baseExp1, // Loser keeps their current exp
            };
            statsUpdate[id2] = {
                wins: stats2.wins + 1,
                losses: stats2.losses,
                modified_base_experience: baseExp2 + 10, // Winner gets +10 exp
            };
            // Use template literal correctly
            enqueueSnackbar(`${pokemon2.name} wygrywa!`, {variant: 'info'});

        } else {
            result = {winner: null, loser: null, draw: true};
            // Ensure stats objects exist even on draw, preserving modified exp
            statsUpdate[id1] = {
                ...stats1,
                modified_base_experience: baseExp1, // Keep current exp
            };
            statsUpdate[id2] = {
                ...stats2,
                modified_base_experience: baseExp2, // Keep current exp
            };
            enqueueSnackbar('Remis! Statystyki nie uległy zmianie.', {variant: 'info'});
        }

        setFightResult(result); // Set visual result state immediately

        // Mutate stats. The mutation handles updating the cache on success.
        updateStatsMutation.mutate(statsUpdate);
    };

    // Function to reset the fight result, e.g., when leaving the arena or removing a pokemon
    const resetFightResult = () => {
        setFightResult(null);
    };

    return {
        performFight,
        fightResult,
        isFighting: updateStatsMutation.isPending, // Reflect mutation loading state
        resetFightResult,
    };
};
