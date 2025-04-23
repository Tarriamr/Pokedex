import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx"; // Import clsx for conditional classes

// Komponent dla sekcji body w modalu
const PokemonModalBody = ({ pokemonDetails }) => {
  if (!pokemonDetails) return null;

  // Dane do wyświetlenia (biorąc pod uwagę modyfikacje z hooka)
  const displayHeight = pokemonDetails.height;
  const displayWeight = pokemonDetails.weight;
  const displayBaseExperience = pokemonDetails.base_experience;
  const firstAbilityName = pokemonDetails.abilities?.[0]?.ability?.name;

  // Helper do formatowania nazw (np. usuwanie myślników w nazwach umiejętności)
  const formatName = (name) => {
    return name ? name.replace("-", " ") : "N/A";
  };

  return (
    // Używamy siatki 2x2 dla wszystkich atrybutów
    <div
      className={clsx(
        "grid grid-cols-2 gap-x-4 gap-y-2", // Siatka 2x2 z odstępami
        "text-sm text-pokemon-gray-darker dark:text-pokemon-gray-light",
      )}
    >
      {/* Height */}
      <p>
        <strong className="font-semibold">Height:</strong>
        {displayHeight != null ? ` ${displayHeight.toFixed(1)} m` : " N/A"}
        {/* Gwiazdka usunięta */}
      </p>

      {/* Weight */}
      <p>
        <strong className="font-semibold">Weight:</strong>
        {displayWeight != null ? ` ${displayWeight.toFixed(1)} kg` : " N/A"}
        {/* Gwiazdka usunięta */}
      </p>

      {/* Base experience */}
      <p>
        <strong className="font-semibold">Base experience:</strong>
        {displayBaseExperience != null ? ` ${displayBaseExperience}` : " N/A"}
        {/* Gwiazdka i info o bazowym już usunięte wcześniej */}
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
    // Pola API do porównania (nie są już wyświetlane jako gwiazdki)
    api_height: PropTypes.number,
    api_weight: PropTypes.number,
    api_base_experience: PropTypes.number,
  }),
};

export default PokemonModalBody;
