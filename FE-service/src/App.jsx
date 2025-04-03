import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import PokemonList from './subpages/home/PokemonList';
import AuthNav from './components/Navigation/AuthNav';
import MainNav from './components/Navigation/MainNav';

const App = () => {
    return (
        <Router>
            <div className="bg-gray-100 min-h-screen">
                <header className="bg-blue-500 text-white p-4 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold ml-4">PokeMoN</Link>
                    <div className="flex items-center mr-4">
                        {/* Na razie wyświetlamy oba zestawy nawigacji */}
                        <AuthNav />
                        <MainNav />
                    </div>
                    <div>
                        {/* Informacja o użytkowniku i przełącznik themingu (puste na razie) */}
                    </div>
                </header>

                <div className="container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<PokemonList />} />
                        {/* Dodaj inne route'y później */}
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;