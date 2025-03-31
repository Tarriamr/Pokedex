import React from 'react';
import usePokemonList from '../../hooks/usePokemonList';

const PokemonList = () => {
    const {data, isLoading, isError, error} = usePokemonList();

    if (isLoading) {
        return <div>Ładowanie Pokemonów...</div>;
    }

    if (isError) {
        return <div>Wystąpił błąd podczas pobierania Pokemonów: {error.message}</div>;
    }

    console.log(data)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data && data.map((pokemon) => (
                <div key={pokemon.id}
                     className="bg-white rounded-md shadow-md p-4 hover:scale-105 transition-transform cursor-pointer">
                    <img src={pokemon.image} alt={pokemon.name} className="w-full h-32 object-contain mb-2"/>
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
    );
};

export default PokemonList;
