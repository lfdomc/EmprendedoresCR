"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Función para traducir mensajes de error de Supabase al español
  const translateError = (errorMessage: string): string => {
    const translations: { [key: string]: string } = {
      'User already registered': 'El usuario ya está registrado',
      'Email already registered': 'El email ya está registrado',
      'Signup is disabled': 'El registro está deshabilitado',
      'Email rate limit exceeded': 'Límite de emails excedido',
      'Too many requests': 'Demasiadas solicitudes',
      'Invalid email format': 'Formato de email inválido',
      'Weak password': 'Contraseña débil',
      'Password is too weak': 'La contraseña es muy débil',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
      'Passwords do not match': 'Las contraseñas no coinciden'
    };
    
    return translations[errorMessage] || errorMessage;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError(translateError("Passwords do not match"));
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'https://costaricaemprende.com'}/login`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error";
      setError(translateError(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">Registrarse</CardTitle>
          <CardDescription className="text-sm sm:text-base">Crear una nueva cuenta</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-sm sm:text-base">Contraseña</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password" className="text-sm sm:text-base">
                    <span className="hidden sm:inline">Repetir contraseña</span>
                    <span className="sm:hidden">Confirmar</span>
                  </Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="h-10 sm:h-11"
                />
              </div>
              {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full h-10 sm:h-11" disabled={isLoading}>
                <span className="hidden sm:inline">{isLoading ? "Creando cuenta..." : "Registrarse"}</span>
                <span className="sm:hidden">{isLoading ? "Creando..." : "Crear"}</span>
              </Button>
            </div>
            <div className="mt-4 text-center text-xs sm:text-sm">
              <span className="hidden sm:inline">¿Ya tienes una cuenta? </span>
              <span className="sm:hidden">¿Ya tienes cuenta? </span>
              <Link href="/auth/login" className="underline underline-offset-4">
                <span className="hidden sm:inline">Iniciar sesión</span>
                <span className="sm:hidden">Entrar</span>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
