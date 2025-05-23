import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useAuth } from "../context/AuthContext.jsx";
import { updateUserArena } from "../services/api/pokemon.js";
import { MAX_ARENA_POKEMONS } from "../config/constants";

export const useArenaManagement = (pokemonId) => {
  const { isLoggedIn, currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const pokemonIdStr = useMemo(
    () => (pokemonId ? String(pokemonId) : null),
    [pokemonId],
  );

  const mutation = useMutation({
    mutationFn: ({ userId, updatedArena }) =>
      updateUserArena(userId, updatedArena),
    onSuccess: (updatedUserData) => {
      queryClient.setQueryData(["user", currentUser?.id], updatedUserData);
      queryClient.invalidateQueries({ queryKey: ["user", currentUser?.id] });
    },
    onError: (error) => {
      enqueueSnackbar(`Błąd aktualizacji Areny: ${error.message}`, {
        variant: "error",
      });
    },
  });

  const currentArenaIds = useMemo(() => {
    return currentUser?.arenaPokemonIds?.map(String) || [];
  }, [currentUser?.arenaPokemonIds]);

  const isOnArena = useMemo(() => {
    if (!isLoggedIn || !pokemonIdStr) return false;
    return currentArenaIds.includes(pokemonIdStr);
  }, [isLoggedIn, currentArenaIds, pokemonIdStr]);

  const isArenaFull = useMemo(() => {
    return currentArenaIds.length >= MAX_ARENA_POKEMONS;
  }, [currentArenaIds]);

  const canAddToArena = useMemo(() => {
    return isLoggedIn && !isOnArena && !isArenaFull;
  }, [isLoggedIn, isOnArena, isArenaFull]);

  const toggleArena = () => {
    if (!isLoggedIn || !currentUser || !pokemonIdStr || mutation.isPending) {
      return;
    }

    let updatedArena;

    if (isOnArena) {
      console.warn(
        "Attempted to toggle OFF arena from details modal, but only ADD is implemented here.",
      );
      return;
    } else {
      if (isArenaFull) {
        enqueueSnackbar(
          `Arena jest pełna (max ${MAX_ARENA_POKEMONS} Pokemony)`,
          { variant: "warning" },
        );
        return;
      }
      if (!currentArenaIds.includes(pokemonIdStr)) {
        updatedArena = [...currentArenaIds, pokemonIdStr];
        mutation.mutate({ userId: currentUser.id, updatedArena });
      }
    }
  };

  return {
    isOnArena,
    isArenaFull,
    canAddToArena,
    toggleArena,
    isUpdatingArena: mutation.isPending,
  };
};
