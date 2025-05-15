import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/20/solid";

const SortableHeaderCell = ({
  children,
  columnKey,
  sortBy,
  sortOrder,
  onSort,
  className,
}) => {
  const isActive = sortBy === columnKey;
  const isAscending = isActive && sortOrder === "asc";
  const isDescending = isActive && sortOrder === "desc";

  const handleClick = () => {
    onSort(columnKey);
  };

  return (
    <th
      scope="col"
      className={clsx(
        "px-3 py-3 text-xs font-medium text-pokemon-gray-dark dark:text-gray-300 uppercase tracking-wider cursor-pointer transition-colors hover:bg-pokemon-gray-medium/50 dark:hover:bg-pokemon-gray-dark",
        className,
      )}
      onClick={handleClick}
      aria-sort={
        isActive ? (sortOrder === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <div className="flex justify-between items-center">
        <span className="flex-grow text-center">{children}</span>
        <span className="flex flex-col ml-1 flex-shrink-0">
          <ArrowUpIcon
            className={clsx(
              "h-3 w-3",
              isAscending
                ? "text-pokemon-blue dark:text-pokemon-yellow"
                : "text-gray-400 dark:text-gray-500",
            )}
            aria-hidden="true"
          />
          <ArrowDownIcon
            className={clsx(
              "h-3 w-3",
              isDescending
                ? "text-pokemon-blue dark:text-pokemon-yellow"
                : "text-gray-400 dark:text-gray-500",
            )}
            aria-hidden="true"
          />
        </span>
      </div>
    </th>
  );
};

SortableHeaderCell.propTypes = {
  children: PropTypes.node.isRequired,
  columnKey: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf(["asc", "desc"]).isRequired,
  onSort: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default SortableHeaderCell;
