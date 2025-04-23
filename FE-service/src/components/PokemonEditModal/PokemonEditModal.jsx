import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import clsx from "clsx";
import BaseModal from "../../shared/BaseModal"; // Import BaseModal
import FormInput from "../../shared/FormInput";
import { capitalizeWords } from "../../utils/stringUtils";
import { getPokemonImageUrl } from "../../services/api/pokemon";

const editPokemonSchema = z.object({
  height: z
    .number({ invalid_type_error: "Wysokość musi być liczbą" })
    .gt(0, "Wysokość musi być większa od zera")
    .min(0.1, "Minimalna wysokość to 0.1"),
  weight: z
    .number({ invalid_type_error: "Waga musi być liczbą" })
    .gt(0, "Waga musi być większa od zera")
    .min(0.1, "Minimalna waga to 0.1"),
  base_experience: z
    .number({ invalid_type_error: "Doświadczenie musi być liczbą" })
    .int("Doświadczenie musi być liczbą całkowitą")
    .min(1, "Minimalne doświadczenie to 1"),
});

const PokemonEditModal = ({ pokemon, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editPokemonSchema),
    defaultValues: {
      height: Number(pokemon.height) || 0.1,
      weight: Number(pokemon.weight) || 0.1,
      base_experience: Math.max(1, Number(pokemon.base_experience) || 1),
    },
  });

  const onSubmit = (data) => {
    onSave(pokemon.id, data);
  };

  const imageUrl = getPokemonImageUrl(pokemon.id);
  const title = `Edytuj ${capitalizeWords(pokemon.name)}`;

  // Define footer content with action buttons
  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className={clsx(
          "px-4 py-2 rounded transition duration-150 ease-in-out",
          "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        Anuluj
      </button>
      <button
        type="submit"
        form="edit-pokemon-form"
        disabled={isSubmitting}
        className={clsx(
          "px-4 py-2 rounded transition duration-150 ease-in-out",
          "bg-pokemon-yellow hover:bg-pokemon-yellow-dark text-pokemon-blue-dark",
          "disabled:opacity-50 disabled:cursor-wait",
        )}
      >
        {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
      </button>
    </>
  );

  return (
    <BaseModal
      onClose={onClose}
      title={title} // Title remains in the header
      footerContent={footer}
      maxWidth="max-w-md"
    >
      {/* Pokemon Image added here, inside children */}
      <div className="flex justify-center mb-4">
        <img
          src={imageUrl}
          alt={capitalizeWords(pokemon.name)}
          // Changed size to h-48 w-48 (192px)
          className="h-48 w-48 object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/src/assets/pokeball.svg";
          }}
        />
      </div>

      {/* Form as the rest of the children */}
      <form id="edit-pokemon-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">
          <FormInput
            label="Wysokość (m)"
            id="height"
            name="height"
            type="number"
            step="0.1"
            register={(name) => register(name, { valueAsNumber: true })}
            error={errors.height}
            inputClassName="px-3"
            min="0.1"
            required
          />
          <FormInput
            label="Waga (kg)"
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            register={(name) => register(name, { valueAsNumber: true })}
            error={errors.weight}
            inputClassName="px-3"
            min="0.1"
            required
          />
          <FormInput
            label="Doświadczenie (Exp)"
            id="base_experience"
            name="base_experience"
            type="number"
            register={(name) => register(name, { valueAsNumber: true })}
            error={errors.base_experience}
            inputClassName="px-3"
            min="1"
            required
          />
        </div>
      </form>
    </BaseModal>
  );
};

PokemonEditModal.propTypes = {
  pokemon: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    height: PropTypes.number,
    weight: PropTypes.number,
    base_experience: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default PokemonEditModal;
