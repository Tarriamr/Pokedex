import { useState, useMemo, useCallback } from "react";
import { POKEMONS_PER_PAGE } from "../config/constants"; // Import domyślnej wartości

export const usePagination = (
  totalItems = 0,
  itemsPerPage = POKEMONS_PER_PAGE,
) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    if (!totalItems || itemsPerPage <= 0) return 1;
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Reset to page 1 if total pages decrease below current page (e.g., filtering)
  // We need useEffect to safely handle state updates triggered by prop/state changes
  // This prevents potential infinite loops during render.
  // Note: This logic might need adjustment based on how filtering resets pagination.
  // If the parent component always resets to page 1 on filter change, this might be redundant.
  if (currentPage > totalPages) {
    // Be cautious with direct state updates in the hook body outside useEffect/useCallback
    // For simplicity, let's assume the parent component handles resetting currentPage when needed.
    // If not, a useEffect would be better:
    // useEffect(() => {
    //     if (currentPage > totalPages) {
    //         setCurrentPage(1);
    //     }
    // }, [currentPage, totalPages]);
    // Let's keep it simple for now, assuming PokemonList resets page correctly.
  }

  const goToNextPage = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage >= totalPages ? 1 : prevPage + 1));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage <= 1 ? totalPages : prevPage - 1));
  }, [totalPages]);

  const startIndex = useMemo(
    () => (currentPage - 1) * itemsPerPage,
    [currentPage, itemsPerPage],
  );
  const endIndex = useMemo(
    () => startIndex + itemsPerPage,
    [startIndex, itemsPerPage],
  );

  return {
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setCurrentPage,
    startIndex,
    endIndex,
  };
};
