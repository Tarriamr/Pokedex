import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { getPokemonImageUrl } from "../../services/api/pokemon";

const PokemonCard = ({ pokemon, onClick, userStats }) => {
  const pokemonIdStr = String(pokemon.id);
  const stats = userStats ? userStats[pokemonIdStr] : null;

  const displayBaseExperience =
    stats?.modified_base_experience ??
    stats?.base_experience ??
    pokemon.base_experience ??
    0;
  const displayHeight = stats?.height ?? pokemon.height ?? 0;
  const displayWeight = stats?.weight ?? pokemon.weight ?? 0;

  const imageUrl = getPokemonImageUrl(pokemon.id);

  return (
    <div
      className={clsx(
        "rounded-lg shadow-md p-4 transition-all duration-300 ease-in-out cursor-pointer relative",
        "bg-white border border-pokemon-gray-medium",
        "hover:border-pokemon-red hover:shadow-lg hover:scale-[1.03]",
        "dark:bg-gray-800 dark:border-gray-700",
        "dark:hover:border-pokemon-red dark:hover:shadow-lg",
        "flex flex-col items-center text-center",
        "box-border w-full min-h-72",
      )}
      onClick={() => onClick(pokemon.id)}
    >
      {stats && (stats.wins > 0 || stats.losses > 0) && (
        <div
          className={clsx(
            "absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs z-10",
            "bg-gray-800 text-white dark:bg-gray-200 dark:text-black",
          )}
        >
          W: {stats.wins} / L: {stats.losses}
        </div>
      )}

      <div className="flex flex-col items-center flex-grow mt-2">
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="w-32 h-32 object-contain"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/src/assets/pokeball.svg";
          }}
        />
        <h2
          className={clsx(
            "text-lg font-semibold capitalize mb-2 transition-colors duration-300 ease-in-out",
            "text-pokemon-gray-darker dark:text-pokemon-gray-light",
            "flex items-center justify-center",
            "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]",
          )}
        >
          {pokemon.name}
        </h2>
      </div>

      <div
        className={clsx(
          "w-full grid grid-cols-2 gap-x-2 gap-y-2 transition-colors duration-300 ease-in-out",
          "text-pokemon-gray-dark dark:text-pokemon-gray-light",
          "mt-auto border-t border-pokemon-gray-medium dark:border-gray-700",
        )}
      >
        <div className="text-center">
          <span className="text-[11px]">
            {displayHeight != null ? `${displayHeight.toFixed(1)}m` : "N/A"}
          </span>
          <strong className="block font-bold text-xs">Height</strong>
        </div>

        <div className="text-center">
          <span className="text-[11px]">{displayBaseExperience ?? "N/A"}</span>
          <strong className="block font-bold text-xs">Base experience</strong>
        </div>

        <div className="text-center">
          <span className="text-[11px]">
            {displayWeight != null ? `${displayWeight.toFixed(1)}kg` : "N/A"}
          </span>
          <strong className="block font-bold text-xs">Weight</strong>
        </div>

        <div className="text-center">
          <span className="capitalize text-[11px]">
            {pokemon.abilities?.[0]?.ability?.name || "N/A"}
          </span>
          <strong className="block font-bold text-xs">Ability</strong>
        </div>
      </div>
    </div>
  );
};

PokemonCard.propTypes = {
  pokemon: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    height: PropTypes.number,
    weight: PropTypes.number,
    base_experience: PropTypes.number,
    abilities: PropTypes.array,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  userStats: PropTypes.object,
};

export default PokemonCard;
