import { getPokemonImageUrl } from "../services/api/pokemon";
// Import the shared helper function
import { safeGetNumber } from "./numberUtils.js";

// safeGetNumber function removed from here

export const combinePokemonData = (baseDetails, userStat, pokemonId) => {
  const pokemonIdStr = String(pokemonId);
  const pokemonIdNum = parseInt(pokemonIdStr, 10);
  const stats = userStat || {};
  const isCustom = stats.isCustom === true;

  const effectiveBaseDetails = baseDetails === undefined ? null : baseDetails;

  if (effectiveBaseDetails) {
    const combined = {
      ...effectiveBaseDetails,
      id: pokemonIdNum,
      image: getPokemonImageUrl(pokemonIdNum),
      name: isCustom && stats.name ? stats.name : effectiveBaseDetails.name,
      // Use safeGetNumber with null as default for height/weight if they can be absent
      height: safeGetNumber(stats.height ?? effectiveBaseDetails.height, null),
      weight: safeGetNumber(stats.weight ?? effectiveBaseDetails.weight, null),
      // Use safeGetNumber with 0 as default for numeric stats
      base_experience: isCustom
        ? safeGetNumber(stats.base_experience, 0) // Default to 0 for custom base exp
        : safeGetNumber(
            stats.modified_base_experience ??
              effectiveBaseDetails.base_experience,
            0,
          ), // Default to 0 for derived/base exp
      wins: safeGetNumber(stats.wins, 0),
      losses: safeGetNumber(stats.losses, 0),
      isCustom: isCustom,
      // Keep original base experience from API if not custom and available
      api_base_experience:
        !isCustom && effectiveBaseDetails.base_experience !== undefined
          ? effectiveBaseDetails.base_experience
          : undefined,
      types: effectiveBaseDetails.types || [],
      abilities: effectiveBaseDetails.abilities || [],
      stats: effectiveBaseDetails.stats || {},
    };
    // Clean up undefined api_base_experience
    if (combined.api_base_experience === undefined) {
      delete combined.api_base_experience;
    }
    return combined;
  }

  if (isCustom && Object.keys(stats).length > 0) {
    console.warn(
      `[combinePokemonData] Brak danych bazowych dla customowego Pokemona ${pokemonIdStr}. Używanie tylko userStats.`,
    );
    return {
      id: pokemonIdNum,
      image: getPokemonImageUrl(pokemonIdNum),
      name: stats.name || `Pokemon #${pokemonIdStr}`,
      height: safeGetNumber(stats.height, null),
      weight: safeGetNumber(stats.weight, null),
      base_experience: safeGetNumber(stats.base_experience, 0),
      wins: safeGetNumber(stats.wins, 0),
      losses: safeGetNumber(stats.losses, 0),
      isCustom: true,
      types: stats.types || [], // Attempt to get types from stats if available
      abilities: stats.abilities || [], // Attempt to get abilities from stats if available
      stats: stats.stats || {},
    };
  }

  console.error(
    `[combinePokemonData] Nie można połączyć danych dla Pokemona ${pokemonIdStr}. ` +
      `Dane bazowe (baseDetails): ${baseDetails === null ? "null" : typeof baseDetails}. ` +
      `Statystyki użytkownika (userStat): ${userStat === null ? "null" : typeof userStat}. ` +
      `isCustom: ${isCustom}.`,
  );
  return null;
};
