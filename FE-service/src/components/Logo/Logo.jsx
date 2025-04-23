import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useTheme } from "../../context/ThemeContext.jsx";

// Importujemy ścieżkę do logo
import pokemonLogo from "../../assets/pokémon_logo.svg";

const Logo = () => {
  const { theme } = useTheme();

  return (
    <Link
      to="/"
      // Klasy cienia zostają na linku, aby otaczał obrazek
      className={clsx(
        "inline-block", // Zmieniono z tekstu na inline-block dla linku
        theme === "light"
          ? "drop-shadow-[1px_1px_2px_rgba(42,117,187,0.7)]"
          : "drop-shadow-[1px_1px_2px_rgba(255,203,5,0.6)]",
      )}
      aria-label="Pokémon Logo - Strona główna"
    >
      {/* Zastąpiono tekst obrazkiem */}
      <img
        src={pokemonLogo}
        alt="Pokémon Logo"
        // Zwiększono wysokość dla widoku desktopowego do h-14
        className="h-10 md:h-14 w-auto"
      />
    </Link>
  );
};

export default Logo;
