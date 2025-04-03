/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                pokemon: {
                    red: '#EF5350', // Jasny czerwony (np. Pokeball)
                    'red-dark': '#D32F2F',
                    blue: '#29B6F6', // Jasny niebieski (np. Woda)
                    'blue-dark': '#0288D1',
                    yellow: '#FFEE58', // Żółty (np. Pikachu)
                    'yellow-dark': '#FBC02D',
                    green: '#66BB6A', // Zielony (np. Trawa)
                    'green-dark': '#388E3C',
                    gray: { // Dodano odcienie szarości dla tła/tekstu
                        light: '#F5F5F5', // Bardzo jasny szary
                        medium: '#E0E0E0', // Jasny szary
                        dark: '#757575', // Ciemniejszy szary
                        darker: '#424242', // Bardzo ciemny szary
                    },
                    // Można dodać więcej kolorów dla typów pokemonów, itp.
                },
            },
        },
    },
    plugins: [],
}
