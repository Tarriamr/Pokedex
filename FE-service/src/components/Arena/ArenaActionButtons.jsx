import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { LogOut, Swords } from "lucide-react";

const ArenaActionButtons = ({
  canFight,
  isFightInProgress,
  isMutatingStats,
  showLeaveButton,
  isLeavingArena,
  onFight,
  onLeave,
}) => {
  // Determine if the fight button should be potentially visible
  const shouldShowFightButton =
    canFight && !isFightInProgress && !isMutatingStats;

  return (
    <div className="mb-4 h-16 flex items-center justify-center">
      {/* --- Leave Button --- */}
      {showLeaveButton && (
        <button
          onClick={onLeave}
          disabled={isLeavingArena}
          className={clsx(
            "px-8 py-4 text-xl font-bold rounded-lg shadow-lg transition-all duration-200 ease-in-out",
            "flex items-center gap-2",
            isLeavingArena
              ? "bg-gray-500 text-white dark:text-gray-300 cursor-not-allowed opacity-70"
              : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
          )}
        >
          {isLeavingArena ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Opuszczanie...
            </>
          ) : (
            <>
              <LogOut className="h-6 w-6" />
              Opuść arenę
            </>
          )}
        </button>
      )}

      {/* --- Fighting State Indicator --- */}
      {!showLeaveButton && isFightInProgress && (
        <button
          disabled={true}
          className={clsx(
            "px-8 py-4 text-xl font-bold rounded-lg shadow-lg",
            "flex items-center gap-2 bg-yellow-600 text-white dark:text-yellow-100 opacity-80 cursor-wait",
          )}
        >
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Walka trwa...
        </button>
      )}

      {/* --- Fight Button --- */}
      {!showLeaveButton && shouldShowFightButton && (
        <button
          onClick={onFight}
          disabled={!canFight}
          className={clsx(
            "px-8 py-4 text-xl font-bold rounded-lg shadow-lg transition-all duration-200 ease-in-out",
            "flex items-center gap-2",
            !canFight
              ? "bg-gray-500 text-white dark:text-gray-300 cursor-not-allowed opacity-70"
              : "bg-red-600 text-white hover:bg-red-700 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 animate-pulse-slow",
          )}
        >
          <Swords className="h-6 w-6" /> WALCZ!
        </button>
      )}
    </div>
  );
};

ArenaActionButtons.propTypes = {
  canFight: PropTypes.bool.isRequired,
  isFightInProgress: PropTypes.bool.isRequired,
  isMutatingStats: PropTypes.bool.isRequired,
  showLeaveButton: PropTypes.bool.isRequired,
  isLeavingArena: PropTypes.bool.isRequired,
  onFight: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
};

export default ArenaActionButtons;
