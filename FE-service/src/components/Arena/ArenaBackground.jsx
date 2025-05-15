import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import arena1 from "../../assets/arena/arena_1.webp";
import arena2 from "../../assets/arena/arena_2.webp";
import arena3 from "../../assets/arena/arena_3.webp";

const arenas = [arena1, arena2, arena3];

const ArenaBackground = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isBgLoading, setIsBgLoading] = useState(true);

  // Effect for loading background image
  useEffect(() => {
    setIsBgLoading(true);
    const randomIndex = Math.floor(Math.random() * arenas.length);
    const selectedArena = arenas[randomIndex];
    const img = new Image();
    img.onload = () => {
      setBackgroundImage(selectedArena);
      setIsBgLoading(false);
    };
    img.onerror = () => {
      console.warn("Failed to load selected arena background, using fallback.");
      setBackgroundImage(arenas[0]); // Fallback background
      setIsBgLoading(false);
    };
    img.src = selectedArena;
    // Cleanup image loading listeners
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []); // Run only once on mount

  const pageStyle = useMemo(
    () => ({
      backgroundImage:
        !isBgLoading && backgroundImage ? `url(${backgroundImage})` : "none",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      position: "relative",
    }),
    [isBgLoading, backgroundImage],
  );

  return (
    <div
      style={pageStyle}
      className={clsx(
        "arena-page min-h-full flex flex-col items-center justify-center p-4",
        "transition-opacity duration-500 ease-in-out",
        "bg-pokemon-gray-darker", // Fallback background color
      )}
    >
      {/* Loading Overlay for Background */}
      {isBgLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 dark:bg-opacity-80 z-50">
          <div className="text-white dark:text-gray-200 text-2xl font-bold animate-pulse">
            Ładowanie Areny...
          </div>
        </div>
      )}
      {/* Render children only when background is ready (or failed to load) */}
      {!isBgLoading && children}
    </div>
  );
};

ArenaBackground.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ArenaBackground;
