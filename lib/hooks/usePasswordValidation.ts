import { useState } from 'react';

export interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}

export interface PasswordValidationState {
  isValid: boolean;
  criteria: PasswordCriteria;
  showCriteria: boolean;
  hasBlurred: boolean;
  strength: 'weak' | 'medium' | 'strong';
}

export interface UsePasswordValidationReturn {
  validationState: PasswordValidationState;
  validatePassword: (password: string) => void;
  handleBlur: () => void;
  handleFocus: () => void;
}

const MIN_PASSWORD_LENGTH = 8;

export const usePasswordValidation = (): UsePasswordValidationReturn => {
  const [validationState, setValidationState] = useState<PasswordValidationState>({
    isValid: false,
    criteria: {
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
    },
    showCriteria: false,
    hasBlurred: false,
    strength: 'weak',
  });

  const validatePassword = (password: string) => {
    const criteria: PasswordCriteria = {
      minLength: password.length >= MIN_PASSWORD_LENGTH,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    };

    const validCriteriaCount = Object.values(criteria).filter(Boolean).length;
    const isValid = validCriteriaCount === 4;
    
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (validCriteriaCount >= 4) {
      strength = 'strong';
    } else if (validCriteriaCount >= 2) {
      strength = 'medium';
    }

    setValidationState(prev => ({
      ...prev,
      isValid,
      criteria,
      strength,
      showCriteria: prev.hasBlurred || password.length > 0,
    }));
  };

  const handleBlur = () => {
    setValidationState(prev => ({
      ...prev,
      hasBlurred: true,
      showCriteria: true,
    }));
  };

  const handleFocus = () => {
    setValidationState(prev => ({
      ...prev,
      showCriteria: true,
    }));
  };

  return {
    validationState,
    validatePassword,
    handleBlur,
    handleFocus,
  };
};