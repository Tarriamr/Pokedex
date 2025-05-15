import { useQuery } from "@tanstack/react-query";
import { fetchPokemonDetails } from "../services/api/pokemon";

// Hook for downloading details for two Pokemon (for the needs of the arena)
export const useArenaPokemonDetails = (pokemonId1, pokemonId2) => {
  const queryOptions = (pokemonId) => ({
    queryKey: ["pokemonDetails", pokemonId],
    queryFn: () => fetchPokemonDetails(pokemonId),
    enabled: !!pokemonId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 1,
  });

  const query1 = useQuery(queryOptions(pokemonId1));
  const query2 = useQuery(queryOptions(pokemonId2));

  // total charging status for both queries
  const isLoadingDetails =
    (!!pokemonId1 && query1.isLoading) || (!!pokemonId2 && query2.isLoading);

  // total error status for both queries
  const isErrorDetails =
    (!!pokemonId1 && query1.isError) || (!!pokemonId2 && query2.isError);

  // we only return the data that is actually used by the ArenaPage
  return {
    pokemon1Details: query1.data,
    pokemon2Details: query2.data,
    isLoadingDetails,
    isErrorDetails,
  };
};
