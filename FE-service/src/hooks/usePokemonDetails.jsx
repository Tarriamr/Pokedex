import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetails } from '../services/api/pokemon';

const usePokemonDetails = (pokemonId) => {
    return useQuery({
        queryKey: ['pokemonDetails', pokemonId],
        queryFn: () => fetchPokemonDetails(pokemonId),
        enabled: !!pokemonId,
        staleTime: 5 * 60 * 1000, // 5 minut
        retry: 3,
    });
};

export default usePokemonDetails;