import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import usePokemonList from '../../hooks/usePokemonList';
import { POKEMON_API_LIMIT } from '../../config/constants';
import clsx from 'clsx';
import TypeBadge from '../../components/PokemonDetailsModal/TypeBadge';
import SortableHeaderCell from '../../components/Ranking/SortableHeaderCell';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

const sortableColumns = ['id', 'name', 'wins', 'effectiveExperience', 'weight', 'height'];

// Zaktualizowano etykiety dla spójności
const statOptions = {
    wins: { label: 'Wygrane', key: 'wins' },
    effectiveExperience: { label: 'Dośw.', key: 'effectiveExperience' },
    weight: { label: 'Waga', key: 'weight', unit: ' kg' },
    height: { label: 'Wzrost', key: 'height', unit: ' m' },
};

const RankingPage = () => {
    const { currentUser } = useAuth();
    const { data: allPokemon, isLoading: isLoadingList, isError: isErrorList, error: errorList } = usePokemonList(POKEMON_API_LIMIT);

    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    // Domyślna wyświetlana statystyka na mobile
    const [displayedStat, setDisplayedStat] = useState('wins');

    const userStats = useMemo(() => currentUser?.pokemonStats || {}, [currentUser?.pokemonStats]);

    const combinedPokemonData = useMemo(() => {
        // Logika bez zmian...
        if (!allPokemon) return [];
        return allPokemon.map(baseData => {
            const pokemonId = String(baseData.id);
            const stats = userStats[pokemonId] || { wins: 0 };
            const effectiveExperience = stats.modified_base_experience ?? baseData.base_experience ?? 0;
            return {
                id: pokemonId,
                name: baseData.name,
                image: baseData.image,
                types: baseData.types || [],
                height: baseData.height ?? 0,
                weight: baseData.weight ?? 0,
                wins: stats.wins,
                effectiveExperience: effectiveExperience,
            };
        });
    }, [allPokemon, userStats]);

    const sortedRankedPokemons = useMemo(() => {
        // Logika bez zmian...
        const dataToSort = [...combinedPokemonData];
        dataToSort.sort((a, b) => {
            let comparison = 0;
            const valA = a[sortBy];
            const valB = b[sortBy];
            if (sortBy === 'id') comparison = parseInt(valA, 10) - parseInt(valB, 10);
            else if (sortBy === 'name') comparison = valA.localeCompare(valB, 'pl');
            else {
                if (valA > valB) comparison = 1;
                else if (valA < valB) comparison = -1;
            }
            return sortOrder === 'desc' ? comparison * -1 : comparison;
        });
        return dataToSort;
    }, [combinedPokemonData, sortBy, sortOrder]);

    // Handler sortowania - używany przez obie tabele/listy
    const handleSort = useCallback((columnKey) => {
        if (!sortableColumns.includes(columnKey)) return;

        // Ustaw wyświetlaną statystykę jeśli sortujemy wg niej
        if (statOptions[columnKey]) {
            setDisplayedStat(columnKey);
        }

        if (sortBy === columnKey) {
            setSortOrder(prevOrder => (prevOrder === 'desc' ? 'asc' : 'desc'));
        } else {
            setSortBy(columnKey);
            setSortOrder((columnKey === 'id' || columnKey === 'name') ? 'asc' : 'desc');
        }
    }, [sortBy]);

    // Handler zmiany wyświetlanej statystyki (tylko mobile)
    const handleDisplayedStatChange = useCallback((event) => {
        const newStatKey = event.target.value;
        if (statOptions[newStatKey]) {
            setDisplayedStat(newStatKey);
            // Automatycznie sortuj wg nowej statystyki, malejąco
            if (sortBy !== newStatKey) {
                setSortBy(newStatKey);
                setSortOrder('desc');
            }
        }
    }, [sortBy]);

    // Usunięto toggleSortOrder - obsługa przez handleSort

    // --- Renderowanie --- //

    if (isLoadingList) {
        return <div className="text-center p-10 text-xl text-pokemon-blue dark:text-pokemon-blue-light">Ładowanie danych rankingu...</div>;
    }
    if (isErrorList) {
        return <div className="text-center p-10 text-xl text-pokemon-red dark:text-red-400">Wystąpił błąd: {errorList?.message || 'Nieznany błąd.'}</div>;
    }
    if (sortedRankedPokemons.length === 0 && !isLoadingList) {
        return (
            <div className="p-4">
                <h1 className="text-3xl font-bold mb-6 text-center text-pokemon-blue-dark dark:text-pokemon-blue-light">Ranking Pokemonów</h1>
                <p className="text-center text-pokemon-gray-dark dark:text-pokemon-gray-light mt-6">Brak danych Pokemonów do wyświetlenia.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-pokemon-blue-dark dark:text-pokemon-blue-light">Ranking Pokemonów</h1>

            {/* === KONTROLKI MOBILNE (widoczne poniżej md) === */}
            <div className="mb-4 md:hidden">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    {/* Dropdown do wyboru wyświetlanej statystyki */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="mobile-stat-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">Pokaż statystykę:</label>
                        <select
                            id="mobile-stat-select"
                            value={displayedStat}
                            onChange={handleDisplayedStatChange}
                            className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm py-1 pl-2 pr-7 text-sm focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue dark:bg-gray-700 dark:text-white"
                        >
                            {Object.entries(statOptions).map(([key, { label }]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                    {/* Usunięto pozostałe kontrolki mobilne */}
                </div>
            </div>

            {/* === TABELA DESKTOP (widoczna od md) === */}
            <div className="hidden md:block overflow-x-auto max-w-5xl mx-auto shadow rounded-lg border border-pokemon-gray-medium dark:border-gray-700">
                <table className="min-w-full divide-y divide-pokemon-gray-medium dark:divide-gray-700">
                    <thead className="bg-pokemon-gray-light dark:bg-pokemon-gray-darker">
                    <tr>
                        <SortableHeaderCell columnKey="id" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>#</SortableHeaderCell>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-pokemon-gray-dark dark:text-gray-300 uppercase tracking-wider w-16"></th>
                        {/* Przywrócono osobne nagłówki */}
                        <SortableHeaderCell columnKey="name" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Nazwa</SortableHeaderCell>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-pokemon-gray-dark dark:text-gray-300 uppercase tracking-wider">Typ(y)</th>
                        <SortableHeaderCell columnKey="wins" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Wygrane</SortableHeaderCell>
                        <SortableHeaderCell columnKey="effectiveExperience" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Dośw.</SortableHeaderCell>
                        <SortableHeaderCell columnKey="weight" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Waga</SortableHeaderCell>
                        <SortableHeaderCell columnKey="height" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Wzrost</SortableHeaderCell>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-pokemon-gray-medium dark:divide-gray-600">
                    {sortedRankedPokemons.map((pokemon) => (
                        <tr key={pokemon.id} className="hover:bg-pokemon-gray-light/30 dark:hover:bg-pokemon-gray-darker/50 transition-colors">
                            {/* Przywrócono osobne komórki */}
                            <td className={clsx("px-3 py-3 whitespace-nowrap text-sm text-right w-12", sortBy === 'id' ? 'font-bold text-pokemon-blue dark:text-pokemon-yellow' : 'font-medium text-pokemon-gray-dark dark:text-gray-400')}>{pokemon.id}</td>
                            <td className="px-3 py-3 whitespace-nowrap w-16"><img src={pokemon.image || '/src/assets/pokeball.svg'} alt={pokemon.name} className="w-10 h-10 object-contain" loading="lazy"/></td>
                            <td className={clsx("px-3 py-3 whitespace-nowrap text-sm capitalize", sortBy === 'name' ? 'font-bold text-pokemon-blue dark:text-pokemon-yellow' : 'font-semibold text-pokemon-gray-darker dark:text-gray-200')}>{pokemon.name}</td>
                            <td className="px-3 py-3 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                    {pokemon.types.map(type => <TypeBadge key={type} type={type} />)}
                                </div>
                            </td>
                            <td className={clsx("px-3 py-3 whitespace-nowrap text-sm text-right", sortBy === 'wins' ? 'font-bold text-pokemon-blue dark:text-pokemon-yellow' : 'text-pokemon-gray-darker dark:text-gray-300')}>{pokemon.wins}</td>
                            <td className={clsx("px-3 py-3 whitespace-nowrap text-sm text-right", sortBy === 'effectiveExperience' ? 'font-bold text-pokemon-blue dark:text-pokemon-yellow' : 'text-pokemon-gray-darker dark:text-gray-300')}>{pokemon.effectiveExperience}</td>
                            <td className={clsx("px-3 py-3 whitespace-nowrap text-sm text-right", sortBy === 'weight' ? 'font-bold text-pokemon-blue dark:text-pokemon-yellow' : 'text-pokemon-gray-darker dark:text-gray-300')}>{pokemon.weight} kg</td>
                            <td className={clsx("px-3 py-3 whitespace-nowrap text-sm text-right", sortBy === 'height' ? 'font-bold text-pokemon-blue dark:text-pokemon-yellow' : 'text-pokemon-gray-darker dark:text-gray-300')}>{pokemon.height} m</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* === TABELA MOBILNA (widoczna poniżej md) === */}
            <div className="md:hidden overflow-x-auto max-w-full mx-auto shadow rounded-lg border border-pokemon-gray-medium dark:border-gray-700">
                <table className="min-w-full divide-y divide-pokemon-gray-medium dark:divide-gray-700">
                    <thead className="bg-pokemon-gray-light dark:bg-pokemon-gray-darker">
                    <tr>
                        <SortableHeaderCell columnKey="id" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>#</SortableHeaderCell>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-pokemon-gray-dark dark:text-gray-300 uppercase tracking-wider w-12"></th> {/* Obrazek */}
                        <SortableHeaderCell columnKey="name" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Nazwa</SortableHeaderCell>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-pokemon-gray-dark dark:text-gray-300 uppercase tracking-wider">Typ</th>
                        {/* Dynamiczny nagłówek dla statystyki */}
                        <SortableHeaderCell
                            columnKey={displayedStat}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                        >
                            {statOptions[displayedStat]?.label || 'Stat.'}
                        </SortableHeaderCell>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-pokemon-gray-medium dark:divide-gray-600">
                    {sortedRankedPokemons.map((pokemon) => (
                        <tr key={pokemon.id} className="hover:bg-pokemon-gray-light/30 dark:hover:bg-pokemon-gray-darker/50 transition-colors">
                            <td className={clsx("px-2 py-3 whitespace-nowrap text-sm text-right w-10", sortBy === 'id' ? 'font-bold text-pokemon-blue dark:text-pokemon-yellow' : 'font-medium text-pokemon-gray-dark dark:text-gray-400')}>{pokemon.id}</td>
                            <td className="px-2 py-3 whitespace-nowrap w-12"><img src={pokemon.image || '/src/assets/pokeball.svg'} alt={pokemon.name} className="w-8 h-8 object-contain" loading="lazy"/></td>
                            <td className={clsx("px-2 py-3 whitespace-nowrap text-sm capitalize", sortBy === 'name' ? 'font-bold text-pokemon-blue dark:text-pokemon-yellow' : 'font-semibold text-pokemon-gray-darker dark:text-gray-200')}>{pokemon.name}</td>
                            <td className="px-2 py-3 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                    {pokemon.types.map(type => <TypeBadge key={type} type={type} />)}
                                </div>
                            </td>
                            <td className={clsx("px-2 py-3 whitespace-nowrap text-sm text-right", sortBy === displayedStat ? 'font-bold text-pokemon-blue dark:text-pokemon-yellow' : 'text-pokemon-gray-darker dark:text-gray-300')}>
                                {pokemon[displayedStat]}
                                {statOptions[displayedStat]?.unit || ''}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RankingPage;
