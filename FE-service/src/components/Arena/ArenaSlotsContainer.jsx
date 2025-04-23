import React from 'react';
import PropTypes from 'prop-types';
import ArenaSlot from './ArenaSlot'; // Assuming ArenaSlot is moved to this directory

const ArenaSlotsContainer = ({
                                 pokemon1Data,
                                 pokemon2Data,
                                 fightResult,
                                 isFightInProgress,
                                 showResultDelayed,
                                 onRemovePokemon
                             }) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8 md:mb-12 w-full max-w-4xl">
            <ArenaSlot
                combinedPokemonData={pokemon1Data}
                fightResult={showResultDelayed ? fightResult : null}
                isFighting={isFightInProgress}
                showResultDelayed={showResultDelayed}
                onRemove={() => onRemovePokemon(pokemon1Data?.id)}
            />
            <div className="text-5xl font-extrabold text-white dark:text-gray-100 text-shadow-md mx-4 my-4 md:my-0 select-none">VS</div>
            <ArenaSlot
                combinedPokemonData={pokemon2Data}
                fightResult={showResultDelayed ? fightResult : null}
                isFighting={isFightInProgress}
                showResultDelayed={showResultDelayed}
                onRemove={() => onRemovePokemon(pokemon2Data?.id)}
            />
        </div>
    );
};

ArenaSlotsContainer.propTypes = {
    pokemon1Data: PropTypes.object, // Combined data for slot 1
    pokemon2Data: PropTypes.object, // Combined data for slot 2
    fightResult: PropTypes.object, // Fight result object
    isFightInProgress: PropTypes.bool.isRequired,
    showResultDelayed: PropTypes.bool.isRequired,
    onRemovePokemon: PropTypes.func.isRequired, // Callback when a Pokemon is removed
};

export default ArenaSlotsContainer;
