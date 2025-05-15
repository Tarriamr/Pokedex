import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { Swords } from "lucide-react";

// Component for buttons in Modal (Favorite, Arena)
const ModalActionButtons = ({
  isFavorite,
  isOnArena,
  canAddToArena,
  toggleFavorite,
  toggleArena,
  isUpdatingFavorite,
  isUpdatingArena,
}) => {
  return (
    <>
      {/* Favorite button */}
      <button
        onClick={toggleFavorite}
        disabled={isUpdatingFavorite}
        className={clsx(
          "p-1 rounded-full transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-pokemon-red focus:ring-opacity-50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "text-pokemon-red",
          !isUpdatingFavorite &&
            "hover:text-pokemon-gray-darker dark:hover:text-pokemon-gray-light",
        )}
        aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
        title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      >
        {isFavorite ? (
          <HeartIcon className="h-6 w-6" />
        ) : (
          <HeartIconOutline className="h-6 w-6" />
        )}
      </button>

      {/* Arena button */}
      <button
        onClick={toggleArena}
        disabled={isUpdatingArena || (!isOnArena && !canAddToArena)}
        className={clsx(
          "p-1 rounded-full transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:ring-opacity-50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isOnArena
            ? "text-pokemon-blue-dark dark:text-pokemon-blue-light"
            : "text-pokemon-gray-dark dark:text-pokemon-gray-light",
          !isUpdatingArena &&
            canAddToArena &&
            "hover:text-pokemon-blue-darker dark:hover:text-pokemon-blue",
        )}
        aria-label={
          isOnArena
            ? "Usuń z Areny"
            : canAddToArena
              ? "Dodaj do Areny"
              : "Arena pełna"
        }
        title={
          isOnArena
            ? "Usuń z Areny"
            : canAddToArena
              ? "Dodaj do Areny"
              : "Arena pełna"
        }
      >
        <Swords className="h-6 w-6" strokeWidth={isOnArena ? 2.5 : 2} />
      </button>
    </>
  );
};

ModalActionButtons.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  isOnArena: PropTypes.bool.isRequired,
  canAddToArena: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  toggleArena: PropTypes.func.isRequired,
  isUpdatingFavorite: PropTypes.bool.isRequired,
  isUpdatingArena: PropTypes.bool.isRequired,
};

export default ModalActionButtons;
