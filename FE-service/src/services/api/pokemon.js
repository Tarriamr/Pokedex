import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_LIMIT = 150;

export const fetchPokemonList = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/pokemon?limit=${POKEMON_LIMIT}`);
        const {results} = response.data;

        // Pobierz szczegółowe informacje dla każdego Pokemona
        const [pokemonDetails] = await Promise.all([Promise.all(
            results.map(async (pokemon) => {
                const detailsResponse = await axios.get(pokemon.url);
                const {id, name, sprites, types, stats, weight, height, base_experience} = detailsResponse.data;

                // Wyciągnij URL domyślnego sprite'a
                const imageUrl = sprites.other['official-artwork']?.front_default || sprites.front_default;

                // Przetwórz statystyki do prostszego formatu
                const processedStats = stats.reduce((acc, stat) => {
                    acc[stat.stat.name] = stat.base_stat;
                    return acc;
                }, {});

                // Wyciągnij nazwy typów
                const processedTypes = types.map(typeInfo => typeInfo.type.name);

                return {
                    id,
                    name,
                    image: imageUrl,
                    types: processedTypes,
                    stats: processedStats,
                    weight,
                    height,
                    base_experience,
                };
            })
        )]);

        return pokemonDetails;
    } catch (error) {
        console.error('Błąd podczas pobierania listy Pokemonów:', error);
        throw error;
    }
};
