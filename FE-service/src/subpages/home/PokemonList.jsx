import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx'; // Import clsx
import usePokemonList from '../../hooks/usePokemonList';
import SearchBar from '../../shared/SearchBar';
import PokemonDetailsModal from '../../components/PokemonDetailsModal/PokemonDetailsModal.jsx';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/solid'; // Import ikon

const POKEMON_LIMIT = 150;
const POKEMONS_PER_PAGE = 15;
const CARDS_PER_ROW = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
};
// Usunięto CARD_WIDTH_CLASSES, szerokość będzie zarządzana przez flex/grid

const PokemonList = () => {
    const {data: allPokemon, isLoading, isError, error} = usePokemonList(POKEMON_LIMIT);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPokemonId, setSelectedPokemonId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [_, setRenderTrigger] = useState(0); // Do re-renderowania przy resize

    const filteredPokemon = allPokemon?.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Total pages calculation ensures it's at least 1 if there are any pokemon
    const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / POKEMONS_PER_PAGE));

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1); // Resetuj stronę przy nowym wyszukiwaniu
    };

    // --- Zmieniona logika paginacji ---
    const goToNextPage = () => {
        setCurrentPage(prevPage => (prevPage === totalPages ? 1 : prevPage + 1));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prevPage => (prevPage === 1 ? totalPages : prevPage - 1));
    };
    // --- Koniec zmian w logice paginacji ---

    const startIndex = (currentPage - 1) * POKEMONS_PER_PAGE;
    const endIndex = startIndex + POKEMONS_PER_PAGE;
    const currentPokemonPage = filteredPokemon.slice(startIndex, endIndex);

    // Responsywność - bez zmian w logice
    const getCurrentBreakpoint = useCallback(() => {
        // ... (bez zmian)
        const width = window.innerWidth;
        if (width < 640) return 'xs';
        if (width < 768) return 'sm';
        if (width < 1024) return 'md';
        if (width < 1280) return 'lg';
        return 'xl';
    }, []);

    const getRows = useCallback(() => {
        // ... (bez zmian)
        const rows = [];
        const breakpoint = getCurrentBreakpoint();
        const cardsPerRow = CARDS_PER_ROW[breakpoint] || 4;
        for (let i = 0; i < currentPokemonPage.length; i += cardsPerRow) {
            rows.push(currentPokemonPage.slice(i, i + cardsPerRow));
        }
        return rows;
    }, [currentPokemonPage, getCurrentBreakpoint]);

    useEffect(() => {
        // ... (bez zmian)
        const handleResize = () => {
            setRenderTrigger(prev => prev + 1);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const openModal = (id) => {
        setSelectedPokemonId(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedPokemonId(null);
        setIsModalOpen(false);
    };

    if (isLoading) {
        return <div className="text-center p-10 text-xl text-pokemon-blue-dark">Ładowanie Pokemonów...</div>;
    }

    if (isError) {
        return <div className="text-center p-10 text-xl text-pokemon-red-dark">Wystąpił błąd podczas pobierania
            Pokemonów: {error?.message || 'Wystąpił nieznany błąd.'}</div>;
    }

    return (
        <div className="p-4">
            <SearchBar onSearch={handleSearch}/>

            {/* Grid dla kart Pokemonów */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
                {currentPokemonPage.length > 0 ? (
                    currentPokemonPage.map(pokemon => (
                        <div
                            key={pokemon.id}
                            className={clsx(
                                "bg-white rounded-lg shadow-md p-4 transition-transform duration-200 ease-in-out cursor-pointer",
                                "border border-pokemon-gray-medium hover:border-pokemon-red hover:shadow-lg hover:scale-105",
                                "flex flex-col items-center text-center" // Wycentrowanie zawartości
                            )}
                            onClick={() => openModal(pokemon.id)}
                        >
                            <img
                                src={pokemon.image || './src/assets/pokeball.svg'} // Fallback image
                                alt={pokemon.name}
                                className="w-32 h-32 object-contain mb-3"
                                loading="lazy" // Lazy loading dla obrazków
                            />
                            <h2 className="text-lg font-semibold text-pokemon-gray-darker capitalize mb-2">{pokemon.name}</h2>
                            {/* Usunięto poprzednie szczegóły, są teraz w modalu */}
                            <div className="text-xs text-pokemon-gray-dark mt-1 w-full grid grid-cols-2 gap-x-2">
                                {/* Dodano podstawowe staty z powrotem zgodnie z obrazkiem [Image 3] */}
                                <p><strong>Height:</strong> {pokemon.height}</p>
                                <p><strong>Exp:</strong> {pokemon.base_experience}</p>
                                <p><strong>Weight:</strong> {pokemon.weight}</p>
                                <p><strong>Ability:</strong> {pokemon.abilities?.[0]?.ability?.name || 'N/A'}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-pokemon-gray-dark col-span-full text-center mt-6">Nie znaleziono Pokemonów
                        pasujących do wyszukiwania.</p>
                )}
            </div>


            {/* --- Zmieniona Paginacja --- */}
            {totalPages > 1 && ( // Ukryj, jeśli jest tylko jedna strona
                <div className="flex justify-center items-center mt-8 space-x-4">
                    <button
                        onClick={goToPreviousPage}
                        className="p-2 rounded-full bg-pokemon-yellow hover:bg-pokemon-yellow-dark text-pokemon-gray-darker shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pokemon-yellow focus:ring-opacity-50"
                        aria-label="Poprzednia strona"
                    >
                        <ChevronLeftIcon className="h-6 w-6"/>
                    </button>
                    <span className="text-lg font-medium text-pokemon-gray-darker">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        className="p-2 rounded-full bg-pokemon-yellow hover:bg-pokemon-yellow-dark text-pokemon-gray-darker shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pokemon-yellow focus:ring-opacity-50"
                        aria-label="Następna strona"
                    >
                        <ChevronRightIcon className="h-6 w-6"/>
                    </button>
                </div>
            )}
            {/* --- Koniec zmian w Paginacji --- */}


            {/* Renderowanie komponentu modala */}
            {isModalOpen && (
                <PokemonDetailsModal pokemonId={selectedPokemonId} onClose={closeModal}/>
            )}
        </div>
    );
};

export default PokemonList;
