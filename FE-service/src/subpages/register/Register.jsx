import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const registerSchema = z.object({
    name: z.string().min(3, { message: "Imię musi mieć co najmniej 3 znaki" }),
    email: z.string().email({ message: "Nieprawidłowy format adresu email" }).min(1, { message: "Email jest wymagany" }),
    password: z.string()
        .min(8, { message: "Hasło musi mieć co najmniej 8 znaków" })
        .regex(/[A-Z]/, { message: "Hasło musi zawierać co najmniej jedną dużą literę" })
        .regex(/[0-9]/, { message: "Hasło musi zawierać co najmniej jedną cyfrę" })
        .regex(/[^A-Za-z0-9]/, { message: "Hasło musi zawierać co najmniej jeden znak specjalny" }),
    confirmPassword: z.string().min(1, { message: "Potwierdzenie hasła jest wymagane" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są zgodne",
    path: ["confirmPassword"],
});

const Register = ({ onClose, onSwitchToLogin }) => {
    const { register: registerUser, isLoggedIn, error, isLoading, clearError } = useAuth();
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError: setFormError
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
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
        setRegistrationSuccess(false);
        const { confirmPassword, ...userData } = data;
        try {
            await registerUser(userData);
            setRegistrationSuccess(true);
        } catch (err) {
            if (err.message && err.message.toLowerCase().includes('email już istnieje')) {
                setFormError('email', { type: 'manual', message: err.message });
            }
            // console.error("Registration failed in component:", err); // Usunięto console.error
            // Błąd jest obsługiwany centralnie w AuthContext i wyświetlany przez stan `error`
        }
    };

    const getInputClassName = (fieldName) => clsx(
        "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm",
        "placeholder-pokemon-gray-dark dark:placeholder-gray-400",
        "focus:outline-none focus:ring-pokemon-green focus:border-pokemon-green",
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
            aria-labelledby="register-modal-title"
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

                <h1 id="register-modal-title" className="text-3xl font-bold text-center text-pokemon-green-dark dark:text-pokemon-green mb-6">Rejestracja</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Błąd!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                {registrationSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Sukces!</strong>
                        <span className="block sm:inline"> Rejestracja zakończona pomyślnie. Możesz się teraz zalogować.</span>
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="absolute top-0 bottom-0 right-0 px-4 py-3 text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-white"
                            aria-label="Przejdź do logowania"
                        >
                            <span className="text-xl">→</span>
                        </button>
                    </div>
                )}

                {!registrationSuccess && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label htmlFor="register-name" className="block text-sm font-medium text-pokemon-gray-dark dark:text-pokemon-gray-light mb-1">Imię (min. 3 znaki)</label>
                            <input type="text" id="register-name" {...register("name")} required className={getInputClassName('name')} placeholder="Ash Ketchum" autoComplete='name'/>
                            {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="register-email" className="block text-sm font-medium text-pokemon-gray-dark dark:text-pokemon-gray-light mb-1">Email</label>
                            <input type="email" id="register-email" {...register("email")} required className={getInputClassName('email')} placeholder="ty@pokemon.com" autoComplete='email' />
                            {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="register-password" className="block text-sm font-medium text-pokemon-gray-dark dark:text-pokemon-gray-light mb-1">Hasło (min. 8 znaków, 1 duża litera, 1 cyfra, 1 znak specjalny)</label>
                            <input type="password" id="register-password" {...register("password")} required className={getInputClassName('password')} placeholder="••••••••" autoComplete='new-password' />
                            {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="register-confirmPassword" className="block text-sm font-medium text-pokemon-gray-dark dark:text-pokemon-gray-light mb-1">Potwierdź hasło</label>
                            <input type="password" id="register-confirmPassword" {...register("confirmPassword")} required className={getInputClassName('confirmPassword')} placeholder="••••••••" autoComplete='new-password' />
                            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>}
                        </div>
                        <div>
                            <button type="submit" disabled={isLoading} className={clsx("w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pokemon-green hover:bg-pokemon-green-dark", "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pokemon-green-dark", "disabled:opacity-50 disabled:cursor-not-allowed", "transition-colors duration-150 ease-in-out")}>
                                {isLoading ? 'Rejestrowanie...' : 'Zarejestruj się'}
                            </button>
                        </div>
                    </form>
                )}

                {!registrationSuccess && (
                    <p className="text-center mt-6 text-sm text-pokemon-gray-dark dark:text-pokemon-gray-light">
                        Masz już konto?{' '}
                        <button type="button" onClick={onSwitchToLogin} className="text-pokemon-blue hover:text-pokemon-blue-dark dark:text-pokemon-blue-light dark:hover:text-white font-semibold hover:underline focus:outline-none">
                            Zaloguj się
                        </button>
                    </p>
                )}
                {registrationSuccess && (
                    <p className="text-center mt-6 text-sm text-pokemon-gray-dark dark:text-pokemon-gray-light">
                        <button type="button" onClick={onSwitchToLogin} className="text-pokemon-blue hover:text-pokemon-blue-dark dark:text-pokemon-blue-light dark:hover:text-white font-semibold hover:underline focus:outline-none">
                            Przejdź do logowania
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

Register.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSwitchToLogin: PropTypes.func.isRequired,
};

export default Register;
