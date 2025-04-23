import React, { useMemo } from "react";
import PropTypes from "prop-types";

// Import BaseModal and other necessary components/hooks
import BaseModal from "../../shared/BaseModal";
import usePokemonDetails from "../../hooks/usePokemonDetails.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFavoriteManagement } from "../../hooks/useFavoriteManagement.js";
import { useArenaManagement } from "../../hooks/useArenaManagement.js";
import ModalActionButtons from "./ModalActionButtons.jsx";
import PokemonModalHeader from "./PokemonModalHeader.jsx"; // Keep original header
import PokemonModalBody from "./PokemonModalBody.jsx";
import { getPokemonImageUrl } from "../../services/api/pokemon";
import { capitalizeWords } from "../../utils/stringUtils";

const PokemonDetailsModal = ({ pokemonId, onClose }) => {
  const pokemonIdStr = useMemo(
    () => (pokemonId ? String(pokemonId) : null),
    [pokemonId],
  );
  const { isLoggedIn } = useAuth();
  const {
    data: pokemonDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
    error: errorDetails,
  } = usePokemonDetails(pokemonIdStr);

  const { isFavorite, toggleFavorite, isUpdatingFavorite } =
    useFavoriteManagement(pokemonIdStr);
  const { isOnArena, canAddToArena, toggleArena, isUpdatingArena } =
    useArenaManagement(pokemonIdStr);

  // --- Prepare props for BaseModal ---

  // Prepare headerActions JSX conditionally
  const headerActionsContent = useMemo(() => {
    if (!isLoggedIn || !pokemonDetails) return null; // Only show if logged in and details are loaded
    return (
      <ModalActionButtons
        isFavorite={isFavorite}
        isOnArena={isOnArena}
        canAddToArena={canAddToArena}
        toggleFavorite={toggleFavorite}
        toggleArena={toggleArena}
        isUpdatingFavorite={isUpdatingFavorite}
        isUpdatingArena={isUpdatingArena}
        // No absolute positioning needed here, BaseModal handles placement
      />
    );
  }, [
    isLoggedIn,
    pokemonDetails, // Ensure buttons appear only after details load
    isFavorite,
    isOnArena,
    canAddToArena,
    toggleFavorite,
    toggleArena,
    isUpdatingFavorite,
    isUpdatingArena,
  ]);

  // Render main content (header + body) for the modal children
  const renderModalContent = () => {
    if (isLoadingDetails) {
      return (
        <div className="text-center p-10 text-pokemon-blue-dark dark:text-pokemon-blue-light">
          Ładowanie szczegółów...
        </div>
      );
    }
    if (isErrorDetails || !pokemonDetails) {
      return (
        <div className="text-center p-10 text-pokemon-red-dark dark:text-pokemon-red">
          <p>
            {isErrorDetails
              ? `Wystąpił błąd: ${errorDetails?.message || "Nieznany błąd."}`
              : "Brak danych dla tego Pokemona."}
          </p>
        </div>
      );
    }

    // Successfully loaded data
    return (
      // Action buttons are now passed as headerActions, not rendered here
      <>
        <PokemonModalHeader pokemonDetails={pokemonDetails} />
        <PokemonModalBody pokemonDetails={pokemonDetails} />
      </>
    );
  };

  // --- Render BaseModal ---
  return (
    <BaseModal
      onClose={onClose}
      // No title or imageUrl needed - handled by PokemonModalHeader inside children
      headerActions={headerActionsContent} // Pass the action buttons here
      maxWidth="max-w-lg"
    >
      {renderModalContent()}
    </BaseModal>
  );
};

PokemonDetailsModal.propTypes = {
  pokemonId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func.isRequired,
};

export default PokemonDetailsModal;
