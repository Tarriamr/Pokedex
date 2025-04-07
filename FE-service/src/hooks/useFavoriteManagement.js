import {useMemo} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useSnackbar} from 'notistack';
import {useAuth} from '../context/AuthContext.jsx';
import {updateUserFavorites} from '../services/api/auth.js';

export const useFavoriteManagement = (pokemonId) => {
    const {isLoggedIn, currentUser} = useAuth();
    const queryClient = useQueryClient();
    const {enqueueSnackbar} = useSnackbar();
    const pokemonIdStr = useMemo(() => pokemonId ? String(pokemonId) : null, [pokemonId]);

    const mutation = useMutation({
        mutationFn: ({userId, updatedFavorites}) => updateUserFavorites(userId, updatedFavorites),
        onSuccess: (updatedUserData) => {
            // Update the user data in the cache optimistically
            queryClient.setQueryData(['user', currentUser?.id], updatedUserData);
            enqueueSnackbar('Lista ulubionych zaktualizowana!', {variant: 'success'});
            // Optionally invalidate to ensure data freshness elsewhere, though setQueryData is often enough
            // queryClient.invalidateQueries({ queryKey: ['user', currentUser?.id] });
        },
        onError: (error) => {
            enqueueSnackbar(`Błąd aktualizacji ulubionych: ${error.message}`, {variant: 'error'});
        },
    });

    const isFavorite = useMemo(() => {
        if (!isLoggedIn || !currentUser?.favoritePokemonIds || !pokemonIdStr) {
            return false;
        }
        // Ensure comparison uses strings
        return currentUser.favoritePokemonIds.map(String).includes(pokemonIdStr);
    }, [isLoggedIn, currentUser?.favoritePokemonIds, pokemonIdStr]);

    const toggleFavorite = () => {
        if (!isLoggedIn || !currentUser || !pokemonIdStr || mutation.isPending) {
            console.warn("Cannot toggle favorite: Not logged in, no user data, no pokemon ID, or mutation pending.");
            return;
        }

        const currentFavorites = currentUser.favoritePokemonIds?.map(String) || [];
        let updatedFavorites;

        if (isFavorite) {
            updatedFavorites = currentFavorites.filter(id => id !== pokemonIdStr);
        } else {
            // Add only if not already present (safety check)
            if (!currentFavorites.includes(pokemonIdStr)) {
                updatedFavorites = [...currentFavorites, pokemonIdStr];
            } else {
                updatedFavorites = currentFavorites; // Should not happen if isFavorite logic is correct
            }
        }
        mutation.mutate({userId: currentUser.id, updatedFavorites});
    };

    return {
        isFavorite,
        toggleFavorite,
        isUpdatingFavorite: mutation.isPending,
    };
};
