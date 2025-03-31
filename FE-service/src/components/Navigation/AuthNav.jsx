import React from 'react';
import {Link} from 'react-router-dom';

const AuthNav = () => {
    return (
        <div>
            <Link to="/login"
                  className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2">Logowanie</Link>
            <Link to="/register"
                  className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded">Rejestracja</Link>
        </div>
    );
};

export default AuthNav;
