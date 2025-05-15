import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { updateUserPokemonStats } from "../services/api/pokemon.js";
import { useAuth } from "../context/AuthContext.jsx";
import { safeGetNumber } from "../utils/numberUtils.js";

const calculateFightScore = (pokemon, userStats) => {
  if (!pokemon) return 0;
  const experience =
    userStats?.modified_base_experience ??
    userStats?.base_experience ??
    pokemon.base_experience;
  const weight = userStats?.weight ?? pokemon.weight;

  const numExperience = safeGetNumber(experience);
  const numWeight = safeGetNumber(weight);

  if (numWeight === 0) return 0;

  return numExperience * numWeight;
};

export const usePokemonFight = (pokemon1, pokemon2) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const [fightResult, setFightResult] = useState(null);
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);

  const updateSinglePokemonStats = useMutation({
    mutationFn: ({ pokemonId, statsToUpdate }) => {
      if (!currentUser) throw new Error("Użytkownik nie jest zalogowany");
      return updateUserPokemonStats(currentUser.id, pokemonId, statsToUpdate);
    },
    onError: (error, variables) => {
      console.error(
        `Error updating stats for Pokemon ID: ${variables.pokemonId}:`,
        error,
      );
      const errorMsg =
        error.response?.data?.message || error.message || "Unknown error";
      enqueueSnackbar(
        `Błąd aktualizacji statystyk dla ${variables.pokemonId}: ${errorMsg}`,
        { variant: "error" },
      );
    },
  });

  const performFight = async () => {
    if (isUpdatingStats) {
      enqueueSnackbar("Aktualizacja statystyk jest już w toku.", {
        variant: "info",
      });
      return;
    }
    if (!pokemon1?.id || !pokemon2?.id || !currentUser?.id) {
      enqueueSnackbar(
        "Nie można rozpocząć walki: Brak ID Pokémonów lub ID użytkownika.",
        { variant: "warning" },
      );
      return;
    }

    setIsUpdatingStats(true);
    setFightResult(null);

    const userData = queryClient.getQueryData(["user", currentUser.id]);
    if (!userData) {
      enqueueSnackbar("Błąd: Nie znaleziono danych użytkownika w cache.", {
        variant: "error",
      });
      setIsUpdatingStats(false);
      return;
    }
    const userStats = userData.pokemonStats || {};

    const pokemon1Id = String(pokemon1.id);
    const pokemon2Id = String(pokemon2.id);

    const pokemon1Stats = { wins: 0, losses: 0, ...userStats[pokemon1Id] };
    const pokemon2Stats = { wins: 0, losses: 0, ...userStats[pokemon2Id] };

    const pokemon1Score = calculateFightScore(pokemon1, pokemon1Stats);
    const pokemon2Score = calculateFightScore(pokemon2, pokemon2Stats);

    let result = { winner: null, loser: null, draw: false };
    let mutation1Payload = null;
    let mutation2Payload = null;

    const pokemon1EffectiveExp = safeGetNumber(
      pokemon1Stats.modified_base_experience ??
        pokemon1Stats.base_experience ??
        pokemon1.base_experience,
    );
    const pokemon2EffectiveExp = safeGetNumber(
      pokemon2Stats.modified_base_experience ??
        pokemon2Stats.base_experience ??
        pokemon2.base_experience,
    );

    const isPokemon1Custom = pokemon1?.isCustom === true;
    const isPokemon2Custom = pokemon2?.isCustom === true;

    if (pokemon1Score > pokemon2Score) {
      result = { winner: pokemon1, loser: pokemon2, draw: false };
      const winnerUpdate = {
        wins: safeGetNumber(pokemon1Stats.wins) + 1,
        ...(isPokemon1Custom
          ? { base_experience: pokemon1EffectiveExp + 10 }
          : { modified_base_experience: pokemon1EffectiveExp + 10 }),
      };
      const loserUpdate = { losses: safeGetNumber(pokemon2Stats.losses) + 1 };
      mutation1Payload = { pokemonId: pokemon1Id, statsToUpdate: winnerUpdate };
      mutation2Payload = { pokemonId: pokemon2Id, statsToUpdate: loserUpdate };
    } else if (pokemon2Score > pokemon1Score) {
      result = { winner: pokemon2, loser: pokemon1, draw: false };
      const winnerUpdate = {
        wins: safeGetNumber(pokemon2Stats.wins) + 1,
        ...(isPokemon2Custom
          ? { base_experience: pokemon2EffectiveExp + 10 }
          : { modified_base_experience: pokemon2EffectiveExp + 10 }),
      };
      const loserUpdate = { losses: safeGetNumber(pokemon1Stats.losses) + 1 };
      mutation1Payload = { pokemonId: pokemon1Id, statsToUpdate: loserUpdate };
      mutation2Payload = { pokemonId: pokemon2Id, statsToUpdate: winnerUpdate };
    } else {
      result = { winner: null, loser: null, draw: true };
    }

    setFightResult(result);

    if (mutation1Payload && mutation2Payload) {
      let finalUserData = null;
      try {
        const updatedUserData1 =
          await updateSinglePokemonStats.mutateAsync(mutation1Payload);
        if (updatedUserData1) {
          queryClient.setQueryData(["user", currentUser?.id], updatedUserData1);
        }

        const updatedUserData2 =
          await updateSinglePokemonStats.mutateAsync(mutation2Payload);
        if (updatedUserData2) {
          queryClient.setQueryData(["user", currentUser?.id], updatedUserData2);
          finalUserData = updatedUserData2;
        }

        if (finalUserData) {
          queryClient.invalidateQueries({ queryKey: ["user", currentUser.id] });
        } else {
          console.warn(
            "Final user data after mutations is missing, consider refetching or checking API response.",
          );
          queryClient.invalidateQueries({ queryKey: ["user", currentUser.id] });
        }
      } catch (error) {
        console.error("Error during sequential stat updates:", error);
      } finally {
        setIsUpdatingStats(false);
      }
    } else {
      setIsUpdatingStats(false);
    }
  };

  const resetFightResult = () => {
    setFightResult(null);
  };

  return {
    performFight,
    fightResult,
    isFighting: isUpdatingStats,
    resetFightResult,
  };
};
