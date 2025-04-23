import axios from "axios";
import apiClient from "./apiClient";
import { MAX_ARENA_POKEMONS } from "../../config/constants";
// Import the shared helper function
import { _sanitizeUserData } from "./apiUtils.js";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

// --- Helpers --- //

export const getPokemonImageUrl = (id) => {
  if (!id) return "/src/assets/pokeball.svg";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

// _sanitizeUserData removed from here

const _processPokemonData = (data) => {
  if (!data) return null;
  const { id, name, types, stats, weight, height, base_experience, abilities } =
    data;

  const processedStats =
    stats?.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {}) || {};
  const processedTypes = types?.map((typeInfo) => typeInfo.type.name) || [];

  return {
    id,
    name,
    types: processedTypes,
    stats: processedStats,
    weight: weight / 10, // Convert hectograms to kilograms
    height: height / 10, // Convert decimetres to meters
    base_experience,
    abilities: abilities || [], // Ensure abilities is an array
  };
};

// --- PokeAPI Functions --- //

export const fetchPokemonList = async (limit, offset = 0) => {
  try {
    const listResponse = await axios.get(
      `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    );
    const { results } = listResponse.data;

    const detailsPromises = results.map((pokemon) => axios.get(pokemon.url));
    const detailsResponses = await Promise.allSettled(detailsPromises);

    const processedList = detailsResponses
      .map((response, index) => {
        if (response.status === "fulfilled") {
          return _processPokemonData(response.value.data);
        } else {
          console.error(
            `Error fetching details for ${results[index]?.name}:`,
            response.reason,
          );
          return null;
        }
      })
      .filter((pokemon) => pokemon !== null);

    return processedList;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw error;
  }
};

export const fetchPokemonDetails = async (id) => {
  if (!id) throw new Error("Pokemon ID is required for fetching details.");
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${id}/`);
    return _processPokemonData(response.data);
  } catch (error) {
    console.error(`Error fetching details for Pokemon ID ${id}:`, error);
    if (error.response?.status === 404) {
      console.warn(`Pokemon with ID ${id} not found in PokeAPI.`);
      return null;
    }
    throw error;
  }
};

// --- JSON Server User Data Updates (Related to Pokemon) --- //

export const updateUserPokemonStats = async (
  userId,
  pokemonId,
  statsToUpdate,
) => {
  if (!userId || !pokemonId || !statsToUpdate) {
    throw new Error("User ID, Pokemon ID, and stats data are required.");
  }
  const pokemonIdStr = String(pokemonId);

  const cleanStatsToUpdate = { ...statsToUpdate };
  Object.keys(cleanStatsToUpdate).forEach((key) => {
    if (cleanStatsToUpdate[key] === undefined) {
      delete cleanStatsToUpdate[key];
    }
  });

  if (Object.keys(cleanStatsToUpdate).length === 0) {
    try {
      const currentData = await apiClient.get(`/users/${userId}`);
      return _sanitizeUserData(currentData.data); // Use imported helper
    } catch (fetchError) {
      console.error(
        `[updateUserPokemonStats] Error fetching user data after skipping update for Pokemon ${pokemonIdStr}:`,
        fetchError,
      );
      throw new Error(
        "Nie udało się pobrać danych użytkownika po pominięciu aktualizacji.",
      );
    }
  }

  try {
    const userResponse = await apiClient.get(`/users/${userId}`);
    const currentUserData = userResponse.data;
    const currentPokemonStats = currentUserData.pokemonStats || {};
    const existingStatsForPokemon = currentPokemonStats[pokemonIdStr] || {};
    const mergedStatsForPokemon = {
      ...existingStatsForPokemon,
      ...cleanStatsToUpdate,
    };

    const payload = {
      pokemonStats: {
        ...currentPokemonStats,
        [pokemonIdStr]: mergedStatsForPokemon,
      },
    };

    const patchUrl = `/users/${userId}`;
    const response = await apiClient.patch(patchUrl, payload);

    return _sanitizeUserData(response.data); // Use imported helper
  } catch (error) {
    console.error(
      `Error updating stats for Pokemon ${pokemonId} (User ${userId}) via PATCH ${`/users/${userId}`}:`,
      error,
    );
    const errorMessage =
      error.response?.data?.message ||
      `Nie udało się zaktualizować statystyk dla Pokémona ${pokemonId}.`;
    throw new Error(errorMessage);
  }
};

export const updateUserArena = async (userId, arenaPokemonIds) => {
  if (!userId) throw new Error("Wymagane ID użytkownika.");
  if (!Array.isArray(arenaPokemonIds))
    throw new Error("arenaPokemonIds musi być tablicą.");

  const stringArenaPokemonIds = arenaPokemonIds.map((id) => String(id));

  if (stringArenaPokemonIds.length > MAX_ARENA_POKEMONS) {
    throw new Error(
      `Arena może pomieścić maksymalnie ${MAX_ARENA_POKEMONS} Pokemony.`,
    );
  }

  try {
    const response = await apiClient.patch(`/users/${userId}`, {
      arenaPokemonIds: stringArenaPokemonIds,
    });
    return _sanitizeUserData(response.data); // Use imported helper
  } catch (error) {
    throw new Error(
      error?.message || "Nie udało się zaktualizować Pokemonów na Arenie.",
    );
  }
};
