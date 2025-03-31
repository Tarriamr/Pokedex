import {useQuery} from '@tanstack/react-query';
import {fetchPokemonList} from "../services/api/pokemon.js";


const usePokemonList = () => {
    return useQuery({
        queryKey: ['pokemonList'],
        queryFn: fetchPokemonList,
    });
};

export default usePokemonList;
