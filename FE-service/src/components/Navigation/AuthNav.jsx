import React from 'react';
import PropTypes from 'prop-types'; // Dodano import PropTypes
import clsx from 'clsx';

const buttonBaseStyle = "px-4 py-2 rounded font-semibold text-white shadow transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"; // Dopasowano styl do MainNav

// Odbieramy funkcje jako propsy
const AuthNav = ({onLoginClick, onRegisterClick}) => {
    return (
        <div className="flex space-x-2"> {/* Zmniejszono odstęp do space-x-2 dla spójności z MainNav */}
            {/* Zmieniono Link na button i dodano onClick */}
            <button
                type="button"
                onClick={onLoginClick} // Użycie przekazanej funkcji
                className={clsx(
                    buttonBaseStyle,
                    "bg-pokemon-blue hover:bg-pokemon-blue-dark focus:ring-pokemon-blue"
                )}
            >
                Logowanie
            </button>
            {/* Zmieniono Link na button i dodano onClick */}
            <button
                type="button"
                onClick={onRegisterClick} // Użycie przekazanej funkcji
                className={clsx(
                    buttonBaseStyle,
                    "bg-pokemon-green hover:bg-pokemon-green-dark focus:ring-pokemon-green"
                )}
            >
                Rejestracja
            </button>
        </div>
    );
};

// Dodano walidację propsów
AuthNav.propTypes = {
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
};

export default AuthNav;
