import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

// Component for the Body Section in Modal
const PokemonModalBody = ({ pokemonDetails }) => {
  if (!pokemonDetails) return null;

  // data to be displayed (taking into account Hook modifications)
  const displayHeight = pokemonDetails.height;
  const displayWeight = pokemonDetails.weight;
  const displayBaseExperience = pokemonDetails.base_experience;
  const firstAbilityName = pokemonDetails.abilities?.[0]?.ability?.name;

  // Helper for formatting names (e.g. removal of duties in skill names)
  const formatName = (name) => {
    return name ? name.replace("-", " ") : "N/A";
  };

  return (
    <div
      className={clsx(
        "grid grid-cols-2 gap-x-4 gap-y-2",
        "text-sm text-pokemon-gray-darker dark:text-pokemon-gray-light",
      )}
    >
      {/* Height */}
      <p>
        <strong className="font-semibold">Height:</strong>
        {displayHeight != null ? ` ${displayHeight.toFixed(1)} m` : " N/A"}
      </p>
      {/* Weight */}
      <p>
        <strong className="font-semibold">Weight:</strong>
        {displayWeight != null ? ` ${displayWeight.toFixed(1)} kg` : " N/A"}
      </p>
      {/* Base experience */}
      <p>
        <strong className="font-semibold">Base experience:</strong>
        {displayBaseExperience != null ? ` ${displayBaseExperience}` : " N/A"}
      </p>
      {/* Ability */}
      <p>
        <strong className="font-semibold">Ability:</strong>
        <span className="capitalize"> {formatName(firstAbilityName)}</span>
      </p>
    </div>
  );
};

PokemonModalBody.propTypes = {
  pokemonDetails: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.number,
    weight: PropTypes.number,
    base_experience: PropTypes.number,
    abilities: PropTypes.arrayOf(
      PropTypes.shape({
        ability: PropTypes.shape({ name: PropTypes.string.isRequired })
          .isRequired,
        is_hidden: PropTypes.bool.isRequired,
      }),
    ),
    api_height: PropTypes.number,
    api_weight: PropTypes.number,
    api_base_experience: PropTypes.number,
  }),
};

export default PokemonModalBody;
