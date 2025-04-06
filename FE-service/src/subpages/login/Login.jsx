import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const loginSchema = z.object({
    email: z.string().email({ message: "Nieprawidłowy format adresu email" }).min(1, { message: "Email jest wymagany" }),
    password: z.string().min(1, { message: "Hasło jest wymagane" }),
});

const Login = ({ onClose, onSwitchToRegister }) => {
    const { login, isLoggedIn, error, isLoading, clearError } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' }
    });

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            onClose();
        }
    }, [isLoggedIn, onClose]);

    useEffect(() => {
        clearError();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (data) => {
        try {
            await login(data);
        } catch (err) {
            // console.error("Login failed in component:", err); // Usunięto console.error
            // Błąd jest obsługiwany centralnie w AuthContext i wyświetlany przez stan `error`
        }
    };

    const getInputClassName = (fieldName) => clsx(
        "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm",
        "placeholder-pokemon-gray-dark dark:placeholder-gray-400",
        "focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue",
        "dark:bg-gray-700 dark:text-white",
        errors[fieldName]
            ? "border-red-500 dark:border-red-400"
            : "border-pokemon-gray-medium dark:border-pokemon-gray-dark hover:border-pokemon-gray-dark dark:hover:border-pokemon-gray-medium",
        "transition-colors duration-150 ease-in-out"
    );

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
        >
            <div
                className={clsx(
                    "rounded-xl shadow-2xl p-6 max-w-md w-full relative transform transition-all duration-300 ease-out",
                    "bg-white dark:bg-pokemon-gray-darker",
                    "max-h-[90vh] overflow-y-auto",
                )}
                onClick={e => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className={clsx(
                        "absolute top-3 right-3 p-1 rounded-full transition-colors",
                        "text-pokemon-gray-dark hover:text-pokemon-gray-darker hover:bg-pokemon-gray-medium",
                        "dark:text-pokemon-gray-light dark:hover:text-pokemon-gray-darker dark:hover:bg-pokemon-gray-dark",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-pokemon-red focus-visible:ring-opacity-50"
                    )}
                    aria-label="Zamknij modal"
                >
                    <XMarkIcon className="h-6 w-6"/>
                </button>

                <h1 id="login-modal-title" className="text-3xl font-bold text-center text-pokemon-blue-dark dark:text-pokemon-blue-light mb-6">Logowanie</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Błąd!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="login-email" className="block text-sm font-medium text-pokemon-gray-dark dark:text-pokemon-gray-light mb-1">Email</label>
                        <input type="email" id="login-email" {...register("email")} required className={getInputClassName('email')} placeholder="ty@pokemon.com" autoComplete='email' />
                        {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-pokemon-gray-dark dark:text-pokemon-gray-light mb-1">Hasło</label>
                        <input type="password" id="login-password" {...register("password")} required className={getInputClassName('password')} placeholder="******" autoComplete='current-password' />
                        {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>}
                    </div>

                    <div>
                        <button type="submit" disabled={isLoading} className={clsx("w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pokemon-yellow hover:bg-pokemon-yellow-dark", "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pokemon-yellow-dark", "disabled:opacity-50 disabled:cursor-not-allowed", "transition-colors duration-150 ease-in-out", "text-pokemon-blue-dark")}>
                            {isLoading ? 'Logowanie...' : 'Zaloguj się'}
                        </button>
                    </div>
                </form>

                <p className="text-center mt-6 text-sm text-pokemon-gray-dark dark:text-pokemon-gray-light">
                    Nie masz konta?{' '}
                    <button type="button" onClick={onSwitchToRegister} className="text-pokemon-blue hover:text-pokemon-blue-dark dark:text-pokemon-blue-light dark:hover:text-white font-semibold hover:underline focus:outline-none">
                        Zarejestruj się
                    </button>
                </p>
            </div>
        </div>
    );
};

Login.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSwitchToRegister: PropTypes.func.isRequired,
};

export default Login;
