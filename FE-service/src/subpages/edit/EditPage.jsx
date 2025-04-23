import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import usePokemonList from "../../hooks/usePokemonList.jsx";
import { POKEMON_API_LIMIT } from "../../config/constants";
import PokemonEditModal from "../../components/PokemonEditModal/PokemonEditModal";
import PokemonCreateModal from "../../components/PokemonCreateModal/PokemonCreateModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUserPokemonStats,
  getPokemonImageUrl,
} from "../../services/api/pokemon";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { capitalizeWords } from "../../utils/stringUtils.js";

const EditPage = () => {
  const { currentUser } = useAuth();
  const {
    data: combinedPokemonList,
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
  } = usePokemonList(POKEMON_API_LIMIT, currentUser?.pokemonStats);

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPokemonForEdit, setSelectedPokemonForEdit] = useState(null);

  const sortedPokemonList = useMemo(() => {
    if (!combinedPokemonList) return [];
    // Ensure sorting is numeric by ID
    return [...combinedPokemonList].sort((a, b) => a.id - b.id);
  }, [combinedPokemonList]);

  // IDs of user's custom pokemon to prevent reusing their graphics
  const existingCustomIds = useMemo(() => {
    if (!currentUser?.pokemonStats) return [];
    return Object.keys(currentUser.pokemonStats)
      .filter((id) => currentUser.pokemonStats[id]?.isCustom)
      .map((id) => parseInt(id, 10));
  }, [currentUser?.pokemonStats]);

  const handleCloseModals = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedPokemonForEdit(null);
  };

  // Mutation for saving changes (Create or Edit)
  const mutation = useMutation({
    mutationFn: ({ pokemonId, newData }) =>
      updateUserPokemonStats(currentUser.id, pokemonId, newData),
    onSuccess: (updatedUserData, variables) => {
      queryClient.setQueryData(["user", currentUser.id], updatedUserData);
      queryClient.invalidateQueries({ queryKey: ["user", currentUser.id] });
      queryClient.invalidateQueries({ queryKey: ["pokemonList"] });

      const isCreating =
        variables.newData.isCustom === true &&
        !currentUser?.pokemonStats?.[variables.pokemonId];
      // Get the name for the message (from newData if creating, or existing data if editing)
      const rawPokemonName =
        variables.newData.name ||
        selectedPokemonForEdit?.name || // Use name from selected pokemon if editing
        sortedPokemonList?.find(
          (p) => String(p.id) === String(variables.pokemonId),
        )?.name ||
        `Pokemon #${variables.pokemonId}`;
      const pokemonName = capitalizeWords(rawPokemonName);

      const message = isCreating
        ? `Nowy pokemon ${pokemonName} został dodany!`
        : `Zmieniono atrybuty dla ${pokemonName}!`;

      enqueueSnackbar(message, { variant: "success" });
      handleCloseModals();
      navigate("/");
    },
    onError: (error) => {
      const errorMessage = `Błąd zapisu: ${error.message}`;
      console.error("Error during save:", error); // Keep error log
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });

  // --- Render Logic ---

  if (isLoadingList)
    return (
      <div className="p-4 text-center text-xl text-pokemon-blue dark:text-pokemon-blue-light">
        Ładowanie listy Pokémonów...
      </div>
    );
  if (isErrorList)
    return (
      <div className="p-4 text-center text-xl text-pokemon-red dark:text-red-400">
        Błąd ładowania listy: {errorList?.message}
      </div>
    );
  if (!currentUser)
    return (
      <div className="p-4 text-center">
        Musisz być zalogowany, aby edytować Pokémony.
      </div>
    );

  // --- Event Handlers ---

  const handleOpenEditModal = (pokemon) => {
    setSelectedPokemonForEdit(pokemon);
    setIsEditModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Handle saving edits from the edit modal (name is NOT editable)
  const handleSaveEdit = (pokemonId, formData) => {
    const originalPokemonData = sortedPokemonList?.find(
      (p) => String(p.id) === String(pokemonId),
    );
    const existingStats = currentUser?.pokemonStats?.[String(pokemonId)] || {};

    const isApiPokemon =
      !existingStats.isCustom && pokemonId <= POKEMON_API_LIMIT;

    // Get original numeric values, defaulting to safe values
    const originalExperience =
      Number(
        existingStats.modified_base_experience ??
          existingStats.base_experience ??
          originalPokemonData?.base_experience,
      ) || 1; // Min 1
    const originalHeight =
      Number(existingStats.height ?? originalPokemonData?.height) || 0.1; // Min 0.1
    const originalWeight =
      Number(existingStats.weight ?? originalPokemonData?.weight) || 0.1; // Min 0.1

    // Prepare the update payload
    const newData = {};
    const newHeight = parseFloat(formData.height);
    const newWeight = parseFloat(formData.weight);
    const newExperience = parseInt(formData.base_experience, 10);

    // Add fields to update only if they have changed
    if (newHeight !== originalHeight) newData.height = newHeight;
    if (newWeight !== originalWeight) newData.weight = newWeight;
    if (newExperience !== originalExperience) {
      if (isApiPokemon) {
        // For API Pokemon, update the modified experience
        newData.modified_base_experience = newExperience;
        // If base_experience exists in stats, remove it to avoid confusion
        if (existingStats.base_experience !== undefined) {
          newData.base_experience = null; // Explicitly nullify if we start using modified
        }
      } else {
        // For custom Pokemon, update the base experience directly
        newData.base_experience = newExperience;
        // Ensure modified_base_experience is not carried over if it exists
        if (existingStats.modified_base_experience !== undefined) {
          newData.modified_base_experience = null;
        }
      }
    }

    // If changes were made, trigger the mutation
    if (Object.keys(newData).length > 0) {
      // Preserve necessary existing flags/stats (name is preserved automatically as it's not in newData)
      newData.isCustom = existingStats.isCustom || !isApiPokemon;
      if (existingStats.wins !== undefined && newData.wins === undefined)
        newData.wins = existingStats.wins;
      if (existingStats.losses !== undefined && newData.losses === undefined)
        newData.losses = existingStats.losses;

      mutation.mutate({ pokemonId: String(pokemonId), newData });
    } else {
      enqueueSnackbar("Nie wprowadzono żadnych zmian.", { variant: "info" });
      handleCloseModals();
    }
  };

  // Handle saving a new custom Pokemon
  const handleSaveCreate = (formData) => {
    const { id: basePokemonId, ...restData } = formData; // ID comes from selected graphic
    const capitalizedName = capitalizeWords(restData.name);

    // Data to save in user's pokemonStats
    const newData = {
      name: capitalizedName,
      isCustom: true,
      height: parseFloat(restData.height),
      weight: parseFloat(restData.weight),
      base_experience: parseInt(restData.base_experience, 10),
      wins: 0,
      losses: 0,
    };

    mutation.mutate({ pokemonId: String(basePokemonId), newData });
  };

  // --- JSX ---
  return (
    <div className="p-4 container mx-auto flex flex-col h-full">
      {/* Header with Title and Create Button */}
      <div className="relative mb-6 mt-4 flex flex-col items-center md:text-center">
        <h1 className="text-3xl font-bold text-pokemon-blue-dark dark:text-pokemon-blue-light inline-block mb-4 md:mb-0">
          Pokémon Edycja
        </h1>
        <button
          onClick={handleOpenCreateModal}
          className={clsx(
            "px-4 py-2 bg-pokemon-green hover:bg-pokemon-green-dark text-white rounded shadow hover:shadow-md transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pokemon-yellow",
            "md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2",
          )}
        >
          Stwórz pokemona
        </button>
      </div>

      {/* Pokemon List Table - Changed max-w-3xl to max-w-2xl */}
      <div
        className={clsx(
          "flex-grow overflow-hidden shadow rounded-lg border border-pokemon-gray-medium dark:border-gray-700",
          "mx-auto", // Center the table container
          "w-full max-w-2xl", // Limit table width for better readability
        )}
      >
        <div className="h-full overflow-y-auto relative">
          <table className="min-w-full border-collapse">
            <thead className="bg-pokemon-gray-light dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3 text-right text-xs font-medium text-pokemon-gray-dark dark:text-gray-300 uppercase tracking-wider w-10"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-pokemon-gray-dark dark:text-gray-300 uppercase tracking-wider"
                >
                  Pokémon
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-medium text-pokemon-gray-dark dark:text-gray-300 uppercase tracking-wider w-24"
                >
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-pokemon-gray-medium dark:divide-gray-600">
              {sortedPokemonList.map((pokemon, index) => (
                <tr
                  key={pokemon.id}
                  className="hover:bg-pokemon-gray-light/30 dark:hover:bg-pokemon-gray-darker/50 transition-colors duration-150 ease-in-out"
                >
                  {/* Wyświetlanie indexu + 1 jako numeracji */}
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-pokemon-gray-dark dark:text-gray-400 text-right align-middle">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-pokemon-gray-darker dark:text-gray-200 capitalize text-left align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={getPokemonImageUrl(pokemon.id)}
                        alt={capitalizeWords(pokemon.name)}
                        className="h-10 w-10 object-contain flex-shrink-0"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/src/assets/pokeball.svg";
                        }}
                      />
                      <span>{capitalizeWords(pokemon.name)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-center align-middle">
                    <button
                      onClick={() => handleOpenEditModal(pokemon)}
                      className="text-pokemon-blue hover:text-pokemon-blue-dark dark:text-pokemon-blue-light dark:hover:text-pokemon-blue font-medium transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pokemon-blue"
                      aria-label={`Edytuj ${capitalizeWords(pokemon.name)}`}
                    >
                      Edytuj
                    </button>
                  </td>
                </tr>
              ))}
              {sortedPokemonList.length === 0 && !isLoadingList && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-3 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    Brak Pokémonów do wyświetlenia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals rendered conditionally */}
      {isEditModalOpen && selectedPokemonForEdit && (
        <PokemonEditModal
          pokemon={selectedPokemonForEdit}
          onClose={handleCloseModals}
          onSave={handleSaveEdit}
        />
      )}
      {isCreateModalOpen && (
        <PokemonCreateModal
          onClose={handleCloseModals}
          onSave={handleSaveCreate}
          existingCustomIds={existingCustomIds}
        />
      )}
    </div>
  );
};

export default EditPage;
