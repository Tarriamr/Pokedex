/** @type {import('tailwindcss').Config} */

// Helper function to convert HEX to RGB
function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string' || hex.charAt(0) !== '#') return null;
    let bigint = parseInt(hex.slice(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return `${r}, ${g}, ${b}`; // Return as string "R, G, B"
}

// Define Pokemon type colors (mirrors the theme definition for easy access)
const pokemonTypeColors = {
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
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};

// Generate boxShadow utilities for each Pokemon type
const pokemonTypeShadows = Object.entries(pokemonTypeColors).reduce((acc, [type, colorHex]) => {
    const rgb = hexToRgb(colorHex);
    if (rgb) {
        acc[`pokemon-type-${type}`] = `0 0 25px 8px rgba(${rgb}, 0.9)`;
    }
    return acc;
}, {});

// Generate lists for safelist
const pokemonTypes = Object.keys(pokemonTypeColors);
const typeBgSafelist = pokemonTypes.map(type => `bg-pokemon-type-${type}`);
const typeShadowSafelist = pokemonTypes.map(type => `shadow-pokemon-type-${type}`);

module.exports = {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        ...typeBgSafelist,
        ...typeShadowSafelist, // Add shadow classes to safelist
        'shadow-pokemon-gray-light', // Add fallback shadow class explicitly
    ],
    theme: {
        extend: {
            colors: {
                pokemon: {
                    // Podstawowe kolory (bez zmian)
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
                        // Kolor Normal jako fallback dla cienia
                        'type-fallback': '#A8A77A', // Używamy koloru Normal
                    },
                    'neutral-sand': '#F0EAD6',

                    // Kolory Typów Pokemon (bez zmian)
                    type: pokemonTypeColors,
                },
            },
            // --- DODANO/ZAKTUALIZOWANO SEKCJE BOX SHADOW ---
            boxShadow: {
                ...pokemonTypeShadows, // Rozszerzenie o cienie typów
                // Definicja fallbacku używającego koloru Normal
                'pokemon-gray-light': `0 0 25px 8px rgba(${hexToRgb(pokemonTypeColors.normal)}, 0.9)`,
            },
            // --- KONIEC SEKCJI BOX SHADOW ---
        },
    },
    plugins: [],
}
