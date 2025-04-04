import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import usePokemonList from '../../hooks/usePokemonList';
import SearchBar from '../../shared/SearchBar';
import PokemonDetailsModal from '../../components/PokemonDetailsModal/PokemonDetailsModal.jsx';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/solid';

const POKEMON_LIMIT = 150;
const POKEMONS_PER_PAGE = 15;

const PokemonList = () => {
    const {data: allPokemon, isLoading, isError, error} = usePokemonList(POKEMON_LIMIT);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPokemonId, setSelectedPokemonId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredPokemon = allPokemon?.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / POKEMONS_PER_PAGE));

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const goToNextPage = () => {
        setCurrentPage(prevPage => (prevPage === totalPages ? 1 : prevPage + 1));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prevPage => (prevPage === 1 ? totalPages : prevPage - 1));
    };

    const openModal = (id) => {
        setSelectedPokemonId(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedPokemonId(null);
        setIsModalOpen(false);
    };

    // +++ POPRAWKA: Przywrócenie definicji currentPokemonPage +++
    const startIndex = (currentPage - 1) * POKEMONS_PER_PAGE;
    const endIndex = startIndex + POKEMONS_PER_PAGE;
    const currentPokemonPage = filteredPokemon.slice(startIndex, endIndex);
    // +++ Koniec poprawki +++

    // Dostosowanie wiadomości do dark mode
    if (isLoading) {
        return (
            <div className="text-center p-10 text-xl text-pokemon-blue dark:text-pokemon-blue-light">
                Ładowanie Pokemonów...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center p-10 text-xl text-pokemon-red dark:text-red-400"> {/* Użyto jaśniejszej czerwieni dla dark */}
                Wystąpił błąd podczas pobierania Pokemonów: {error?.message || 'Wystąpił nieznany błąd.'}
            </div>
        );
    }

    return (
        // Usunięto bg-white, komponent dziedziczy tło z App.jsx
        <div className="p-4">
            {/* SearchBar będzie wymagał osobnego dostosowania */}
            <SearchBar onSearch={handleSearch}/>

            {/* Kontener kart */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
                {/* Użycie currentPokemonPage - teraz powinno być zdefiniowane */}
                {currentPokemonPage.length > 0 ? (
                    currentPokemonPage.map(pokemon => (
                        <div
                            key={pokemon.id}
                            className={clsx(
                                "rounded-lg shadow-md p-4 transition-all duration-200 ease-in-out cursor-pointer", // Dodano transition-all
                                // Style Light Mode
                                "bg-white border border-pokemon-gray-medium",
                                "hover:border-pokemon-red hover:shadow-lg hover:scale-105",
                                // Style Dark Mode
                                "dark:bg-gray-800 dark:border-gray-700", // Ciemne tło i ramka
                                "dark:hover:border-pokemon-red", // Czerwona ramka na hover w dark
                                "flex flex-col items-center text-center",
                                "w-[280px] h-[280px] box-border"
                            )}
                            onClick={() => openModal(pokemon.id)}
                        >
                            <img
                                src={pokemon.image || './src/assets/pokeball.svg'}
                                alt={pokemon.name}
                                className="w-32 h-32 object-contain mb-3"
                                loading="lazy"
                            />
                            {/* Tekst karty dostosowany do dark mode */}
                            <h2 className={clsx(
                                "text-lg font-semibold capitalize mb-2",
                                "text-pokemon-gray-darker", // Light
                                "dark:text-pokemon-gray-light" // Dark
                            )}>{pokemon.name}</h2>
                            <div className={clsx(
                                "text-xs mt-1 w-full grid grid-cols-2 gap-x-2",
                                "text-pokemon-gray-dark", // Light
                                "dark:text-pokemon-gray-medium" // Dark (nieco jaśniejszy niż główny tekst dark)
                            )}>
                                <p><strong>Height:</strong> {pokemon.height}</p>
                                <p><strong>Exp:</strong> {pokemon.base_experience}</p>
                                <p><strong>Weight:</strong> {pokemon.weight}</p>
                                <p><strong>Ability:</strong> {pokemon.abilities?.[0]?.ability?.name || 'N/A'}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    // Dostosowanie tekstu "Nie znaleziono..." do dark mode
                    <p className={clsx(
                        "text-center mt-6 w-full",
                        "text-pokemon-gray-dark", // Light
                        "dark:text-pokemon-gray-light" // Dark
                    )}>
                        Nie znaleziono Pokemonów pasujących do wyszukiwania.
                    </p>
                )}
            </div>

            {/* --- Paginacja (cyrkularna) --- */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-4">
                    {/* Przyciski paginacji - zakładamy, że obecny styl jest OK w dark mode */}
                    <button
                        onClick={goToPreviousPage}
                        className="p-2 rounded-[999px] bg-pokemon-yellow hover:bg-pokemon-yellow-dark text-pokemon-blue-dark shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pokemon-yellow focus:ring-opacity-50"
                        aria-label="Poprzednia strona"
                    >
                        <ChevronLeftIcon className="h-6 w-6"/>
                    </button>
                    {/* Tekst paginacji dostosowany do dark mode */}
                    <span className={clsx(
                        "text-lg font-bold",
                        "text-pokemon-gray-darker", // Light
                        "dark:text-pokemon-gray-light" // Dark
                    )}>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        className="p-2 rounded-[999px] bg-pokemon-yellow hover:bg-pokemon-yellow-dark text-pokemon-blue-dark shadow-[0px_4px_10px_0px_rgba(0,0,0,0.30)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pokemon-yellow focus:ring-opacity-50"
                        aria-label="Następna strona"
                    >
                        <ChevronRightIcon className="h-6 w-6"/>
                    </button>
                </div>
            )}
            {/* --- Koniec zmian w Paginacji --- */}

            {/* Modal już był częściowo dostosowany, ale może wymagać dalszych poprawek po testach */}
            {isModalOpen && (
                <PokemonDetailsModal pokemonId={selectedPokemonId} onClose={closeModal}/>
            )}
        </div>
    );
};

export default PokemonList;
