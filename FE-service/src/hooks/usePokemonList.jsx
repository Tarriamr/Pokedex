import { useQuery, useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchPokemonList, fetchPokemonDetails } from "../services/api/pokemon.js";
import { POKEMON_API_LIMIT } from '../config/constants';
import { combinePokemonData } from '../utils/pokemonUtils.js';

const usePokemonList = (limit = POKEMON_API_LIMIT, userStats = null) => {
    const { data: basePokemonList, isLoading: isLoadingApiList, isError: isErrorApiList, error: errorApiList } = useQuery({
        queryKey: ['basePokemonList', limit],
        queryFn: () => fetchPokemonList(limit),
        staleTime: 10 * 60 * 1000,
    });

    const stats = userStats || {};

    const customPokemonIds = useMemo(() => {
        return Object.keys(stats)
            .filter(idStr => {
                const idNum = parseInt(idStr, 10);
                return idNum > limit || stats[idStr]?.isCustom;
            });
    }, [stats, limit]);

    const customPokemonDetailsQueries = useQueries({
        queries: customPokemonIds.map(idStr => ({
            queryKey: ['pokemonDetails', idStr],
            queryFn: () => fetchPokemonDetails(idStr),
            staleTime: Infinity,
            enabled: !!idStr,
            retry: 1,
        })),
    });

    const isLoadingCustomDetails = customPokemonDetailsQueries.some(q => q.isLoading);
    const isErrorCustomDetails = customPokemonDetailsQueries.some(q => q.isError);
    const errorCustomDetails = customPokemonDetailsQueries.find(q => q.error)?.error;

    const combinedPokemonList = useMemo(() => {
        if (isLoadingApiList || isLoadingCustomDetails) return undefined;

        if (isErrorApiList && !basePokemonList) {
            console.error("Error fetching base Pokemon list:", errorApiList);
            return null;
        }

        const customDetailsMap = customPokemonDetailsQueries.reduce((acc, queryResult) => {
            if (queryResult.isSuccess && queryResult.data) {
                acc[String(queryResult.data.id)] = queryResult.data;
            } else if (queryResult.isError) {
                console.warn(`Failed to fetch details for potential custom Pokemon ID: ${queryResult.queryKey[1]}`, queryResult.error);
            }
            return acc;
        }, {});

        const combinedMap = {};

        // 1. Process Pokemon from the base API list
        if (basePokemonList) {
            basePokemonList.forEach(basePokemon => {
                // Ensure basePokemon is a valid object with an ID
                if (!basePokemon || typeof basePokemon.id === 'undefined') {
                    console.warn('[usePokemonList] Skipping invalid base Pokemon data entry:', basePokemon);
                    return;
                }
                const pokemonIdStr = String(basePokemon.id);
                const userStat = stats[pokemonIdStr];
                if (userStat?.isCustom) return;

                const combined = combinePokemonData(basePokemon, userStat, pokemonIdStr);
                if (combined) combinedMap[pokemonIdStr] = combined;
            });
        }

        // 2. Process custom Pokemon (from stats)
        Object.keys(stats).forEach(pokemonIdStr => {
            const userStat = stats[pokemonIdStr];
            const pokemonIdNum = parseInt(pokemonIdStr, 10);

            if (userStat?.isCustom || pokemonIdNum > limit) {
                if (combinedMap[pokemonIdStr]) return;

                const baseDetailsForCustom = customDetailsMap[pokemonIdStr] || null;
                const combined = combinePokemonData(baseDetailsForCustom, userStat, pokemonIdStr);
                if (combined) combinedMap[pokemonIdStr] = combined;
            }
        });

        const combinedList = Object.values(combinedMap);
        combinedList.sort((a, b) => a.id - b.id);

        return combinedList;

    }, [
        basePokemonList, stats, limit, customPokemonDetailsQueries,
        isLoadingApiList, isLoadingCustomDetails, isErrorApiList, errorApiList
    ]);

    return {
        data: combinedPokemonList,
        isLoading: combinedPokemonList === undefined,
        isError: (isErrorApiList && !basePokemonList) || isErrorCustomDetails,
        error: errorApiList || errorCustomDetails,
    };
};

export default usePokemonList;
