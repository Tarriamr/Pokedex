import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext.jsx';
import FormInput from '../../shared/FormInput';
import clsx from 'clsx';

const loginSchema = z.object({
    email: z.string().email({ message: "Nieprawidłowy format adresu email" }).min(1, { message: "Email jest wymagany" }),
    password: z.string().min(1, { message: "Hasło jest wymagane" }),
});

const Login = ({ onClose, onSwitchToRegister }) => {
    // Removed clearError from destructuring as it's no longer provided by useAuth
    const { login, isLoggedIn, isLoading } = useAuth();

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

    // Removed the useEffect block that called clearError()

    const onSubmit = async (data) => {
        try {
            await login(data);
        } catch (err) {
            // Obsługa błędów odbywa się w AuthContext za pomocą Notistack
        }
    };

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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        register={register}
                        error={errors.email}
                        placeholder="ty@pokemon.com"
                        autoComplete="email"
                        required
                    />
                    <FormInput
                        label="Hasło"
                        name="password"
                        type="password"
                        register={register}
                        error={errors.password}
                        placeholder="******"
                        autoComplete="current-password"
                        required
                    />

                    <div>
                        <button type="submit" disabled={isLoading} className={clsx("w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pokemon-yellow hover:bg-pokemon-yellow-dark", "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pokemon-yellow-dark", "disabled:opacity-50 disabled:cursor-not-allowed", "transition-colors duration-150 ease-in-out", "text-pokemon-blue-dark")}>
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-pokemon-blue-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logowanie...
                                </>
                            ) : 'Zaloguj się'}
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
