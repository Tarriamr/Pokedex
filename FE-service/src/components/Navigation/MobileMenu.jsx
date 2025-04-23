import React from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Dialog } from "@headlessui/react";
import ThemeToggleButton from "../ThemeToggleButton/ThemeToggleButton.jsx";

// Style linków mobilnych
const mobileLinkBaseStyle =
  "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ease-in-out";
const mobileLinkInactiveStyle =
  "text-pokemon-gray-dark dark:text-pokemon-gray-light hover:bg-pokemon-gray-medium dark:hover:bg-pokemon-gray-dark";
const mobileLinkActiveStyle =
  "bg-pokemon-yellow text-pokemon-blue-dark font-bold";

const MobileMenu = ({
  isOpen,
  onClose,
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getMobileNavLinkClasses = (path) => {
    const isActive = currentPath === path;
    return clsx(
      mobileLinkBaseStyle,
      isActive ? mobileLinkActiveStyle : mobileLinkInactiveStyle,
    );
  };

  const handleLinkClick = (action) => {
    if (action) {
      action();
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-50 md:hidden"
      onClose={onClose}
    >
      {/* Tło */}
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-75"
        aria-hidden="true"
      />

      {/* Kontener dla Panelu */}
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Dialog.Panel className="pointer-events-auto max-w-sm w-full">
              <div className="flex h-full flex-col overflow-y-scroll bg-pokemon-neutral-sand dark:bg-pokemon-gray-darker py-6 shadow-xl">
                {/* Nagłówek Menu */}
                <div className="px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-semibold leading-6 text-pokemon-blue dark:text-pokemon-blue-light">
                      Menu
                    </Dialog.Title>
                    <div className="ml-3 flex h-7 items-center space-x-2">
                      <ThemeToggleButton />
                      <button
                        type="button"
                        className={clsx(
                          "relative rounded-md p-1",
                          "text-pokemon-gray-dark dark:text-pokemon-gray-light",
                          "hover:bg-pokemon-gray-medium dark:hover:bg-pokemon-gray-dark",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-pokemon-yellow focus-visible:ring-offset-2",
                          "transition-colors duration-150 ease-in-out",
                        )}
                        onClick={onClose}
                        aria-label="Zamknij menu"
                      >
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Linki Nawigacyjne */}
                <div className="relative mt-6 flex-1 px-4 sm:px-6 border-t border-pokemon-gray-medium dark:border-pokemon-gray-dark pt-4">
                  <nav className="flex flex-col space-y-1">
                    {/* Link Pokedex - zawsze widoczny */}
                    <Link
                      to="/"
                      className={getMobileNavLinkClasses("/")}
                      onClick={onClose}
                    >
                      Pokedex
                    </Link>

                    {/* Linki/Przyciski zależne od stanu zalogowania */}
                    {isLoggedIn ? (
                      <>
                        {/* Usunięto zduplikowany Link to="/" */}
                        <Link
                          to="/favourites"
                          className={getMobileNavLinkClasses("/favourites")}
                          onClick={onClose}
                        >
                          Ulubione
                        </Link>
                        <Link
                          to="/arena"
                          className={getMobileNavLinkClasses("/arena")}
                          onClick={onClose}
                        >
                          Arena
                        </Link>
                        <Link
                          to="/ranking"
                          className={getMobileNavLinkClasses("/ranking")}
                          onClick={onClose}
                        >
                          Ranking
                        </Link>
                        <Link
                          to="/edit"
                          className={getMobileNavLinkClasses("/edit")}
                          onClick={onClose}
                        >
                          Edycja
                        </Link>
                        <button
                          onClick={() => handleLinkClick(onLogoutClick)}
                          className={clsx(
                            mobileLinkBaseStyle,
                            mobileLinkInactiveStyle,
                            "text-left w-full",
                          )}
                        >
                          Wyloguj
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Usunięto zduplikowany Link to="/" */}
                        <button
                          onClick={() => handleLinkClick(onLoginClick)}
                          className={clsx(
                            mobileLinkBaseStyle,
                            mobileLinkInactiveStyle,
                            "text-left w-full",
                          )}
                        >
                          Logowanie
                        </button>
                        <button
                          onClick={() => handleLinkClick(onRegisterClick)}
                          className={clsx(
                            mobileLinkBaseStyle,
                            mobileLinkInactiveStyle,
                            "text-left w-full",
                          )}
                        >
                          Rejestracja
                        </button>
                      </>
                    )}
                  </nav>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};

export default MobileMenu;
