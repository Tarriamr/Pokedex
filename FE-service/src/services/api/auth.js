import apiClient from './apiClient';

// Helper function to remove password from user data
const _sanitizeUserData = (user) => {
    if (!user) return null;
    // eslint-disable-next-line no-unused-vars
    const {password, ...userData} = user;
    return userData;
};

// --- Authentication --- //

export const loginUser = async ({email, password}) => {
    try {
        const response = await apiClient.get(`/users?email=${encodeURIComponent(email)}`);
        const users = response.data;
        if (users.length === 0) {
            throw new Error("Użytkownik o podanym emailu nie istnieje.");
        }
        const user = users[0];
        // WARNING: Plain text password comparison - ONLY for demo/mock API
        if (user.password !== password) {
            throw new Error("Nieprawidłowe hasło.");
        }
        return _sanitizeUserData(user);
    } catch (error) {
        // Używamy oryginalnego komunikatu błędu, jeśli istnieje
        throw new Error(error?.message || "Logowanie nie powiodło się. Spróbuj ponownie.");
    }
};

export const registerUser = async ({name, email, password}) => {
    try {
        const checkResponse = await apiClient.get(`/users?email=${encodeURIComponent(email)}`);
        if (checkResponse.data.length > 0) {
            throw new Error("Email already exists"); // Specyficzny błąd dla formularza
        }
        const newUser = {
            name,
            email,
            password, // WARNING: Storing plain text password - ONLY for demo/mock API
            preferences: {
                theme: 'dark'
            },
            favoritePokemonIds: [],
            arenaPokemonIds: [],
            pokemonStats: {}
        };
        const registerResponse = await apiClient.post('/users', newUser);
        return _sanitizeUserData(registerResponse.data);
    } catch (error) {
        // Używamy oryginalnego komunikatu błędu, jeśli istnieje (w tym "Email already exists")
        throw new Error(error?.message || "Rejestracja nie powiodła się. Spróbuj ponownie.");
    }
};

// --- User Preferences & Data --- //

export const getUserData = async (userId) => {
    if (!userId) throw new Error("User ID is required.");
    try {
        const response = await apiClient.get(`/users/${userId}`);
        return _sanitizeUserData(response.data);
    } catch (error) {
        // Używamy oryginalnego komunikatu błędu, jeśli istnieje
        throw new Error(error?.message || "Nie udało się pobrać danych użytkownika.");
    }
};

export const updateUserPreferences = async (userId, preferences) => {
    if (!userId) throw new Error("User ID is required.");
    try {
        const response = await apiClient.patch(`/users/${userId}`, {preferences});
        return _sanitizeUserData(response.data);
    } catch (error) {
        // Używamy oryginalnego komunikatu błędu, jeśli istnieje
        throw new Error(error?.message || "Nie udało się zaktualizować preferencji.");
    }
};

export const updateUserFavorites = async (userId, favoritePokemonIds) => {
    if (!userId) throw new Error("User ID is required.");
    if (!Array.isArray(favoritePokemonIds)) throw new Error("favoritePokemonIds must be an array.");
    const stringFavoritePokemonIds = favoritePokemonIds.map(id => String(id));
    try {
        const response = await apiClient.patch(`/users/${userId}`, {favoritePokemonIds: stringFavoritePokemonIds});
        return _sanitizeUserData(response.data);
    } catch (error) {
        // Używamy oryginalnego komunikatu błędu, jeśli istnieje
        throw new Error(error?.message || "Nie udało się zaktualizować listy ulubionych.");
    }
};

export const updateUserArena = async (userId, arenaPokemonIds) => {
    if (!userId) throw new Error("User ID is required.");
    if (!Array.isArray(arenaPokemonIds)) throw new Error("arenaPokemonIds must be an array.");
    const stringArenaPokemonIds = arenaPokemonIds.map(id => String(id));
    if (stringArenaPokemonIds.length > 2) throw new Error("Arena can hold a maximum of 2 Pokemon.");
    try {
        const response = await apiClient.patch(`/users/${userId}`, {arenaPokemonIds: stringArenaPokemonIds});
        return _sanitizeUserData(response.data);
    } catch (error) {
        // Używamy oryginalnego komunikatu błędu, jeśli istnieje
        throw new Error(error?.message || "Nie udało się zaktualizować Pokemonów na Arenie.");
    }
};

export const updatePokemonStats = async (userId, pokemonStats) => {
    if (!userId) throw new Error("User ID is required.");
    if (typeof pokemonStats !== 'object' || pokemonStats === null) throw new Error("pokemonStats must be an object.");
    try {
        const response = await apiClient.patch(`/users/${userId}`, {pokemonStats});
        return _sanitizeUserData(response.data);
    } catch (error) {
        // Używamy oryginalnego komunikatu błędu, jeśli istnieje
        throw new Error(error?.message || "Nie udało się zaktualizować statystyk Pokemonów.");
    }
};
