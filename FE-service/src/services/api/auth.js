import apiClient from "./apiClient";
// Import the shared helper function
import { _sanitizeUserData } from "./apiUtils.js";

// Helper function removed from here

// --- Authentication --- //

export const loginUser = async ({ email, password }) => {
  try {
    const response = await apiClient.get(
      `/users?email=${encodeURIComponent(email)}`,
    );
    const users = response.data;
    if (users.length === 0) {
      throw new Error("Użytkownik o podanym emailu nie istnieje.");
    }
    const user = users[0];
    // WARNING: Plain text password comparison - ONLY for demo/mock API!
    if (user.password !== password) {
      throw new Error("Nieprawidłowe hasło.");
    }
    return _sanitizeUserData(user);
  } catch (error) {
    throw new Error(
      error?.message || "Logowanie nie powiodło się. Spróbuj ponownie.",
    );
  }
};

export const registerUser = async ({ name, email, password }) => {
  try {
    const checkResponse = await apiClient.get(
      `/users?email=${encodeURIComponent(email)}`,
    );
    if (checkResponse.data.length > 0) {
      throw new Error("Email already exists"); // Specific error for the form
    }
    const newUser = {
      name,
      email,
      password, // WARNING: Storing plain text password - ONLY for demo/mock API!
      preferences: {
        theme: "dark", // Default theme
      },
      favoritePokemonIds: [],
      arenaPokemonIds: [],
      pokemonStats: {},
    };
    const registerResponse = await apiClient.post("/users", newUser);
    return _sanitizeUserData(registerResponse.data);
  } catch (error) {
    throw new Error(
      error?.message || "Rejestracja nie powiodła się. Spróbuj ponownie.",
    );
  }
};

// --- User Data --- //

export const getUserData = async (userId) => {
  if (!userId) throw new Error("Wymagane ID użytkownika.");
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return _sanitizeUserData(response.data);
  } catch (error) {
    throw new Error(
      error?.message || "Nie udało się pobrać danych użytkownika.",
    );
  }
};

// --- User Updates --- //

export const updateUserPreferences = async (userId, preferences) => {
  if (!userId) throw new Error("Wymagane ID użytkownika.");
  try {
    const response = await apiClient.patch(`/users/${userId}`, { preferences });
    return _sanitizeUserData(response.data);
  } catch (error) {
    throw new Error(
      error?.message || "Nie udało się zaktualizować preferencji.",
    );
  }
};

export const updateUserFavorites = async (userId, favoritePokemonIds) => {
  if (!userId) throw new Error("Wymagane ID użytkownika.");
  if (!Array.isArray(favoritePokemonIds))
    throw new Error("favoritePokemonIds musi być tablicą.");
  const stringFavoritePokemonIds = favoritePokemonIds.map((id) => String(id));
  try {
    const response = await apiClient.patch(`/users/${userId}`, {
      favoritePokemonIds: stringFavoritePokemonIds,
    });
    return _sanitizeUserData(response.data);
  } catch (error) {
    throw new Error(
      error?.message || "Nie udało się zaktualizować listy ulubionych.",
    );
  }
};
