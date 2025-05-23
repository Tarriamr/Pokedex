import React, { useMemo, useState } from "react";
import clsx from "clsx";
import usePokemonList from "../../hooks/usePokemonList.jsx";
import { usePagination } from "../../hooks/usePagination.js";
import SearchBar from "../../shared/SearchBar";
import PokemonDetailsModal from "../../components/PokemonDetailsModal/PokemonDetailsModal.jsx";
import PokemonGrid from "../../components/PokemonGrid/PokemonGrid.jsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../context/AuthContext";
import { POKEMON_API_LIMIT, POKEMONS_PER_PAGE } from "../../config/constants";

const PokemonList = () => {
  const { currentUser } = useAuth();
  const {
    data: allPokemon,
    isLoading,
    isError,
    error,
  } = usePokemonList(POKEMON_API_LIMIT, currentUser?.pokemonStats);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);

  const filteredPokemon = useMemo(() => {
    if (!allPokemon) return [];
    if (!searchQuery) return allPokemon;
    return allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allPokemon, searchQuery]);

  const {
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setCurrentPage,
    startIndex,
    endIndex,
  } = usePagination(filteredPokemon.length, POKEMONS_PER_PAGE);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCardClick = (id) => {
    setSelectedPokemonId(id);
  };

  const closeModal = () => {
    setSelectedPokemonId(null);
  };

  const currentPokemonPage = useMemo(() => {
    if (!Array.isArray(filteredPokemon)) return [];
    return filteredPokemon.slice(startIndex, endIndex);
  }, [filteredPokemon, startIndex, endIndex]);

  if (isError) {
    return (
      <div className="text-center p-10 text-xl text-pokemon-red dark:text-red-400 transition-colors duration-300 ease-in-out">
        Wystąpił błąd podczas pobierania Pokemonów:{" "}
        {error?.message || "Wystąpił nieznany błąd."}
      </div>
    );
  }

  return (
    <div className="p-4">
      <SearchBar onSearch={handleSearch} />

      <PokemonGrid
        pokemons={currentPokemonPage}
        onCardClick={handleCardClick}
        userStats={currentUser?.pokemonStats}
        isLoading={isLoading}
        loadingMessage="Ładowanie Pokemonów..."
        emptyMessage={
          searchQuery
            ? "Nie znaleziono Pokemonów pasujących do wyszukiwania."
            : "Brak Pokemonów do wyświetlenia."
        }
      />

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-3">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={styles.paginationButton}
            aria-label="Poprzednia strona"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <span className={styles.paginationPages}>
            {currentPage}&nbsp;/&nbsp;{totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
            aria-label="Następna strona"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      {selectedPokemonId !== null && (
        <PokemonDetailsModal
          pokemonId={selectedPokemonId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default PokemonList;

const styles = {
  paginationButton: clsx(
    "p-2 rounded-full shadow-md transition-all duration-150 ease-in-out",
    "outline-none focus:outline-none focus:ring-2 focus:ring-pokemon-yellow focus:ring-opacity-50",
    "bg-pokemon-yellow hover:bg-pokemon-yellow-dark text-pokemon-blue-dark",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-pokemon-gray-medium disabled:text-pokemon-gray-dark",
    "active:scale-95 active:brightness-90",
  ),
  paginationPages: clsx(
    "text-lg font-bold transition-colors duration-300 ease-in-out",
    "text-pokemon-gray-darker dark:text-pokemon-gray-light",
    "min-w-[5ch] text-center",
  ),
};
