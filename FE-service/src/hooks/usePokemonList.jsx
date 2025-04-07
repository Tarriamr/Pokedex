import {useQuery} from '@tanstack/react-query';
import {fetchPokemonList} from "../services/api/pokemon.js";

const usePokemonList = (limit) => {
    return useQuery({
        queryKey: ['pokemonList', limit], // Dodaj limit do klucza zapytania
        queryFn: () => fetchPokemonList(limit), // Przekaż limit do fetchPokemonList
    });
};

export default usePokemonList;