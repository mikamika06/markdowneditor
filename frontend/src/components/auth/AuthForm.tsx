import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';

interface AuthFormProps {
    onClose: ()=> void;
}

const authSchema = z.object({
  email: z.email('Incorrect email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

export function AuthForm({ onClose }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { login, register: registerUser, isLoading, error, clearError } = useAuthStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault(); // Запобігаємо стандартній поведінці форми
    clearError();
    console.log('Form submitted with data:', data); // Додаємо лог для діагностики
    
    try {
      if (isLogin) {
        console.log('Attempting login...');
        await login(data);
        console.log('Login successful');
        onClose(); 
      } else {
        console.log('Attempting registration...');
        await registerUser(data);
        console.log('Registration successful');
        
        reset();
        setRegistrationSuccess(true);
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Authentication error occurred:', error);
      // Помилка вже обробляється в store, тому не треба додаткових дій
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="modal-content relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {isLogin ? 'Login' : 'Sign up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {registrationSuccess && (
          <div className="mb-4 text-sm bg-green-50 text-green-700 p-3 rounded">
            Registration successful! Please log in with your new account.
          </div>
        )}
        
        {!isLogin && (
          <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p>Password requirements:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>At least 8 characters</li>
              <li>Less than 100 characters</li>
            </ul>
            <p className="mt-2">Additional information:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Use a strong password with numbers and symbols</li>
              <li>Don't use common passwords</li>
              <li>Your password will be securely encrypted</li>
              <li>You can change your password later in settings</li>
            </ul>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Sign up'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => {
                setIsLogin(!isLogin);
                clearError();
                setRegistrationSuccess(false);
                reset();
            }}
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
