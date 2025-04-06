import apiClient from './apiClient';

// --- Authentication --- //

export const loginUser = async ({ email, password }) => {
    try {
        const response = await apiClient.get(`/users?email=${encodeURIComponent(email)}`);
        const users = response.data;
        if (users.length === 0) {
            throw new Error("Użytkownik o podanym emailu nie istnieje.");
        }
        const user = users[0];
        if (user.password !== password) {
            throw new Error("Nieprawidłowe hasło.");
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        console.error("Błąd logowania API:", error.response?.data || error.message);
        throw new Error(error.message || "Logowanie nie powiodło się. Spróbuj ponownie.");
    }
};

export const registerUser = async ({ name, email, password }) => {
    try {
        const checkResponse = await apiClient.get(`/users?email=${encodeURIComponent(email)}`);
        if (checkResponse.data.length > 0) {
            throw new Error("Użytkownik o podanym adresie email już istnieje.");
        }
        const newUser = {
            name,
            email,
            password,
            preferences: {
                theme: 'dark'
            },
            favoritePokemonIds: [],
            arenaPokemonIds: [],
            pokemonStats: {}
        };
        const registerResponse = await apiClient.post('/users', newUser);
        const { password: _, ...userWithoutPassword } = registerResponse.data;
        return userWithoutPassword;
    } catch (error) {
        console.error("Błąd rejestracji API:", error.response?.data || error.message);
        throw new Error(error.message || "Rejestracja nie powiodła się. Spróbuj ponownie.");
    }
};

// --- User Preferences & Data --- //

export const getUserData = async (userId) => {
    if (!userId) throw new Error("User ID is required.");
    try {
        const response = await apiClient.get(`/users/${userId}`);
        const { password: _, ...userData } = response.data;
        return userData;
    } catch (error) {
        console.error("Błąd pobierania danych użytkownika API:", error.response?.data || error.message);
        throw new Error("Nie udało się pobrać danych użytkownika.");
    }
};

export const updateUserPreferences = async (userId, preferences) => {
    if (!userId) throw new Error("User ID is required.");
    try {
        const response = await apiClient.patch(`/users/${userId}`, { preferences });
        const { password: _, ...userData } = response.data;
        return userData;
    } catch (error) {
        console.error("Błąd aktualizacji preferencji API:", error.response?.data || error.message);
        throw new Error("Nie udało się zaktualizować preferencji.");
    }
};

/**
 * Updates the user's favorite Pokemon list.
 * Ensures IDs are always sent as strings.
 */
export const updateUserFavorites = async (userId, favoritePokemonIds) => {
    if (!userId) throw new Error("User ID is required.");
    if (!Array.isArray(favoritePokemonIds)) throw new Error("favoritePokemonIds must be an array.");
    // Konwertuj wszystkie ID na stringi dla spójności
    const stringFavoritePokemonIds = favoritePokemonIds.map(id => String(id));
    try {
        const response = await apiClient.patch(`/users/${userId}`, { favoritePokemonIds: stringFavoritePokemonIds });
        const { password: _, ...userData } = response.data;
        return userData;
    } catch (error) {
        console.error("Błąd aktualizacji ulubionych API:", error.response?.data || error.message);
        throw new Error("Nie udało się zaktualizować listy ulubionych.");
    }
};

/**
 * Updates the user's Pokemon list for the Arena.
 */
export const updateUserArena = async (userId, arenaPokemonIds) => {
    if (!userId) throw new Error("User ID is required.");
    if (!Array.isArray(arenaPokemonIds)) throw new Error("arenaPokemonIds must be an array.");
    const stringArenaPokemonIds = arenaPokemonIds.map(id => String(id));
    if (stringArenaPokemonIds.length > 2) throw new Error("Arena can hold a maximum of 2 Pokemon.");
    try {
        const response = await apiClient.patch(`/users/${userId}`, { arenaPokemonIds: stringArenaPokemonIds });
        const { password: _, ...userData } = response.data;
        return userData;
    } catch (error) {
        console.error("Błąd aktualizacji Areny API:", error.response?.data || error.message);
        throw new Error("Nie udało się zaktualizować Pokemonów na Arenie.");
    }
};

/**
 * Updates the user's Pokemon stats after a fight.
 */
export const updatePokemonStats = async (userId, pokemonStats) => {
    if (!userId) throw new Error("User ID is required.");
    if (typeof pokemonStats !== 'object' || pokemonStats === null) throw new Error("pokemonStats must be an object.");
    try {
        const response = await apiClient.patch(`/users/${userId}`, { pokemonStats });
        const { password: _, ...userData } = response.data;
        return userData;
    } catch (error) {
        console.error("Błąd aktualizacji statystyk Pokemon API:", error.response?.data || error.message);
        throw new Error("Nie udało się zaktualizować statystyk Pokemonów.");
    }
};
