import { useState, useMemo, useCallback } from "react";
import { POKEMONS_PER_PAGE } from "../config/constants";

export const usePagination = (
  totalItems = 0,
  itemsPerPage = POKEMONS_PER_PAGE,
) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    if (!totalItems || itemsPerPage <= 0) return 1;
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

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
