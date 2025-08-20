'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Store, User, Settings, PlusCircle, Menu, X } from 'lucide-react';
import { LogoutButton } from './logout-button';
import { User as SupabaseUser, AuthChangeEvent, Session } from '@supabase/supabase-js';

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header ref={menuRef} className="border-b bg-header sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-header/95 w-full">
      <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Store className="h-6 w-6 sm:h-8 sm:w-8 text-header-foreground" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-header-foreground">
              <span className="hidden sm:inline">EmprendimientosCR</span>
              <span className="sm:hidden">EmpCR</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-header-foreground hover:text-primary transition-colors"
            >
              Marketplace
            </Link>
            <Link 
              href="/businesses" 
              className="text-sm font-medium text-header-foreground hover:text-primary transition-colors"
            >
              Emprendimientos
            </Link>
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 lg:mr-2" />
                    <span className="hidden lg:inline">Mi Dashboard</span>
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                        <AvatarFallback>
                          {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
                           user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || 'Usuario'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Mi Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configuración</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <LogoutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <span className="hidden lg:inline">Iniciar Sesión</span>
                    <span className="lg:hidden">Entrar</span>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">
                    <span className="hidden lg:inline">Registrarse</span>
                    <span className="lg:hidden">Registro</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-header-foreground hover:text-primary"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-header/95 backdrop-blur">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <Link 
                  href="/" 
                  className="block py-2 text-sm font-medium text-header-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link 
                  href="/businesses" 
                  className="block py-2 text-sm font-medium text-header-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Emprendimientos
                </Link>
              </nav>

              {/* Mobile User Actions */}
              {user ? (
                <div className="space-y-2 pt-2 border-t">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center py-2 text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Store className="mr-2 h-4 w-4" />
                    Mi Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className="flex items-center py-2 text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                  <Link 
                    href="/settings" 
                    className="flex items-center py-2 text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                  <div className="pt-2">
                    <LogoutButton />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}