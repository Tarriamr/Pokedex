import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const buttonBaseStyle =
  "px-4 py-2 rounded font-semibold text-white shadow transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"; // Dopasowano styl do MainNav

const AuthNav = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="flex space-x-2">
      {" "}
      <button
        type="button"
        onClick={onLoginClick}
        className={clsx(
          buttonBaseStyle,
          "bg-pokemon-blue hover:bg-pokemon-blue-dark focus:ring-pokemon-blue",
        )}
      >
        Logowanie
      </button>
      <button
        type="button"
        onClick={onRegisterClick}
        className={clsx(
          buttonBaseStyle,
          "bg-pokemon-green hover:bg-pokemon-green-dark focus:ring-pokemon-green",
        )}
      >
        Rejestracja
      </button>
    </div>
  );
};

AuthNav.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
};

export default AuthNav;
