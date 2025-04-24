import React, { useMemo } from "react";
import PropTypes from "prop-types";
import BaseModal from "../../shared/BaseModal";
import usePokemonDetails from "../../hooks/usePokemonDetails.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFavoriteManagement } from "../../hooks/useFavoriteManagement.js";
import { useArenaManagement } from "../../hooks/useArenaManagement.js";
import ModalActionButtons from "./ModalActionButtons.jsx";
import PokemonModalHeader from "./PokemonModalHeader.jsx";
import PokemonModalBody from "./PokemonModalBody.jsx";

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

  const headerActionsContent = useMemo(() => {
    if (!isLoggedIn || !pokemonDetails) return null;
    return (
      <ModalActionButtons
        isFavorite={isFavorite}
        isOnArena={isOnArena}
        canAddToArena={canAddToArena}
        toggleFavorite={toggleFavorite}
        toggleArena={toggleArena}
        isUpdatingFavorite={isUpdatingFavorite}
        isUpdatingArena={isUpdatingArena}
      />
    );
  }, [
    isLoggedIn,
    pokemonDetails,
    isFavorite,
    isOnArena,
    canAddToArena,
    toggleFavorite,
    toggleArena,
    isUpdatingFavorite,
    isUpdatingArena,
  ]);

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

    return (
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
      headerActions={headerActionsContent}
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
