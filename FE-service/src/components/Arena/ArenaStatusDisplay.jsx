import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// This component now ONLY handles the full overlay states (Loading, Error)
const ArenaStatusDisplay = ({ isLoading, errorMessage }) => {

    // 1. Overall Loading State
    if (isLoading) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 dark:bg-opacity-80 z-40">
                <div className="text-white dark:text-gray-200 text-2xl font-bold animate-pulse">Ładowanie danych...</div>
            </div>
        );
    }

    // 2. Error State
    if (errorMessage) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-80 dark:bg-opacity-90 z-30">
                <div className="text-white dark:text-red-100 text-xl font-bold text-center p-4">
                    {errorMessage} <br/> Spróbuj odświeżyć stronę.
                </div>
            </div>
        );
    }

    // Return null if no overlay is needed
    return null;
};

ArenaStatusDisplay.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string, // Error message string or null
    // Removed fightResultMessage and displayFightingState from props
};

export default ArenaStatusDisplay;
