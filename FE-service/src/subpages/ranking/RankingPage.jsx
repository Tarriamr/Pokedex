import React, { useCallback, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import usePokemonList from "../../hooks/usePokemonList.jsx";
import { POKEMON_API_LIMIT } from "../../config/constants";
import clsx from "clsx";
import TypeBadge from "../../components/PokemonDetailsModal/TypeBadge";
import SortableHeaderCell from "../../components/Ranking/SortableHeaderCell";
import { getPokemonImageUrl } from "../../services/api/pokemon";
import { capitalizeWords } from "../../utils/stringUtils.js";

const statOptions = {
  wins: { label: "Wygrane", key: "wins" },
  base_experience: { label: "Dośw.", key: "base_experience" },
  weight: { label: "Waga", key: "weight", unit: " kg" },
  height: { label: "Wzrost", key: "height", unit: " m" },
};

const RankingPage = () => {
  const { currentUser } = useAuth();
  const {
    data: combinedPokemonData,
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
  } = usePokemonList(POKEMON_API_LIMIT, currentUser?.pokemonStats);

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [displayedStat, setDisplayedStat] = useState("wins");

  const sortedRankedPokemons = useMemo(() => {
    if (!combinedPokemonData) return [];
    const dataToSort = [...combinedPokemonData];
    dataToSort.sort((a, b) => {
      let comparison = 0;
      let valA, valB;
      if (sortBy === "name") {
        valA = a.name;
        valB = b.name;
      } else {
        valA = sortBy === "id" ? parseInt(a.id, 10) : a[sortBy];
        valB = sortBy === "id" ? parseInt(b.id, 10) : b[sortBy];
      }

      if (sortBy === "name") {
        comparison = String(valA).localeCompare(String(valB), "pl", {
          sensitivity: "base",
        });
      } else if (sortBy === "id") {
        comparison = valA - valB;
      } else {
        const numA = Number(valA) || 0;
        const numB = Number(valB) || 0;
        comparison = numA - numB;
      }

      return sortOrder === "desc" ? comparison * -1 : comparison;
    });
    return dataToSort;
  }, [combinedPokemonData, sortBy, sortOrder]);

  const handleSort = useCallback(
    (columnKey) => {
      if (statOptions[columnKey]) {
        setDisplayedStat(columnKey);
      }

      if (sortBy === columnKey) {
        setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
      } else {
        setSortBy(columnKey);
        setSortOrder(
          columnKey === "id" || columnKey === "name" ? "asc" : "desc",
        );
      }
    },
    [sortBy],
  );

  const handleDisplayedStatChange = useCallback(
    (event) => {
      const newStatKey = event.target.value;
      if (statOptions[newStatKey]) {
        setDisplayedStat(newStatKey);
        if (sortBy !== newStatKey) {
          setSortBy(newStatKey);
          setSortOrder("desc");
        }
      }
    },
    [sortBy],
  );

  if (isLoadingList) {
    return (
      <div className="text-center p-10 text-xl text-pokemon-blue dark:text-pokemon-blue-light">
        Ładowanie rankingu...
      </div>
    );
  }
  if (isErrorList) {
    return (
      <div className="text-center p-10 text-xl text-pokemon-red dark:text-red-400">
        Wystąpił błąd: {errorList?.message || "Nieznany błąd."}
      </div>
    );
  }
  if (!combinedPokemonData || combinedPokemonData.length === 0) {
    return (
      <div className="p-4 h-full flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-center text-pokemon-blue-dark dark:text-pokemon-blue-light flex-shrink-0">
          Ranking Pokémon
        </h1>
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center text-pokemon-gray-dark dark:text-pokemon-gray-light">
            Brak danych Pokémonów do wyświetlenia.
          </p>
        </div>
      </div>
    );
  }

  // Helper function to format stat values for display
  const formatStatValue = (pokemon, statKey) => {
    const value = pokemon[statKey] ?? 0;
    if (statKey === "weight" || statKey === "height") {
      return `${value.toFixed(1)}${statOptions[statKey]?.unit || ""}`;
    }
    return value;
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center text-pokemon-blue-dark dark:text-pokemon-blue-light flex-shrink-0">
        Ranking Pokémon
      </h1>

      {/* Mobile Controls - Dropdown to select stat */}
      <div className="mb-4 md:hidden flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="mobile-stat-select"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Pokaż i sortuj wg:
            </label>
            <select
              id="mobile-stat-select"
              value={displayedStat}
              onChange={handleDisplayedStatChange}
              className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm py-1 pl-2 pr-7 text-sm focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue dark:bg-gray-700 dark:text-white"
            >
              {Object.entries(statOptions).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-grow overflow-hidden shadow rounded-lg border border-pokemon-gray-medium dark:border-gray-700">
        <div className="h-full overflow-y-auto relative">
          <table className="min-w-full border-collapse">
            {/* Unified Table Head */}
            <thead className="sticky top-0 z-10 bg-pokemon-gray-light dark:bg-gray-700">
              <tr>
                {/* Rank Header (Not Sortable) */}
                <th
                  scope="col"
                  className="px-2 md:px-3 py-3 text-center text-xs font-medium text-pokemon-gray-dark dark:text-gray-300 uppercase tracking-wider w-10 md:w-12"
                >
                  Rank
                </th>
                {/* Image Header (Empty) */}
                <th
                  scope="col"
                  className="px-2 md:px-3 py-3 text-center text-xs font-medium text-pokemon-gray-dark dark:text-gray-300 uppercase tracking-wider w-12 md:w-16"
                ></th>
                {/* Name Header (Sortable) */}
                <SortableHeaderCell
                  columnKey="name"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Nazwa
                </SortableHeaderCell>
                {/* Types Header (Not Sortable) */}
                <th
                  scope="col"
                  className="px-2 md:px-3 py-3 text-center text-xs font-medium text-pokemon-gray-dark dark:text-gray-300 uppercase tracking-wider"
                >
                  Typy
                </th>

                {/* Desktop Stat Headers (Hidden on Mobile) */}
                <SortableHeaderCell
                  columnKey="wins"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  className="hidden md:table-cell"
                >
                  Wygrane
                </SortableHeaderCell>
                <SortableHeaderCell
                  columnKey="base_experience"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  className="hidden md:table-cell"
                >
                  Dośw.
                </SortableHeaderCell>
                <SortableHeaderCell
                  columnKey="weight"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  className="hidden md:table-cell"
                >
                  Waga
                </SortableHeaderCell>
                <SortableHeaderCell
                  columnKey="height"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  className="hidden md:table-cell"
                >
                  Wzrost
                </SortableHeaderCell>

                {/* Mobile Stat Header (Hidden on Desktop) */}
                <SortableHeaderCell
                  columnKey={displayedStat}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  className="md:hidden"
                >
                  {statOptions[displayedStat]?.label || "Stat."}
                </SortableHeaderCell>
              </tr>
            </thead>
            {/* Unified Table Body */}
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-pokemon-gray-medium dark:divide-gray-600">
              {sortedRankedPokemons.map((pokemon, index) => (
                <tr
                  key={pokemon.id}
                  className="hover:bg-pokemon-gray-light/30 dark:hover:bg-pokemon-gray-darker/50 transition-colors"
                >
                  {/* Rank Cell */}
                  <td className="px-2 md:px-3 py-3 whitespace-nowrap text-sm text-right font-medium text-pokemon-gray-dark dark:text-gray-400 w-10 md:w-12 align-middle">
                    {index + 1}
                  </td>
                  {/* Image Cell */}
                  <td className="px-2 md:px-3 py-3 whitespace-nowrap w-12 md:w-16 align-middle">
                    <img
                      src={getPokemonImageUrl(pokemon.id)}
                      alt={capitalizeWords(pokemon.name)}
                      className="w-8 h-8 md:w-10 md:h-10 object-contain mx-auto"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/src/assets/pokeball.svg";
                      }}
                    />
                  </td>
                  {/* Name Cell */}
                  <td
                    className={clsx(
                      "px-2 md:px-3 py-3 whitespace-nowrap text-sm align-middle text-left",
                      sortBy === "name"
                        ? "font-bold text-pokemon-blue dark:text-pokemon-yellow"
                        : "font-semibold text-pokemon-gray-darker dark:text-gray-200",
                    )}
                  >
                    {capitalizeWords(pokemon.name)}
                  </td>
                  {/* Types Cell */}
                  <td className="px-2 md:px-3 py-3 whitespace-nowrap align-middle text-center">
                    {pokemon.types && pokemon.types.length > 0 ? (
                      <div className="flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-1">
                        {pokemon.types.map((type) => (
                          <TypeBadge key={type} type={type} />
                        ))}
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </td>

                  {/* Desktop Stat Cells (Hidden on Mobile) */}
                  <td
                    className={clsx(
                      "hidden md:table-cell px-3 py-3 whitespace-nowrap text-sm text-center align-middle",
                      sortBy === "wins"
                        ? "font-bold text-pokemon-blue dark:text-pokemon-yellow"
                        : "text-pokemon-gray-darker dark:text-gray-300",
                    )}
                  >
                    {formatStatValue(pokemon, "wins")}
                  </td>
                  <td
                    className={clsx(
                      "hidden md:table-cell px-3 py-3 whitespace-nowrap text-sm text-center align-middle",
                      sortBy === "base_experience"
                        ? "font-bold text-pokemon-blue dark:text-pokemon-yellow"
                        : "text-pokemon-gray-darker dark:text-gray-300",
                    )}
                  >
                    {formatStatValue(pokemon, "base_experience")}
                  </td>
                  <td
                    className={clsx(
                      "hidden md:table-cell px-3 py-3 whitespace-nowrap text-sm text-center align-middle",
                      sortBy === "weight"
                        ? "font-bold text-pokemon-blue dark:text-pokemon-yellow"
                        : "text-pokemon-gray-darker dark:text-gray-300",
                    )}
                  >
                    {formatStatValue(pokemon, "weight")}
                  </td>
                  <td
                    className={clsx(
                      "hidden md:table-cell px-3 py-3 whitespace-nowrap text-sm text-center align-middle",
                      sortBy === "height"
                        ? "font-bold text-pokemon-blue dark:text-pokemon-yellow"
                        : "text-pokemon-gray-darker dark:text-gray-300",
                    )}
                  >
                    {formatStatValue(pokemon, "height")}
                  </td>

                  {/* Mobile Stat Cell (Hidden on Desktop) */}
                  <td
                    className={clsx(
                      "md:hidden table-cell px-2 py-3 whitespace-nowrap text-sm text-center align-middle",
                      sortBy === displayedStat
                        ? "font-bold text-pokemon-blue dark:text-pokemon-yellow"
                        : "text-pokemon-gray-darker dark:text-gray-300",
                    )}
                  >
                    {formatStatValue(pokemon, displayedStat)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
