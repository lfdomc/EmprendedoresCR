'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEmailValidation } from '@/lib/hooks/useEmailValidation';
import { usePasswordValidation } from '@/lib/hooks/usePasswordValidation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface AuthFormProps {
  redirectTo?: string;
  initialTab?: 'login' | 'signup';
}

export function AuthForm({ redirectTo = '/dashboard', initialTab = 'login' }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Hook para validación de email en tiempo real
  const { validationState, validateEmail, handleBlur, handleFocus } = useEmailValidation(800);
  
  // Hook para validación de contraseña en tiempo real
  const { validationState: passwordValidation, validatePassword, handleBlur: handlePasswordBlur, handleFocus: handlePasswordFocus } = usePasswordValidation();

  // Estados para mantener los valores de los formularios
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Estado para validación de confirmación de contraseña
  const [confirmPasswordState, setConfirmPasswordState] = useState({
    isValid: false,
    showError: false,
    hasBlurred: false
  });

  // Efecto para revalidar confirmación de contraseña cuando cambie la contraseña principal
  useEffect(() => {
    if (signupForm.confirmPassword.length > 0) {
      const isValid = signupForm.confirmPassword === signupForm.password;
      setConfirmPasswordState(prev => ({
        ...prev,
        isValid,
        showError: prev.hasBlurred && !isValid
      }));
    }
  }, [signupForm.password, signupForm.confirmPassword]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { email, password } = loginForm;

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        toast.success('¡Bienvenido de vuelta!');
        // Solo limpiar el formulario cuando el login sea exitoso
        setLoginForm({ email: '', password: '' });
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { email, password, confirmPassword, fullName } = signupForm;

    // Validaciones básicas
    if (!email || !password || !confirmPassword || !fullName) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      setIsLoading(false);
      return;
    }

    // Verificar si el email ya existe usando el estado de validación
    if (validationState.exists) {
      setError('Este email ya está registrado. Por favor inicia sesión o usa otro email.');
      setIsLoading(false);
      return;
    }

    // Verificar que la validación de email sea válida
    if (!validationState.isValid) {
      setError('Por favor verifica que el email sea válido y esté disponible.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    // Validación de seguridad de contraseña
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
      setIsLoading(false);
      return;
    }

    try {
      // Nota: Supabase maneja automáticamente la verificación de usuarios duplicados
      // durante el proceso de signUp, por lo que no necesitamos verificación previa

      // Intentar crear la cuenta
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        // Log del error para debugging
        console.log('Supabase signup error:', error);
        console.log('Error message:', error.message);
        console.log('Error code:', error.status);
        
        // Manejar errores específicos de Supabase
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('user already registered') || 
            errorMessage.includes('already been registered') ||
            errorMessage.includes('email address is already registered') ||
            errorMessage.includes('already registered') ||
            errorMessage.includes('duplicate') ||
            errorMessage.includes('already exists') ||
            errorMessage.includes('user with this email already exists') ||
            error.status === 422) {
          setError('Este email ya está registrado. Por favor inicia sesión o usa otro email.');
        } else if (errorMessage.includes('invalid email') || 
                   errorMessage.includes('email format')) {
          setError('El formato del email no es válido.');
        } else if (errorMessage.includes('password') && 
                   (errorMessage.includes('weak') || errorMessage.includes('short'))) {
          setError('La contraseña no cumple con los requisitos de seguridad.');
        } else if (errorMessage.includes('rate limit') || 
                   errorMessage.includes('too many')) {
          setError('Demasiados intentos. Por favor espera unos minutos antes de intentar de nuevo.');
        } else {
          setError(`Error: ${error.message}`);
        }
      } else {
        // Verificar si realmente se creó una nueva cuenta
        // Cuando enable_confirmations = false, Supabase puede devolver un usuario
        // exitoso incluso para emails duplicados sin crear una nueva cuenta
        console.log('Signup response data:', data);
        
        if (data?.user) {
          // Verificar si el usuario fue creado recientemente (menos de 10 segundos)
          const userCreatedAt = new Date(data.user.created_at);
          const now = new Date();
          const timeDiff = (now.getTime() - userCreatedAt.getTime()) / 1000; // diferencia en segundos
          
          console.log('User created at:', userCreatedAt);
          console.log('Current time:', now);
          console.log('Time difference (seconds):', timeDiff);
          
          if (timeDiff > 10) {
            // El usuario fue creado hace más de 10 segundos, probablemente es un email duplicado
            setError('Este email ya está registrado. Por favor inicia sesión o usa otro email.');
          } else {
            // Usuario creado exitosamente
            toast.success('¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta.');
            // Solo limpiar el formulario cuando el registro sea exitoso
            setSignupForm({ fullName: '', email: '', password: '', confirmPassword: '' });
            setActiveTab('login');
          }
        } else {
          setError('Error inesperado al crear la cuenta. Inténtalo de nuevo.');
        }
      }
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Costa Rica Emprende</CardTitle>
          <CardDescription>
            Únete a la comunidad de emprendedores de Costa Rica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10"
                      required
                      disabled={isLoading}
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      required
                      disabled={isLoading}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      disabled={isLoading}
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Iniciar Sesión
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="Tu nombre completo"
                      className="pl-10"
                      required
                      disabled={isLoading}
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      className={`pl-10 pr-10 ${
                        validationState.showError && validationState.error ? 'border-red-500 focus:border-red-500' : 
                        validationState.isValid ? 'border-green-500 focus:border-green-500' : ''
                      }`}
                      required
                      disabled={isLoading}
                      value={signupForm.email}
                      onChange={(e) => {
                        const email = e.target.value;
                        setSignupForm(prev => ({ ...prev, email }));
                        validateEmail(email);
                      }}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                    />
                    {/* Indicador de estado */}
                    <div className="absolute right-3 top-3 h-4 w-4">
                      {validationState.isChecking && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {!validationState.isChecking && validationState.isValid && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {!validationState.isChecking && validationState.showError && validationState.error && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {/* Mensaje de error/estado */}
                   {validationState.showError && validationState.error && (
                     <p className="text-sm text-red-500 mt-1">
                       {validationState.error}
                     </p>
                   )}
                  {validationState.isValid && signupForm.email && (
                     <p className="text-sm text-green-500 mt-1">
                       Formato de Email correcto
                     </p>
                   )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      name="password"
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-20 ${
                        passwordValidation.showCriteria && !passwordValidation.isValid ? 'border-red-500 focus:border-red-500' : 
                        passwordValidation.isValid ? 'border-green-500 focus:border-green-500' : ''
                      }`}
                      required
                      disabled={isLoading}
                      value={signupForm.password}
                      onChange={(e) => {
                        const password = e.target.value;
                        setSignupForm(prev => ({ ...prev, password }));
                        validatePassword(password);
                      }}
                      onBlur={handlePasswordBlur}
                      onFocus={handlePasswordFocus}
                    />
                    {/* Botón de mostrar/ocultar contraseña */}
                    <button
                      type="button"
                      className="absolute right-10 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      disabled={isLoading}
                    >
                      {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {/* Indicador de estado de contraseña */}
                    <div className="absolute right-3 top-3 h-4 w-4">
                      {passwordValidation.isValid && signupForm.password && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {passwordValidation.showCriteria && !passwordValidation.isValid && signupForm.password && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {/* Criterios de validación de contraseña */}
                  {passwordValidation.showCriteria && signupForm.password && (
                    <div className="mt-2 space-y-1">
                      {passwordValidation.isValid ? (
                        <p className="text-sm text-green-500">
                          Formato de contraseña correcto
                        </p>
                      ) : (
                        <div className="text-sm space-y-1">
                          <p className="text-muted-foreground mb-1">La contraseña debe tener:</p>
                          <div className="grid grid-cols-1 gap-1">
                            <div className={`flex items-center gap-2 ${
                              passwordValidation.criteria.minLength ? 'text-green-600' : 'text-red-500'
                            }`}>
                              {passwordValidation.criteria.minLength ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              <span>Al menos 8 caracteres</span>
                            </div>
                            <div className={`flex items-center gap-2 ${
                              passwordValidation.criteria.hasUppercase ? 'text-green-600' : 'text-red-500'
                            }`}>
                              {passwordValidation.criteria.hasUppercase ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              <span>Una letra mayúscula</span>
                            </div>
                            <div className={`flex items-center gap-2 ${
                              passwordValidation.criteria.hasLowercase ? 'text-green-600' : 'text-red-500'
                            }`}>
                              {passwordValidation.criteria.hasLowercase ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              <span>Una letra minúscula</span>
                            </div>
                            <div className={`flex items-center gap-2 ${
                              passwordValidation.criteria.hasNumber ? 'text-green-600' : 'text-red-500'
                            }`}>
                              {passwordValidation.criteria.hasNumber ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              <span>Un número</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-20 ${
                        confirmPasswordState.showError && !confirmPasswordState.isValid ? 'border-red-500 focus:border-red-500' : 
                        confirmPasswordState.isValid && signupForm.confirmPassword ? 'border-green-500 focus:border-green-500' : ''
                      }`}
                      required
                      disabled={isLoading}
                      value={signupForm.confirmPassword}
                      onChange={(e) => {
                        const confirmPassword = e.target.value;
                        setSignupForm(prev => ({ ...prev, confirmPassword }));
                        
                        // Validar coincidencia de contraseñas
                        const isValid = confirmPassword === signupForm.password && confirmPassword.length > 0;
                        setConfirmPasswordState(prev => ({
                          ...prev,
                          isValid,
                          showError: prev.hasBlurred && !isValid && confirmPassword.length > 0
                        }));
                      }}
                      onBlur={() => {
                        setConfirmPasswordState(prev => ({
                          ...prev,
                          hasBlurred: true,
                          showError: !prev.isValid && signupForm.confirmPassword.length > 0
                        }));
                      }}
                      onFocus={() => {
                        setConfirmPasswordState(prev => ({
                          ...prev,
                          showError: prev.hasBlurred && !prev.isValid && signupForm.confirmPassword.length > 0
                        }));
                      }}
                    />
                    {/* Botón de mostrar/ocultar contraseña */}
                    <button
                      type="button"
                      className="absolute right-10 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {/* Indicador de estado de confirmación de contraseña */}
                    <div className="absolute right-3 top-3 h-4 w-4">
                      {confirmPasswordState.isValid && signupForm.confirmPassword && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {confirmPasswordState.showError && !confirmPasswordState.isValid && signupForm.confirmPassword && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {/* Mensaje de validación de confirmación de contraseña */}
                  {confirmPasswordState.showError && !confirmPasswordState.isValid && signupForm.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      Las contraseñas no coinciden
                    </p>
                  )}
                  {confirmPasswordState.isValid && signupForm.confirmPassword && (
                    <p className="text-sm text-green-500 mt-1">
                      Las contraseñas coinciden
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || validationState.exists || validationState.isChecking || (!!signupForm.email && !validationState.isValid) || (!!signupForm.password && !passwordValidation.isValid) || (!!signupForm.confirmPassword && !confirmPasswordState.isValid)}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear Cuenta
                </Button>
              </form>
            </TabsContent>


          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}