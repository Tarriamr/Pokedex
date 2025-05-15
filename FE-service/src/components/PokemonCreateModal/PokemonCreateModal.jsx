import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import BaseModal from "../../shared/BaseModal";
import FormInput from "../../shared/FormInput";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import apiClient from "../../services/api/apiClient";
import { POKEMON_API_LIMIT } from "../../config/constants";
import { getPokemonImageUrl } from "../../services/api/pokemon";
import usePokemonDetails from "../../hooks/usePokemonDetails.jsx";
import TypeBadge from "../../components/PokemonDetailsModal/TypeBadge";

const createPokemonSchema = z.object({
  name: z
    .string()
    .min(3, "Nazwa musi mieć co najmniej 3 znaki")
    .max(50, "Nazwa może mieć maksymalnie 50 znaków"),
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

const fetchPokemonListForGraphics = async (
  limit = 100,
  offset = POKEMON_API_LIMIT,
) => {
  try {
    const response = await apiClient.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
    );
    return response.data.results.map((p) => {
      const urlParts = p.url.split("/");
      const id = parseInt(urlParts[urlParts.length - 2], 10);
      return { id, name: p.name };
    });
  } catch (error) {
    console.error("Błąd podczas pobierania listy Pokémonów dla grafik:", error);
    throw error;
  }
};

// Extracted Graphics Selector Component
const GraphicsSelector = ({
  availableGraphics,
  selectedGraphicIndex,
  isGraphicUsed,
  isLoading,
  isError,
  onPrevious,
  onNext,
}) => {
  const selectedPokemonGraphic =
    availableGraphics[selectedGraphicIndex] || null;
  const graphicImageUrl = selectedPokemonGraphic
    ? getPokemonImageUrl(selectedPokemonGraphic.id)
    : "/src/assets/pokeball.svg";

  const {
    data: pokemonDetails,
    isLoading: isLoadingTypes,
    isError: isErrorTypes,
  } = usePokemonDetails(selectedPokemonGraphic?.id);

  const imageContainerSize = "w-48 h-48";
  const imageSize = "w-44 h-44";
  const skeletonSize = "w-48 h-48";
  const typeSectionHeight = "h-7";

  return (
    <div className="text-center mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Wybierz Grafikę
      </label>
      <div className="flex items-center justify-center space-x-4">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isLoading || availableGraphics.length === 0}
          className="p-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors disabled:opacity-50"
          aria-label="Poprzednia grafika"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        {isLoading && (
          <div
            className={clsx(
              skeletonSize,
              "border rounded bg-gray-300 dark:bg-gray-700 animate-pulse",
            )}
          ></div>
        )}
        {isError && (
          <div
            className={clsx(
              imageContainerSize,
              "border border-red-500 rounded flex items-center justify-center text-red-500",
            )}
          >
            Błąd
          </div>
        )}
        {!isLoading && !isError && (
          <div
            className={clsx(
              "relative border rounded flex items-center justify-center",
              imageContainerSize,
              isGraphicUsed
                ? "border-red-500 bg-red-100 dark:bg-red-900"
                : "border-gray-300 dark:border-gray-600",
            )}
          >
            <img
              src={graphicImageUrl}
              alt={selectedPokemonGraphic?.name || "Placeholder"}
              className={clsx(
                imageSize,
                "object-contain",
                isGraphicUsed && "opacity-50 grayscale",
              )}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/src/assets/pokeball.svg";
              }}
            />
            {isGraphicUsed && (
              <ExclamationCircleIcon
                className="absolute h-6 w-6 text-red-600 dark:text-red-400 top-1 right-1"
                title="Grafika już użyta"
              />
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={isLoading || availableGraphics.length === 0}
          className="p-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors disabled:opacity-50"
          aria-label="Następna grafika"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      <div
        className={clsx(
          "mt-2 flex justify-center items-center",
          typeSectionHeight,
        )}
      >
        {isGraphicUsed ? (
          <p className="text-xs text-red-600 dark:text-red-400">
            Ta grafika jest już używana.
          </p>
        ) : isLoadingTypes ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
            Ładowanie typów...
          </p>
        ) : isErrorTypes ? (
          <p className="text-xs text-red-500 dark:text-red-400">Błąd typów</p>
        ) : pokemonDetails?.types && pokemonDetails.types.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-1">
            {pokemonDetails.types.map((type) => (
              <TypeBadge key={type} type={type} size="xs" />
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">Brak typów</span>
        )}
      </div>
    </div>
  );
};

GraphicsSelector.propTypes = {
  availableGraphics: PropTypes.array.isRequired,
  selectedGraphicIndex: PropTypes.number.isRequired,
  isGraphicUsed: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

const PokemonCreateModal = ({ onClose, onSave, existingCustomIds = [] }) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    data: availableGraphicsData,
    isLoading: isLoadingGraphics,
    isError: isErrorGraphics,
  } = useQuery({
    queryKey: ["pokemonGraphicsList", POKEMON_API_LIMIT + 1],
    queryFn: () => fetchPokemonListForGraphics(100, POKEMON_API_LIMIT),
    staleTime: Infinity,
  });

  const [selectedGraphicIndex, setSelectedGraphicIndex] = useState(0);

  const availableGraphics = useMemo(
    () => availableGraphicsData || [],
    [availableGraphicsData],
  );
  const selectedPokemonGraphic =
    availableGraphics[selectedGraphicIndex] || null;
  const isGraphicUsed = selectedPokemonGraphic
    ? existingCustomIds.includes(selectedPokemonGraphic.id)
    : false;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createPokemonSchema),
    defaultValues: {
      name: "",
      height: 0.1,
      weight: 0.1,
      base_experience: 1,
    },
  });

  const goToNextGraphic = useCallback(() => {
    if (availableGraphics.length > 0) {
      setSelectedGraphicIndex(
        (prevIndex) => (prevIndex + 1) % availableGraphics.length,
      );
    }
  }, [availableGraphics.length]);

  const goToPreviousGraphic = useCallback(() => {
    if (availableGraphics.length > 0) {
      setSelectedGraphicIndex(
        (prevIndex) =>
          (prevIndex - 1 + availableGraphics.length) % availableGraphics.length,
      );
    }
  }, [availableGraphics.length]);

  useEffect(() => {
    setSelectedGraphicIndex(0);
  }, [availableGraphics]);

  const onSubmit = (data) => {
    if (!selectedPokemonGraphic) {
      enqueueSnackbar("Nie wybrano grafiki dla nowego Pokémona.", {
        variant: "error",
      });
      return;
    }
    if (isGraphicUsed) {
      enqueueSnackbar(
        "Wybrana grafika jest już używana przez innego Twojego Pokémona.",
        { variant: "warning" },
      );
      return;
    }
    const newPokemonData = {
      ...data,
      id: selectedPokemonGraphic.id,
    };
    onSave(newPokemonData);
  };

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
        form="create-pokemon-form"
        disabled={
          isSubmitting ||
          isLoadingGraphics ||
          !selectedPokemonGraphic ||
          isGraphicUsed
        }
        className={clsx(
          "px-4 py-2 rounded transition duration-150 ease-in-out",
          "bg-pokemon-green hover:bg-pokemon-green-dark text-white",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600",
        )}
      >
        {isSubmitting ? "Tworzenie..." : "Stwórz Pokémona"}
      </button>
    </>
  );

  return (
    <BaseModal
      onClose={onClose}
      title="Stwórz Nowego Pokémona"
      footerContent={footer}
      maxWidth="max-w-md"
    >
      <GraphicsSelector
        availableGraphics={availableGraphics}
        selectedGraphicIndex={selectedGraphicIndex}
        isGraphicUsed={isGraphicUsed}
        isLoading={isLoadingGraphics}
        isError={isErrorGraphics}
        onPrevious={goToPreviousGraphic}
        onNext={goToNextGraphic}
      />
      <form
        id="create-pokemon-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-4"
      >
        <div className="space-y-4">
          <FormInput
            label="Nazwa"
            id="name"
            name="name"
            type="text"
            register={register}
            error={errors.name}
            maxLength={50}
            inputClassName="px-3"
            required
          />
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

PokemonCreateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  existingCustomIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default PokemonCreateModal;
