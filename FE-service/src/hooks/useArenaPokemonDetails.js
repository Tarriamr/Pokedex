import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetails } from '../services/api/pokemon';

// Hook do pobierania szczegółów dla dwóch Pokemonów (na potrzeby Areny)
export const useArenaPokemonDetails = (pokemonId1, pokemonId2) => {
    const queryOptions = (pokemonId) => ({
        queryKey: ['pokemonDetails', pokemonId],
        queryFn: () => fetchPokemonDetails(pokemonId),
        enabled: !!pokemonId, // Uruchom tylko jeśli ID istnieje
        staleTime: 5 * 60 * 1000, // 5 minut cache
        retry: 1, // Mniej prób dla danych, które mogą się nie załadować
    });

    const query1 = useQuery(queryOptions(pokemonId1));
    const query2 = useQuery(queryOptions(pokemonId2));

    // Łączny stan ładowania dla obu zapytań
    const isLoadingDetails =
        (!!pokemonId1 && query1.isLoading) || (!!pokemonId2 && query2.isLoading);

    // Łączny stan błędu dla obu zapytań
    const isErrorDetails =
        (!!pokemonId1 && query1.isError) || (!!pokemonId2 && query2.isError);

    // Zwracamy tylko te dane, które są faktycznie używane przez ArenaPage
    return {
        pokemon1Details: query1.data,
        pokemon2Details: query2.data,
        isLoadingDetails,
        isErrorDetails,
        // Usunięto nieużywane: errorDetails1, errorDetails2, isFetching1, isFetching2
    };
};