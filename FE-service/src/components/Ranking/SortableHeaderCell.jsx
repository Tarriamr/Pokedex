import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

const SortableHeaderCell = ({
                                children,
                                columnKey, // Klucz identyfikujący kolumnę (np. 'weight')
                                sortBy,    // Aktualnie wybrany klucz sortowania
                                sortOrder, // Aktualny kierunek sortowania ('asc' lub 'desc')
                                onSort,    // Funkcja callback wywoływana przy kliknięciu
                            }) => {
    const isActive = sortBy === columnKey;
    const isAscending = isActive && sortOrder === 'asc';
    const isDescending = isActive && sortOrder === 'desc';

    const handleClick = () => {
        onSort(columnKey);
    };

    return (
        <th
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium text-pokemon-gray-dark dark:text-gray-300 uppercase tracking-wider cursor-pointer transition-colors hover:bg-pokemon-gray-medium/50 dark:hover:bg-pokemon-gray-dark"
            onClick={handleClick}
            aria-sort={isActive ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
        >
            <div className="flex items-center justify-between">
                <span>{children}</span>
                <span className="flex flex-col ml-1">
          {/* Strzałka w górę */}
                    <ArrowUpIcon
                        className={clsx(
                            'h-3 w-3',
                            isAscending
                                ? 'text-pokemon-blue dark:text-pokemon-yellow' // Aktywna rosnąco
                                : 'text-gray-400 dark:text-gray-500' // Nieaktywna lub malejąco
                        )}
                        aria-hidden="true"
                    />
                    {/* Strzałka w dół */}
                    <ArrowDownIcon
                        className={clsx(
                            'h-3 w-3',
                            isDescending
                                ? 'text-pokemon-blue dark:text-pokemon-yellow' // Aktywna malejąco
                                : 'text-gray-400 dark:text-gray-500' // Nieaktywna lub rosnąco
                        )}
                        aria-hidden="true"
                    />
        </span>
            </div>
        </th>
    );
};

SortableHeaderCell.propTypes = {
    children: PropTypes.node.isRequired, // Label kolumny
    columnKey: PropTypes.string.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortOrder: PropTypes.oneOf(['asc', 'desc']).isRequired,
    onSort: PropTypes.func.isRequired,
};

export default SortableHeaderCell;
