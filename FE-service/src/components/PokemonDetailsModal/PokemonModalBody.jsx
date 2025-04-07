import React from 'react';
import PropTypes from 'prop-types';

// Komponent dla sekcji body w modalu (Info, Umiejętności, Statystyki)
const PokemonModalBody = ({pokemonDetails, userPokemonStats}) => {
    if (!pokemonDetails) return null;

    const displayBaseExperience = userPokemonStats?.modified_base_experience ?? pokemonDetails.base_experience;

    // Helper do formatowania nazw statystyk
    const formatStatName = (statName) => {
        return statName.replace('-', ' ');
    };

    return (
        <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-pokemon-gray-darker dark:text-pokemon-gray-light">
            {/* Kolumna Info */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold mb-1 border-b border-pokemon-gray-medium dark:border-pokemon-gray-dark pb-1">Informacje</h3>
                <p><strong>Wzrost:</strong> {pokemonDetails.height != null ? `${pokemonDetails.height} m` : 'N/A'}</p>
                <p><strong>Waga:</strong> {pokemonDetails.weight != null ? `${pokemonDetails.weight} kg` : 'N/A'}</p>
                <p><strong>Dośw. bazowe:</strong> {displayBaseExperience ?? 'N/A'}
                    {userPokemonStats?.modified_base_experience !== undefined &&
                        userPokemonStats.modified_base_experience !== pokemonDetails.base_experience && (
                            <span
                                className="text-xs text-pokemon-green dark:text-pokemon-green-light ml-1">(Zmodyfikowane)</span>
                        )}
                </p>
            </div>

            {/* Kolumna Umiejętności */}
            <div className="space-y-1">
                <h3 className="text-lg font-semibold mb-1 border-b border-pokemon-gray-medium dark:border-pokemon-gray-dark pb-1">Umiejętności</h3>
                {pokemonDetails.abilities?.length > 0 ? (
                    <ul className="list-disc list-inside pl-1">
                        {pokemonDetails.abilities.map(abilityInfo => (
                            <li key={abilityInfo.ability.name} className="capitalize">
                                {formatStatName(abilityInfo.ability.name)}
                                {abilityInfo.is_hidden && <span
                                    className="text-xs text-pokemon-blue-dark dark:text-pokemon-blue-light ml-1">(ukryta)</span>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Brak informacji o umiejętnościach.</p>
                )}
            </div>

            {/* Sekcja Statystyki (pełna szerokość) */}
            <div className="md:col-span-2 space-y-1 mt-2">
                <h3 className="text-lg font-semibold mb-1 border-b border-pokemon-gray-medium dark:border-pokemon-gray-dark pb-1">Statystyki
                    Bazowe</h3>
                {pokemonDetails.stats && Object.keys(pokemonDetails.stats).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                        {Object.entries(pokemonDetails.stats).map(([statName, baseStat]) => (
                            <div key={statName} className="flex justify-between capitalize">
                                <span>{formatStatName(statName)}:</span>
                                <strong>{baseStat ?? 'N/A'}</strong>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Brak informacji o statystykach.</p>
                )}
            </div>
        </div>
    );
};

PokemonModalBody.propTypes = {
    pokemonDetails: PropTypes.shape({
        height: PropTypes.number,
        weight: PropTypes.number,
        base_experience: PropTypes.number,
        abilities: PropTypes.arrayOf(PropTypes.shape({
            ability: PropTypes.shape({name: PropTypes.string.isRequired}).isRequired,
            is_hidden: PropTypes.bool.isRequired,
        })),
        stats: PropTypes.objectOf(PropTypes.number),
    }),
    userPokemonStats: PropTypes.shape({
        modified_base_experience: PropTypes.number,
        wins: PropTypes.number,
        losses: PropTypes.number,
    }),
};

export default PokemonModalBody;
