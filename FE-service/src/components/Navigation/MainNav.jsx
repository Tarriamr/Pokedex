import React from 'react';
import {Link} from 'react-router-dom';

const MainNav = () => {
    return (
        <div>
            <Link to="/favourites"
                  className="bg-indigo-400 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded mr-2">Ulubione</Link>
            <Link to="/arena"
                  className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded mr-2">Arena</Link>
            <Link to="/ranking"
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded mr-2">Ranking</Link>
            <Link to="/edit"
                  className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded mr-2">Edycja</Link>
            <button className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">Wyloguj</button>
            {/* Funkcjonalność później */}
        </div>
    );
};

export default MainNav;
