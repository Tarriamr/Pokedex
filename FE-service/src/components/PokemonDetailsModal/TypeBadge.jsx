import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

// component for displaying pokemon type labels
// uses dynamic background classes defined in tailwind.config.js
const TypeBadge = ({ type }) => {
  if (!type) return null;

  const typeClass = `bg-pokemon-type-${type.toLowerCase()}`;

  return (
    <span
      className={clsx(
        "px-3 py-1 rounded-full text-xs font-semibold capitalize text-white shadow",
        typeClass,
      )}
    >
      {type}
    </span>
  );
};

TypeBadge.propTypes = {
  type: PropTypes.string.isRequired,
};

export default TypeBadge;
