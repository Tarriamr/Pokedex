import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Współdzielony komponent Karty Pokemona
const PokemonCard = ({ pokemon, onClick, userStats }) => {
    const stats = userStats ? userStats[String(pokemon.id)] : null;
    const displayBaseExperience = stats?.modified_base_experience ?? pokemon.base_experience ?? 0;

    return (
        <div
            // Usunięto key={pokemon.id} - powinien być ustawiany w .map()
            className={clsx(
                "rounded-lg shadow-md p-4 transition-all duration-300 ease-in-out cursor-pointer relative",
                "bg-white border border-pokemon-gray-medium",
                "hover:border-pokemon-red hover:shadow-lg hover:scale-[1.03]",
                "dark:bg-gray-800 dark:border-gray-700",
                "dark:hover:border-pokemon-red dark:hover:shadow-lg",
                "flex flex-col items-center text-center",
                "box-border w-full min-h-80"
            )}
            onClick={() => onClick(pokemon.id)} // Przekazujemy ID do handlera
        >
            {stats && (stats.wins > 0 || stats.losses > 0) && (
                <div className={clsx(
                    "absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs z-10",
                    "bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
                )}>
                    W: {stats.wins} / L: {stats.losses}
                </div>
            )}

            <div className="flex flex-col items-center flex-grow mt-2">
                <img
                    // Używamy /src/... jako ścieżki bazowej dla zasobów statycznych w Vite
                    src={pokemon.image || '/src/assets/pokeball.svg'}
                    alt={pokemon.name}
                    className="w-32 h-32 object-contain mb-3"
                    loading="lazy"
                />
                <h2 className={clsx(
                    "text-lg font-semibold capitalize mb-2 transition-colors duration-300 ease-in-out",
                    "text-pokemon-gray-darker dark:text-pokemon-gray-light",
                    "flex items-center justify-center",
                    "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]",
                )}>{pokemon.name}</h2>
            </div>
            <div className={clsx(
                "text-xs w-full grid grid-cols-2 gap-x-2 transition-colors duration-300 ease-in-out",
                "text-pokemon-gray-dark dark:text-pokemon-gray-light",
                "mt-auto min-h-16 border-t border-pokemon-gray-medium dark:border-gray-700 pt-2"
            )}>
                <p><strong className="font-medium">Height:</strong> {pokemon.height}m</p>
                <p>
                    <strong className="font-medium">Exp:</strong> {displayBaseExperience}
                    {(stats?.modified_base_experience && stats.modified_base_experience !== pokemon.base_experience) &&
                        <span className="text-xs text-pokemon-green dark:text-pokemon-green-light ml-1">*</span>
                    }
                </p>
                <p><strong className="font-medium">Weight:</strong> {pokemon.weight}kg</p>
                <p><strong className="font-medium">Ability:</strong> {pokemon.abilities?.[0]?.ability?.name || 'N/A'}</p>
            </div>
        </div>
    );
};

PokemonCard.propTypes = {
    pokemon: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
        height: PropTypes.number,
        weight: PropTypes.number,
        base_experience: PropTypes.number,
        abilities: PropTypes.array,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    userStats: PropTypes.object,
};

export default PokemonCard;
