import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

const FormInput = ({
  label,
  name,
  type = "text",
  register,
  error,
  placeholder,
  required = false,
  inputClassName,
  ...props
}) => {
  const hasError = !!error;
  // Destructure out any props that shouldn't be passed to the native input element
  const { defaultValue, ...restProps } = props; // Example: defaultValue might be used by RHF, not the input itself

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-pokemon-red">*</span>}
      </label>
      <div className="mt-1 relative">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          {...register(name)} // Register field with react-hook-form
          className={clsx(
            "block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-colors duration-150 ease-in-out",
            hasError
              ? "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 dark:text-red-400 dark:ring-red-500 dark:placeholder:text-red-400/70 dark:focus:ring-red-600"
              : "text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-pokemon-blue dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:placeholder:text-gray-400 dark:focus:ring-pokemon-blue-light",
            "dark:focus:outline-none",
            inputClassName, // Apply custom classes passed via props
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          {...restProps} // Pass remaining props like `min`, `step`, etc.
        />
        {hasError && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500 dark:text-red-600"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {hasError && (
        <p
          className="mt-1.5 text-sm text-red-600 dark:text-red-400"
          id={`${name}-error`}
        >
          {error.message}
        </p>
      )}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  register: PropTypes.func.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  inputClassName: PropTypes.string,
};

export default FormInput;
