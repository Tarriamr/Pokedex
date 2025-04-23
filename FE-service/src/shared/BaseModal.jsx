import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/24/solid";

const BaseModal = ({
  onClose,
  title,
  children,
  footerContent,
  imageUrl,
  imageAlt = "Image",
  headerActions, // Actions on the left
  maxWidth = "max-w-md",
}) => {
  // Effect to handle Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Effect to handle background scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={clsx(
          "bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full transform transition-all duration-300 ease-in-out max-h-[90vh] flex flex-col",
          maxWidth,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Area - 3 Element Layout */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          {/* Element 1: Left Actions */}
          <div className="flex items-center justify-start space-x-2 flex-shrink-0 min-w-[80px]">
            {headerActions}
          </div>

          {/* Element 2: Center Content (Image + Title) */}
          <div className="flex-grow flex flex-col items-center mx-2">
            {imageUrl && (
              <div>
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="h-32 w-32 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/src/assets/pokeball.svg";
                  }}
                />
              </div>
            )}
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-bold text-center text-pokemon-gray-darker dark:text-pokemon-gray-light"
              >
                {title}
              </h2>
            )}
          </div>

          {/* Element 3: Right Close Button */}
          <div className="flex items-center justify-end flex-shrink-0 min-w-[80px]">
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pokemon-red"
              aria-label="Zamknij modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) - Reduced padding from p-6 to p-4 */}
        <div className="p-4 overflow-y-auto flex-grow">{children}</div>

        {/* Modal Footer (Optional) */}
        {footerContent && (
          <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
};

BaseModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footerContent: PropTypes.node,
  imageUrl: PropTypes.string,
  imageAlt: PropTypes.string,
  headerActions: PropTypes.node, // Actions on the left
  maxWidth: PropTypes.string,
};

export default BaseModal;
