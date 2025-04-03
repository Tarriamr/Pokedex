import React from 'react';
import {Link} from 'react-router-dom';
import clsx from 'clsx';

const buttonBaseStyle = "px-4 py-2 rounded font-semibold text-white shadow transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50";

const AuthNav = () => {
    return (
        <div className="flex space-x-3">
            <Link
                to="/login"
                className={clsx(
                    buttonBaseStyle,
                    "bg-pokemon-blue hover:bg-pokemon-blue-dark focus:ring-pokemon-blue"
                )}
            >
                Logowanie
            </Link>
            <Link
                to="/register"
                className={clsx(
                    buttonBaseStyle,
                    "bg-pokemon-green hover:bg-pokemon-green-dark focus:ring-pokemon-green"
                )}
            >
                Rejestracja
            </Link>
        </div>
    );
};

export default AuthNav;
