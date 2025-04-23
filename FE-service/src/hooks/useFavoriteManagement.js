import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useAuth } from "../context/AuthContext.jsx";
import { updateUserFavorites } from "../services/api/auth.js";

export const useFavoriteManagement = (pokemonId) => {
  const { isLoggedIn, currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const pokemonIdStr = useMemo(
    () => (pokemonId ? String(pokemonId) : null),
    [pokemonId],
  );

  const mutation = useMutation({
    mutationFn: ({ userId, updatedFavorites }) =>
      updateUserFavorites(userId, updatedFavorites),
    onSuccess: (updatedUserData) => {
      queryClient.setQueryData(["user", currentUser?.id], updatedUserData);
      // Removed success notification
      // enqueueSnackbar('Lista ulubionych zaktualizowana!', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(`Błąd aktualizacji ulubionych: ${error.message}`, {
        variant: "error",
      });
    },
  });

  const isFavorite = useMemo(() => {
    if (!isLoggedIn || !currentUser?.favoritePokemonIds || !pokemonIdStr) {
      return false;
    }
    return currentUser.favoritePokemonIds.map(String).includes(pokemonIdStr);
  }, [isLoggedIn, currentUser?.favoritePokemonIds, pokemonIdStr]);

  const toggleFavorite = () => {
    if (!isLoggedIn || !currentUser || !pokemonIdStr || mutation.isPending) {
      return;
    }

    const currentFavorites = currentUser.favoritePokemonIds?.map(String) || [];
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = currentFavorites.filter((id) => id !== pokemonIdStr);
    } else {
      if (!currentFavorites.includes(pokemonIdStr)) {
        updatedFavorites = [...currentFavorites, pokemonIdStr];
      } else {
        updatedFavorites = currentFavorites;
      }
    }
    mutation.mutate({ userId: currentUser.id, updatedFavorites });
  };

  return {
    isFavorite,
    toggleFavorite,
    isUpdatingFavorite: mutation.isPending,
  };
};
