import React, {useCallback, useEffect, useState} from 'react';
import usePokemonList from '../../hooks/usePokemonList';
import SearchBar from '../../shared/SearchBar';

const POKEMONS_PER_PAGE = 15;
const CARDS_PER_ROW = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
};
const CARD_WIDTH_CLASSES = 'w-full max-w-72';

const PokemonList = () => {
    const {data: allPokemon, isLoading, isError, error} = usePokemonList();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [, setRenderTrigger] = useState(0);

    const filteredPokemon = allPokemon?.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredPokemon.length / POKEMONS_PER_PAGE);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const goToNextPage = () => {
        setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : 1));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : totalPages > 0 ? totalPages : 1));
    };

    const startIndex = (currentPage - 1) * POKEMONS_PER_PAGE;
    const endIndex = startIndex + POKEMONS_PER_PAGE;
    const currentPokemonPage = filteredPokemon.slice(startIndex, endIndex);

    const getCurrentBreakpoint = useCallback(() => {
        const width = window.innerWidth;
        if (width < 640) return 'xs';
        if (width < 768) return 'sm';
        if (width < 1024) return 'md';
        if (width < 1280) return 'lg';
        return 'xl';
    }, []);

    const getRows = useCallback(() => {
        const rows = [];
        const breakpoint = getCurrentBreakpoint();
        const cardsPerRow = CARDS_PER_ROW[breakpoint] || 4;
        for (let i = 0; i < currentPokemonPage.length; i += cardsPerRow) {
            rows.push(currentPokemonPage.slice(i, i + cardsPerRow));
        }
        return rows;
    }, [currentPokemonPage, getCurrentBreakpoint]);

    useEffect(() => {
        const handleResize = () => {
            setRenderTrigger(prev => prev + 1);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isLoading) {
        return <div>Ładowanie Pokemonów...</div>;
    }

    if (isError) {
        return <div>Wystąpił błąd podczas pobierania Pokemonów: {error?.message || 'Wystąpił nieznany błąd.'}</div>;
    }

    return (
        <div>
            <SearchBar onSearch={handleSearch}/>
            <div>
                {getRows().map((row, index) => (
                    <div key={index} className="flex justify-center gap-4 mt-4">
                        {row.map(pokemon => (
                            <div key={pokemon.id}
                                 className={`bg-white rounded-md shadow-md p-4 ${CARD_WIDTH_CLASSES} hover:scale-105 transition-transform cursor-pointer`}>
                                <img src={pokemon.image} alt={pokemon.name}
                                     className="w-full h-32 object-contain mb-2"/>
                                <h2 className="text-lg font-semibold text-center">{pokemon.name}</h2>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <div>Wzrost: {pokemon.height}</div>
                                    <div>Waga: {pokemon.weight}</div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <div>HP: {pokemon.stats?.hp}</div>
                                    <div>Atak: {pokemon.stats?.attack}</div>
                                </div>
                                {/* W przyszłości dodamy Ability */}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <button onClick={goToPreviousPage}
                            className="px-4 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        Poprzednia
                    </button>
                    <span>Strona {currentPage} / {totalPages > 0 ? totalPages : 1}</span>
                    <button onClick={goToNextPage}
                            className="px-4 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        Następna
                    </button>
                </div>
            )}
        </div>
    );
};

export default PokemonList;
