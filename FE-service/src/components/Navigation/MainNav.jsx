import React from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

const MainNav = () => {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
  };

  const getNavLinkClasses = (path) => {
    const isActive = currentPath === path;
    return styles.navLink(isActive, theme);
  };

  return (
    <div className="flex items-center space-x-2">
      <Link
        to="/"
        className={getNavLinkClasses("/")}
        aria-current={currentPath === "/" ? "page" : undefined}
      >
        Pokedex
      </Link>

      <Link
        to="/favourites"
        className={getNavLinkClasses("/favourites")}
        aria-current={currentPath === "/favourites" ? "page" : undefined}
      >
        Ulubione
      </Link>

      <Link
        to="/arena"
        className={getNavLinkClasses("/arena")}
        aria-current={currentPath === "/arena" ? "page" : undefined}
      >
        Arena
      </Link>

      <Link
        to="/ranking"
        className={getNavLinkClasses("/ranking")}
        aria-current={currentPath === "/ranking" ? "page" : undefined}
      >
        Ranking
      </Link>

      <Link
        to="/edit"
        className={getNavLinkClasses("/edit")}
        aria-current={currentPath === "/edit" ? "page" : undefined}
      >
        Edycja
      </Link>

      <button onClick={handleLogout} className={styles.logout(theme)}>
        Wyloguj
      </button>
    </div>
  );
};

export default MainNav;

const styles = {
  buttonBase:
    "px-4 py-2 rounded font-semibold shadow transition-colors duration-200 ease-in-out focus:outline-none text-sm",
  inactiveNavLink:
    "bg-pokemon-yellow text-pokemon-blue-dark hover:bg-pokemon-yellow-dark focus-visible:ring-2 focus-visible:ring-pokemon-yellow focus-visible:ring-offset-1",
  activeNavLinkStyle:
    "bg-pokemon-yellow-dark text-pokemon-blue-dark font-bold ring-2 ring-pokemon-blue-dark ring-offset-1",
  logoutButtonBase: "bg-pokemon-gray-dark text-white",
  logoutButtonHoverFocus:
    "hover:bg-pokemon-gray-darker focus-visible:ring-2 focus-visible:ring-pokemon-gray-dark focus-visible:ring-offset-1",
  buttonOutline: (theme) =>
    theme === "light"
      ? "ring-1 ring-pokemon-blue-dark"
      : "dark:ring-1 dark:ring-pokemon-yellow",

  navLink: (isActive, theme) =>
    clsx(
      styles.buttonBase,
      isActive ? styles.activeNavLinkStyle : styles.inactiveNavLink,
      !isActive && styles.buttonOutline(theme),
    ),

  logout: (theme) =>
    clsx(
      styles.buttonBase,
      styles.logoutButtonBase,
      styles.logoutButtonHoverFocus,
      styles.buttonOutline(theme),
    ),
};
