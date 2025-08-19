import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      await login(formData);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Gradient Background with Grid Pattern */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #191069 0%, #010101 100%)',
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      >
        {/* Additional subtle grid accents */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px'
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="mb-6">
            <img 
              src="/smart_logo.png" 
              alt="Logo" 
              className="mx-auto max-w-full h-auto max-h-16 sm:max-h-20 object-contain drop-shadow-lg" 
            />
          </div>
          <h1 className="text-2xl font-medium mb-2 text-white drop-shadow-lg">
            <span className="font-bold">Smart</span> School
          </h1>
          <p className="text-gray-200">Administrator Login Portal</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191069] focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your email"
                  style={{ color: '#191069' }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#191069] focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your password"
                  style={{ color: '#191069' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-[#191069] focus:ring-offset-2 outline-none shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isLoading ? 'linear-gradient(135deg, #8b8bab 0%, #4a4a4a 100%)' : 'linear-gradient(135deg, #191069 60%, #010101 100%)',
                color: 'white'
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need access? Contact your system administrator
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-300">
            This is a secure administrative portal. All access is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;