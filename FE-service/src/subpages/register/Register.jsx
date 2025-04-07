import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {XMarkIcon} from '@heroicons/react/24/solid';
import {useAuth} from '../../context/AuthContext';
import FormInput from '../../shared/FormInput'; // Import reużywalnego komponentu
import clsx from 'clsx';

const registerSchema = z.object({
    name: z.string().min(3, {message: "Imię musi mieć co najmniej 3 znaki"}),
    email: z.string().email({message: "Nieprawidłowy format adresu email"}).min(1, {message: "Email jest wymagany"}),
    password: z.string()
        .min(8, {message: "Hasło musi mieć co najmniej 8 znaków"})
        .regex(/[A-Z]/, {message: "Hasło musi zawierać co najmniej jedną dużą literę"})
        .regex(/[0-9]/, {message: "Hasło musi zawierać co najmniej jedną cyfrę"})
        .regex(/[^A-Za-z0-9]/, {message: "Hasło musi zawierać co najmniej jeden znak specjalny"}),
    confirmPassword: z.string().min(1, {message: "Potwierdzenie hasła jest wymagane"}),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są zgodne",
    path: ["confirmPassword"], // Błąd dotyczy pola confirmPassword
});

const Register = ({onClose, onSwitchToLogin}) => {
    const {register: registerUser, isLoggedIn, error: authError, isLoading, clearError} = useAuth();
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
        setError: setFormError,
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {name: '', email: '', password: '', confirmPassword: ''}
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

    // Clear auth error on component mount
    useEffect(() => {
        clearError();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (data) => {
        setRegistrationSuccess(false);
        // Usuń confirmPassword przed wysłaniem do API
        const {confirmPassword, ...userData} = data;
        try {
            await registerUser(userData);
            setRegistrationSuccess(true);
            // Nie zamykamy od razu, pokazujemy komunikat sukcesu
        } catch (err) {
            // Obsługa błędu specyficznego dla rejestracji (np. zajęty email)
            if (err.message && err.message.toLowerCase().includes('email already exists')) {
                setFormError('email', {type: 'manual', message: 'Ten adres email jest już zajęty.'});
            } else {
                // Inne błędy są obsługiwane przez globalny stan `authError`
                // Można opcjonalnie dodać logowanie błędu
                // console.error("Registration failed in component:", err);
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

                <h1 id="register-modal-title"
                    className="text-3xl font-bold text-center text-pokemon-green-dark dark:text-pokemon-green mb-6">Rejestracja</h1>

                {/* Globalny błąd z AuthContext (jeśli nie jest to błąd zajętego emaila) */}
                {authError && !errors.email && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4"
                        role="alert">
                        <strong className="font-bold">Błąd!</strong>
                        <span className="block sm:inline"> {authError}</span>
                    </div>
                )}
                {/* Komunikat sukcesu */}
                {registrationSuccess && (
                    <div
                        className="bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200 px-4 py-3 rounded relative mb-4 text-center"
                        role="alert">
                        <strong className="font-bold">Sukces!</strong>
                        <p className="block sm:inline"> Rejestracja zakończona pomyślnie.</p>
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="mt-2 text-pokemon-blue hover:text-pokemon-blue-dark dark:text-pokemon-blue-light dark:hover:text-white font-semibold hover:underline focus:outline-none">
                            Przejdź do logowania
                        </button>
                    </div>
                )}

                {/* Formularz widoczny tylko jeśli nie ma sukcesu */}
                {!registrationSuccess && (
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
                            <button type="submit" disabled={isLoading}
                                    className={clsx("w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pokemon-green hover:bg-pokemon-green-dark", "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pokemon-green-dark", "disabled:opacity-50 disabled:cursor-not-allowed", "transition-colors duration-150 ease-in-out")}>
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Rejestrowanie...
                                    </>
                                ) : 'Zarejestruj się'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Przycisk przełączania widoczny tylko jeśli nie ma sukcesu */}
                {!registrationSuccess && (
                    <p className="text-center mt-6 text-sm text-pokemon-gray-dark dark:text-pokemon-gray-light">
                        Masz już konto?{' '}
                        <button type="button" onClick={onSwitchToLogin}
                                className="text-pokemon-blue hover:text-pokemon-blue-dark dark:text-pokemon-blue-light dark:hover:text-white font-semibold hover:underline focus:outline-none">
                            Zaloguj się
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
