import {useMemo} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useSnackbar} from 'notistack';
import {useAuth} from '../context/AuthContext.jsx';
import {updateUserArena} from '../services/api/auth.js';
import {MAX_ARENA_POKEMONS} from '../config/constants'; // Import stałej

export const useArenaManagement = (pokemonId) => {
    const {isLoggedIn, currentUser} = useAuth();
    const queryClient = useQueryClient();
    const {enqueueSnackbar} = useSnackbar();
    const pokemonIdStr = useMemo(() => pokemonId ? String(pokemonId) : null, [pokemonId]);

    const mutation = useMutation({
        mutationFn: ({userId, updatedArena}) => updateUserArena(userId, updatedArena),
        onSuccess: (updatedUserData) => {
            queryClient.setQueryData(['user', currentUser?.id], updatedUserData);
            enqueueSnackbar('Arena zaktualizowana!', {variant: 'success'});
        },
        onError: (error) => {
            enqueueSnackbar(`Błąd aktualizacji Areny: ${error.message}`, {variant: 'error'});
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
        // Użycie zaimportowanej stałej
        return currentArenaIds.length >= MAX_ARENA_POKEMONS;
    }, [currentArenaIds]);

    const canAddToArena = useMemo(() => {
        return isLoggedIn && !isOnArena && !isArenaFull;
    }, [isLoggedIn, isOnArena, isArenaFull]);

    const toggleArena = () => {
        if (!isLoggedIn || !currentUser || !pokemonIdStr || mutation.isPending) {
            console.warn("Cannot toggle arena: Not logged in, no user data, no pokemon ID, or mutation pending.");
            return;
        }

        let updatedArena;

        if (isOnArena) {
            updatedArena = currentArenaIds.filter(id => id !== pokemonIdStr);
            mutation.mutate({userId: currentUser.id, updatedArena});
        } else {
            if (isArenaFull) {
                // Użycie zaimportowanej stałej w komunikacie
                enqueueSnackbar(`Arena jest pełna (max ${MAX_ARENA_POKEMONS} Pokemony)`, {variant: 'warning'});
                return;
            }
            if (!currentArenaIds.includes(pokemonIdStr)) {
                updatedArena = [...currentArenaIds, pokemonIdStr];
                mutation.mutate({userId: currentUser.id, updatedArena});
            } else {
                console.warn("Attempted to add Pokemon already on arena.");
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
