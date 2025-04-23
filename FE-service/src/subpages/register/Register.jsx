import React, { useEffect } from 'react'; // Removed useState
import PropTypes from 'prop-types'; // Keep PropTypes for component definition
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext.jsx';
import FormInput from '../../shared/FormInput';
import clsx from 'clsx';

// Zod schema remains the same
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
    // Removed clearError from destructuring
    const { register: registerUser, isLoggedIn, isLoading } = useAuth();
    // Removed registrationSuccess state

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError: setFormError,
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
    });

    // Effect for body overflow
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    // Effect to close modal if user becomes logged in
    useEffect(() => {
        if (isLoggedIn) {
            onClose();
        }
    }, [isLoggedIn, onClose]);

    // Removed the useEffect block that called clearError()

    const onSubmit = async (data) => {
        const { confirmPassword, ...userData } = data;
        try {
            await registerUser(userData);
            // Assume success, show Notistack from AuthContext, then switch to Login
            onSwitchToLogin(); // Automatically switch to login view after successful registration
        } catch (err) {
            // Handle specific "email exists" error locally
            if (err.message && err.message.toLowerCase().includes('email already exists')) {
                setFormError('email', { type: 'manual', message: 'Ten adres email jest już zajęty.' });
            } else {
                // Other errors are handled by Notistack in AuthContext
            }
        }
    };

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

                {/* Removed Auth Error display and Success message display */}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormInput
                        label="Imię"
                        name="name"
                        register={register}
                        error={errors.name}
                        placeholder="Ash Ketchum"
                        autoComplete="name"
                        required
                    />
                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        register={register}
                        error={errors.email} // Will show "email exists" error if set
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
                        placeholder="min. 8 znaków, A-Z, 0-9, !@#..."
                        autoComplete="new-password"
                        required
                    />
                    <FormInput
                        label="Potwierdź hasło"
                        name="confirmPassword"
                        type="password"
                        register={register}
                        error={errors.confirmPassword}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                    />

                    <div>
                        <button type="submit" disabled={isLoading} className={clsx("w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pokemon-green hover:bg-pokemon-green-dark", "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pokemon-green-dark", "disabled:opacity-50 disabled:cursor-not-allowed", "transition-colors duration-150 ease-in-out")}>
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Rejestrowanie...
                                </>
                            ) : 'Zarejestruj się'}
                        </button>
                    </div>
                </form>

                <p className="text-center mt-6 text-sm text-pokemon-gray-dark dark:text-pokemon-gray-light">
                    Masz już konto?{' '}
                    <button type="button" onClick={onSwitchToLogin} className="text-pokemon-blue hover:text-pokemon-blue-dark dark:text-pokemon-blue-light dark:hover:text-white font-semibold hover:underline focus:outline-none">
                        Zaloguj się
                    </button>
                </p>

            </div>
        </div>
    );
};

Register.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSwitchToLogin: PropTypes.func.isRequired,
};

export default Register;
