import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { getPokemonImageUrl } from "../../services/api/pokemon.js";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { capitalizeWords } from "../../utils/stringUtils.js";
import pokeballFallback from "../../assets/pokeball.svg";

// Simplified ArenaSlot component, responsible only for displaying the slot.
// Removal logic is handled by the parent (ArenaPage).
const ArenaSlot = ({
  combinedPokemonData,
  fightResult,
  isFighting,
  showResultDelayed,
  onRemove,
}) => {
  // --- Render Empty Slot ---
  if (!combinedPokemonData) {
    return (
      <div className="w-64 h-80 bg-black bg-opacity-40 dark:bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white text-shadow-sm p-4 border-2 border-dashed border-gray-500 dark:border-gray-400 relative">
        <p className="text-xl font-semibold">Wybierz Pokemona</p>
        <p className="text-sm text-gray-300 dark:text-gray-400">
          (Z widoku szczegółów)
        </p>
      </div>
    );
  }

  // --- Prepare Data for Filled Slot ---
  const { id, name, base_experience, weight, wins, losses, types } =
    combinedPokemonData;
  const imageUrl = getPokemonImageUrl(id);

  // --- Determine Visual Styles based on Fight State ---
  let imageFilterClass = "";
  let winnerShadowClass = "";

  if (showResultDelayed && fightResult) {
    const isWinner =
      !fightResult.draw && String(fightResult.winner?.id) === String(id);
    const isLoser =
      !fightResult.draw && String(fightResult.loser?.id) === String(id);
    if (isWinner) {
      const primaryType = types?.[0]?.toLowerCase();
      winnerShadowClass = primaryType
        ? `shadow-pokemon-type-${primaryType}`
        : "shadow-pokemon-gray-light";
    } else if (isLoser) {
      imageFilterClass = "grayscale";
    }
  }

  // --- Render Filled Slot ---
  return (
    <div
      className={clsx(
        "w-64 h-80 bg-black rounded-lg flex flex-col items-center p-4 relative border-2 transition-all duration-500 ease-in-out",
        "bg-opacity-60 dark:bg-opacity-70",
        "border-gray-600 dark:border-gray-400",
        winnerShadowClass, // Apply dynamic shadow class
      )}
    >
      {/* Remove Button - visible only when not fighting/showing results */}
      {!isFighting && !showResultDelayed && (
        <button
          onClick={onRemove} // Call the passed handler directly
          // Parent will handle the disabled state based on its mutation status
          className="absolute top-2 right-2 p-1 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 rounded-full disabled:opacity-50 transition-colors z-10"
          title="Usuń z Areny"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}

      {/* Wins/Losses Indicator */}
      {(wins > 0 || losses > 0) && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 dark:bg-opacity-80 text-white text-xs font-semibold px-2 py-1 rounded z-10">
          W: {wins} / L: {losses}
        </div>
      )}

      {/* Pokemon Image */}
      <img
        src={imageUrl}
        alt={name}
        className={clsx(
          "w-40 h-40 object-contain mt-4 mb-2 transition-all duration-500 ease-in-out",
          imageFilterClass, // Apply dynamic filter class
        )}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = pokeballFallback;
        }}
      />

      {/* Pokemon Name */}
      <h3 className="text-xl font-bold capitalize text-white dark:text-gray-100 text-shadow-sm mb-2 text-center break-words">
        {capitalizeWords(name)}
      </h3>

      {/* Stats */}
      <p className="text-sm text-gray-200 dark:text-gray-300">
        Aktualne Dośw.: {base_experience}
      </p>
      <p className="text-sm text-gray-200 dark:text-gray-300 mt-1">
        Waga: {weight != null ? `${weight.toFixed(1)} kg` : "N/A"}
      </p>
    </div>
  );
};

ArenaSlot.propTypes = {
  combinedPokemonData: PropTypes.object,
  fightResult: PropTypes.object, // Can be null
  isFighting: PropTypes.bool.isRequired,
  showResultDelayed: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired, // Callback when remove button is clicked
};

export default ArenaSlot;
