/** @type {import('tailwindcss').Config} */
module.exports = {
    // DODANO: Włączenie dark mode opartego na klasie
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                pokemon: {
                    // NOWE/ZAKTUALIZOWANE KOLORY PODSTAWOWE
                    red: '#E3350D', // Główny czerwony Pokemon
                    'red-dark': '#B52A0B', // Ciemniejszy wariant dla hover/akcentów (przykład)

                    blue: {
                        light: '#5DB9FF',   // Jaśniejszy niebieski
                        DEFAULT: '#2A75BB', // Główny niebieski Pokemon
                        dark: '#00508D',   // Ciemniejszy niebieski
                    },

                    yellow: {
                        light: '#FDE047',   // Jaśniejszy żółty
                        DEFAULT: '#FFCB05', // Główny żółty Pokemon
                        dark: '#CC9900',   // Ciemniejszy żółty (już używany na hover)
                    },

                    // ZACHOWANE KOLORY (można je później dostosować)
                    green: '#66BB6A',
                    'green-dark': '#388E3C',

                    // ZACHOWANE ODCIENIE SZAROŚCI
                    gray: {
                        light: '#F5F5F5',    // Bardzo jasny szary (dobry dla tła dark mode?)
                        medium: '#E0E0E0',   // Jasny szary
                        dark: '#757575',    // Ciemniejszy szary (dobry dla tekstu w dark?)
                        darker: '#424242',   // Bardzo ciemny szary (dobry dla tła dark mode?)
                    },

                    // NOWY KOLOR NEUTRALNY
                    'neutral-sand': '#F0EAD6', // Piaskowy/Beżowy

                    // Można tutaj w przyszłości zdefiniować kolory dla typów
                },
            },
        },
    },
    plugins: [],
}
