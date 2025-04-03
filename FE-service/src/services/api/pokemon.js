import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_LIMIT = 150;

const processPokemonData = (data) => {
    const { id, name, sprites, types, stats, weight, height, base_experience, abilities } = data;

    const imageUrl =
        typeof sprites?.other === 'object' && sprites.other !== null
            ? sprites.other?.['official-artwork']?.front_default
            : sprites?.front_default;
    const processedStats = stats.reduce((acc, stat) => {
        acc[stat.stat.name] = stat.base_stat;
        return acc;
    }, {});
    const processedTypes = types.map(typeInfo => typeInfo.type.name);

    return {
        id,
        name,
        image: imageUrl,
        types: processedTypes,
        stats: processedStats,
        weight: weight / 10, // Konwersja hektogramów na kg
        height: height / 10, // Konwersja decymetrów na m
        base_experience,
        abilities,
    };
};

export const fetchPokemonList = async (limit = POKEMON_LIMIT, offset = 0) => {
    try {
        let currentUrl = `${BASE_URL}/pokemon?limit=20&offset=${offset}`;
        let allPokemonDetails = [];

        console.log('Początkowy limit:', limit);
        console.log('Początkowy currentUrl:', currentUrl);

        while (allPokemonDetails.length < limit && currentUrl) {
            console.log('Pobieram dane z:', currentUrl);
            const response = await axios.get(currentUrl);
            console.log('Odpowiedź API:', response);
            const { results, next } = response.data;
            console.log('Wyniki z API:', results);
            console.log('Następny URL:', next);

            const details = await Promise.all(
                results.map(async (pokemon) => {
                    console.log('Przetwarzam Pokemona:', pokemon);
                    const detailsResponse = await axios.get(pokemon.url);
                    console.log('Odpowiedź szczegółowa API:', detailsResponse);
                    const processedData = processPokemonData(detailsResponse.data);
                    console.log('Przetworzone dane:', processedData);
                    return processedData;
                })
            );
            console.log('Szczegóły Pokemonów (strona):', details);

            allPokemonDetails = [...allPokemonDetails, ...details];
            console.log('Łączna liczba pobranych Pokemonów:', allPokemonDetails.length);
            currentUrl = next;
        }

        console.log('Ostateczna lista pobranych Pokemonów:', allPokemonDetails);
        return allPokemonDetails.slice(0, limit);
    } catch (error) {
        console.error('Błąd podczas pobierania listy Pokemonów:', error);
        throw error;
    }
};

export const fetchPokemonDetails = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/pokemon/${id}/`);
        return processPokemonData(response.data);
    } catch (error) {
        console.error(`Błąd podczas pobierania szczegółów Pokemona o ID ${id}:`, error);
        throw error;
    }
};