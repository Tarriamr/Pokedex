import React from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import PokemonList from './subpages/home/PokemonList';
import AuthNav from './components/Navigation/AuthNav';
import MainNav from './components/Navigation/MainNav';
// Import nowych stron
import Login from './subpages/login/Login';
import Register from './subpages/register/Register';

// Prosty komponent dla logo
const Logo = () => (
    <Link to="/" className="text-3xl font-bold text-pokemon-yellow tracking-wider"
          style={{textShadow: '2px 2px 4px rgba(41, 182, 246, 0.7)'}}>
        PokéMoN
    </Link>
);


const App = () => {
    // Tutaj w przyszłości będzie logika sprawdzania, czy użytkownik jest zalogowany
    const isLoggedIn = false; // Załóżmy na razie, że użytkownik nie jest zalogowany

    return (
        <Router>
            {/* Wrapper dla całej aplikacji z tłem */}
            <div className="bg-pokemon-gray-light min-h-screen flex flex-col">

                {/* Nagłówek */}
                <header className="bg-pokemon-red shadow-md sticky top-0 z-40">
                    <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
                        {/* Lewa strona - Logo */}
                        <Logo/>

                        {/* Prawa strona - Nawigacja */}
                        <div className="flex items-center space-x-4">
                            {/* Tutaj będzie logika warunkowego renderowania nawigacji */}
                            {isLoggedIn ? <MainNav/> : <AuthNav/>}
                            {/* Można dodać ikonę użytkownika i przełącznik theme później [source: 106] */}
                        </div>
                    </nav>
                </header>

                {/* Główna treść strony */}
                <main className="container mx-auto p-4 flex-grow">
                    <Routes>
                        <Route path="/" element={<PokemonList/>}/>
                        {/* --- Nowe trasy --- */}
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        {/* --- Koniec nowych tras --- */}

                        {/* Dodaj inne route'y później (Ulubione, Arena, etc.) */}
                        {/* Przykład dla strony, która jeszcze nie istnieje */}
                        {/* <Route path="/favourites" element={<div>Strona Ulubionych (TODO)</div>} /> */}
                    </Routes>
                </main>

                {/* Stopka (opcjonalnie) */}
                <footer className="bg-pokemon-blue text-white text-center p-3 mt-auto text-sm">
                    Pokedex Project &copy; {new Date().getFullYear()}
                </footer>
            </div>
        </Router>
    );
};

export default App;
