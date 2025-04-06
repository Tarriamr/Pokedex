/** @type {import('tailwindcss').Config} */

// Generowanie listy klas do safelisty
const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];
const typeSafelist = pokemonTypes.map(type => `bg-pokemon-type-${type}`);

module.exports = {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    // DODANO: Safelista dla dynamicznych klas kolorów typów
    safelist: [
        ...typeSafelist,
        // Można tu dodać inne dynamiczne klasy jeśli zajdzie potrzeba
    ],
    theme: {
        extend: {
            colors: {
                pokemon: {
                    // Podstawowe
                    red: '#E3350D',
                    'red-dark': '#B52A0B',
                    blue: {
                        light: '#5DB9FF',
                        DEFAULT: '#2A75BB',
                        dark: '#00508D',
                    },
                    yellow: {
                        light: '#FDE047',
                        DEFAULT: '#FFCB05',
                        dark: '#CC9900',
                    },
                    green: '#66BB6A',
                    'green-dark': '#388E3C',
                    gray: {
                        light: '#F5F5F5',
                        medium: '#E0E0E0',
                        dark: '#757575',
                        darker: '#424242',
                    },
                    'neutral-sand': '#F0EAD6',

                    // Kolory Typów Pokemon
                    type: {
                        normal: '#A8A77A',
                        fire: '#EE8130',
                        water: '#6390F0',
                        electric: '#F7D02C',
                        grass: '#7AC74C',
                        ice: '#96D9D6',
                        fighting: '#C22E28',
                        poison: '#A33EA1',
                        ground: '#E2BF65',
                        flying: '#A98FF3',
                        psychic: '#F95587',
                        bug: '#A6B91A',
                        rock: '#B6A136',
                        ghost: '#735797',
                        dragon: '#6F35FC',
                        dark: '#705746', // Uwaga na potencjalny konflikt nazwy z dark mode theme
                        steel: '#B7B7CE',
                        fairy: '#D685AD',
                    }
                },
            },
        },
    },
    plugins: [],
}
