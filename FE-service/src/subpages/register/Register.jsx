import React from 'react';
import {Link} from 'react-router-dom';

const Register = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-10">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-pokemon-gray-medium">
                <h1 className="text-3xl font-bold text-center text-pokemon-green-dark mb-6">Rejestracja</h1>
                {/* Formularz zostanie dodany w następnym kroku (React Hook Form + Zod) */}
                <div
                    className="text-center text-pokemon-gray-darker p-6 border border-dashed border-pokemon-gray-medium rounded-md">
                    Formularz rejestracji (TODO)
                </div>

                <p className="text-center mt-6 text-sm text-pokemon-gray-dark">
                    Masz już konto?{' '}
                    <Link to="/login"
                          className="text-pokemon-blue hover:text-pokemon-blue-dark font-semibold hover:underline">
                        Zaloguj się
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
