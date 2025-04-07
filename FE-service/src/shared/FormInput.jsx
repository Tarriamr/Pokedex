import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {ExclamationCircleIcon} from '@heroicons/react/20/solid';

const FormInput = ({label, name, type = 'text', register, error, placeholder, required = false, ...props}) => {
    const hasError = !!error;

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                {label}
                {required && <span className="text-pokemon-red">*</span>}
            </label>
            <div className="mt-1 relative">
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    {...register(name)} // Rejestracja pola w react-hook-form
                    className={clsx(
                        "block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-colors duration-150 ease-in-out",
                        hasError
                            ? "text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 dark:text-red-400 dark:ring-red-500 dark:placeholder:text-red-400/70 dark:focus:ring-red-600"
                            : "text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-pokemon-blue dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:placeholder:text-gray-400 dark:focus:ring-pokemon-blue-light",
                        "dark:focus:outline-none"
                    )}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                    {...props} // Pozostałe propsy, np. autoComplete
                />
                {hasError && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-600" aria-hidden="true"/>
                    </div>
                )}
            </div>
            {hasError && (
                // Poprawiono ID: usunięto zbędny cudzysłów na końcu
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" id={`${name}-error`}>
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
    register: PropTypes.func.isRequired, // Funkcja z react-hook-form
    error: PropTypes.shape({ // Obiekt błędu z react-hook-form/zod
        message: PropTypes.string,
    }),
    placeholder: PropTypes.string,
    required: PropTypes.bool,
};

export default FormInput;
