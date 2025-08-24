import { useState, useEffect, useCallback } from 'react';
import { checkEmailExists } from '@/lib/supabase/database';

interface EmailValidationState {
  isValid: boolean;
  isChecking: boolean;
  error: string | undefined;
  exists: boolean;
  showError: boolean;
  hasBlurred: boolean;
}

interface UseEmailValidationReturn {
  validationState: EmailValidationState;
  validateEmail: (email: string) => void;
  clearValidation: () => void;
  handleBlur: () => void;
  handleFocus: () => void;
}

export function useEmailValidation(debounceMs: number = 500): UseEmailValidationReturn {
  const [validationState, setValidationState] = useState<EmailValidationState>({
    isValid: false,
    isChecking: false,
    error: undefined,
    exists: false,
    showError: false,
    hasBlurred: false,
  });

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const validateEmail = useCallback((email: string) => {
    // Limpiar timer anterior
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Si el email está vacío, limpiar validación
    if (!email || !email.trim()) {
      setValidationState(prev => ({
        ...prev,
        isValid: false,
        isChecking: false,
        error: undefined,
        exists: false,
        showError: false,
      }));
      return;
    }

    // Validación básica de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationState(prev => ({
        ...prev,
        isValid: false,
        isChecking: false,
        error: 'Formato de email inválido',
        exists: false,
        showError: prev.hasBlurred,
      }));
      return;
    }

    // Establecer estado de verificación
    setValidationState(prev => ({
      ...prev,
      isChecking: true,
      error: undefined,
    }));

    // Crear nuevo timer con debounce
    const timer = setTimeout(async () => {
      try {
        const result = await checkEmailExists(email);
        
        if (result.error) {
          setValidationState(prev => ({
            ...prev,
            isValid: false,
            isChecking: false,
            error: result.error,
            exists: false,
            showError: prev.hasBlurred,
          }));
          return;
        }

        if (result.exists) {
          setValidationState(prev => ({
            ...prev,
            isValid: false,
            isChecking: false,
            error: 'Este email ya está registrado',
            exists: true,
            showError: prev.hasBlurred,
          }));
        } else {
          setValidationState(prev => ({
            ...prev,
            isValid: true,
            isChecking: false,
            error: undefined,
            exists: false,
            showError: false,
          }));
        }
      } catch (error) {
        console.error('Error validating email:', error);
        setValidationState(prev => ({
          ...prev,
          isValid: false,
          isChecking: false,
          error: 'Error al verificar email',
          exists: false,
          showError: prev.hasBlurred,
        }));
      }
    }, debounceMs);

    setDebounceTimer(timer);
  }, [debounceMs, debounceTimer]);

  const clearValidation = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }
    setValidationState({
      isValid: false,
      isChecking: false,
      error: undefined,
      exists: false,
      showError: false,
      hasBlurred: false,
    });
  }, [debounceTimer]);

  const handleBlur = useCallback(() => {
    setValidationState(prev => ({
      ...prev,
      hasBlurred: true,
      showError: prev.error !== undefined,
    }));
  }, []);

  const handleFocus = useCallback(() => {
    setValidationState(prev => ({
      ...prev,
      showError: false,
    }));
  }, []);

  // Limpiar timer al desmontar el componente
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    validationState,
    validateEmail,
    clearValidation,
    handleBlur,
    handleFocus,
  };
}