import React, { useState } from 'react';
import { validatePassword, getPasswordStrength } from '../utils/passwordValidation';

const PasswordInput = ({ 
  value, 
  onChange, 
  onValidationChange, 
  placeholder = "••••••••", 
  label = "Password",
  showValidation = false,
  required = true,
  name = "password"
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState({ isValid: false, errors: [] });
  const [strength, setStrength] = useState({ level: 'weak', color: 'red' });

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    onChange(e);
    
    if (showValidation && password) {
      const validationResult = validatePassword(password);
      const strengthResult = getPasswordStrength(password);
      
      setValidation(validationResult);
      setStrength(strengthResult);
      
      if (onValidationChange) {
        onValidationChange(validationResult);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getStrengthColor = () => {
    switch (strength.color) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          value={value}
          onChange={handlePasswordChange}
          required={required}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder={placeholder}
        />
        
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {showValidation && value && (
        <div className="mt-2">
          <div className="flex items-center space-x-2 mb-1">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: `${(strength.level === 'weak' ? 1 : strength.level === 'fair' ? 2 : strength.level === 'good' ? 3 : 4) * 25}%` }}
              ></div>
            </div>
            <span className={`text-xs font-medium ${
              strength.color === 'red' ? 'text-red-600' :
              strength.color === 'yellow' ? 'text-yellow-600' :
              strength.color === 'blue' ? 'text-blue-600' :
              'text-green-600'
            }`}>
              {strength.level}
            </span>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {showValidation && validation.errors.length > 0 && (
        <div className="mt-2 space-y-1">
          {validation.errors.map((error, index) => (
            <p key={index} className="text-xs text-red-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Success Message */}
      {showValidation && value && validation.isValid && (
        <p className="text-xs text-green-600 flex items-center mt-2">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Password meets all requirements
        </p>
      )}
    </div>
  );
};

export default PasswordInput; 