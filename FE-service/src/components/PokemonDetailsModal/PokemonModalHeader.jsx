import React from "react";
import PropTypes from "prop-types";
import TypeBadge from "./TypeBadge";
import { getPokemonImageUrl } from "../../services/api/pokemon";

// component for the header section in Modal (image, name, types)
const PokemonModalHeader = ({ pokemonDetails }) => {
  if (!pokemonDetails) return null;

  // Generate URL of the picture dynamically
  const imageUrl = getPokemonImageUrl(pokemonDetails.id);

  return (
    <div className="text-center pt-8 mt-6 mb-5 border-b border-pokemon-gray-medium dark:border-pokemon-gray-dark pb-4">
      <img
        src={imageUrl}
        alt={pokemonDetails.name}
        className="w-48 h-48 mx-auto mb-3"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/src/assets/pokeball.svg";
        }}
      />
      <h2
        className="text-3xl font-bold text-pokemon-gray-darker dark:text-pokemon-gray-light capitalize"
        id="pokemon-modal-title"
      >
        {pokemonDetails.name}
      </h2>
      <div className="flex justify-center flex-wrap gap-2 mt-2">
        {pokemonDetails.types?.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
    </div>
  );
};

PokemonModalHeader.propTypes = {
  pokemonDetails: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default PokemonModalHeader;
