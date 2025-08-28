'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { SafeLink as Link } from '@/components/ui/safe-link';
import Image from 'next/image';
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
import { Store, User, Settings, PlusCircle, Menu, X, Home, Building2 } from 'lucide-react';
import { LogoutButton } from './logout-button';
import { User as SupabaseUser, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';

function HeaderComponent() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const supabase = createClient();

  // Optimized user fetching with loading state
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Optimized menu close handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, handleClickOutside]);

  return (
    <header ref={menuRef} className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/95 w-full" role="banner">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md"
            aria-label="Costa Rica Emprende - Ir al inicio"
          >
              <Image
                src="/logonew.webp"
                alt="Costa Rica Emprende Logo"
                width={40}
                height={40}
                priority
                className="h-10 w-10 object-contain"
              />
            <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
              <span>Costa Rica </span>
              <span className="text-orange-500">Emprende</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" role="navigation" aria-label="Navegación principal">
            <Link 
              href="/" 
              className={`text-sm font-normal transition-colors py-1.5 px-2 rounded flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:ring-offset-1 ${
                pathname === '/' || pathname === '/marketplace'
                  ? 'text-orange-500 bg-orange-25'
                  : 'text-gray-500 hover:text-orange-400 hover:bg-gray-50'
              }`}
              aria-current={pathname === '/' || pathname === '/marketplace' ? 'page' : undefined}
              aria-label="Ir al Marketplace"
            >
              <Home className="h-3 w-3" aria-hidden="true" />
              Marketplace
            </Link>
            <Link 
              href="/businesses" 
              className={`text-sm font-normal transition-colors py-1.5 px-2 rounded flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:ring-offset-1 ${
                pathname === '/businesses'
                  ? 'text-orange-500 bg-orange-25'
                  : 'text-gray-500 hover:text-orange-400 hover:bg-gray-50'
              }`}
              aria-current={pathname === '/businesses' ? 'page' : undefined}
              aria-label="Ir a Emprendimientos"
            >
              <Building2 className="h-3 w-3" aria-hidden="true" />
              Emprendimientos
            </Link>
            <Link 
              href="/emprendedores" 
              className={`text-sm font-normal transition-colors py-1.5 px-2 rounded flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:ring-offset-1 ${
                pathname === '/emprendedores'
                  ? 'text-orange-500 bg-orange-25'
                  : 'text-gray-500 hover:text-orange-400 hover:bg-gray-50'
              }`}
              aria-current={pathname === '/emprendedores' ? 'page' : undefined}
              aria-label="Información para Emprendedores"
            >
              <User className="h-3 w-3" aria-hidden="true" />
              Para Emprendedores
            </Link>
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            ) : user ? (
              <>
                <Link href="/dashboard">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:border-orange-300 hover:text-orange-600"
                  >
                    <PlusCircle className="h-4 w-4 lg:mr-2" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                        <AvatarFallback className="bg-orange-500 text-white text-sm">
                          {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
                           user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-gray-900">
                          {user.user_metadata?.full_name || 'Usuario'}
                        </p>
                        <p className="text-xs leading-none text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Mi Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center cursor-pointer">
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
              <div className="flex items-center gap-3">
                <Link href="/auth/register?tab=login">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-500 hover:bg-gray-50 border border-gray-300 text-center justify-center">
                    <span className="hidden lg:inline">Iniciar Sesión</span>
                    <span className="lg:hidden">Entrar</span>
                  </Button>
                </Link>
                <Link href="/auth/register?tab=signup">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
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
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:text-orange-600 border border-gray-300 flex items-center justify-center"
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-1" role="navigation" aria-label="Navegación móvil">
                <Link 
                  href="/" 
                  className={`flex items-center gap-2 text-sm font-normal transition-colors py-2 px-2 rounded ${
                    pathname === '/' || pathname === '/marketplace'
                      ? 'text-orange-500 bg-orange-25'
                      : 'text-gray-600 hover:text-orange-400 hover:bg-gray-50'
                  }`}
                  onClick={closeMenu}
                  aria-current={pathname === '/' || pathname === '/marketplace' ? 'page' : undefined}
                >
                  <Home className="h-4 w-4" />
                  Marketplace
                </Link>
                <Link 
                  href="/businesses" 
                  className={`flex items-center gap-2 text-sm font-normal transition-colors py-2 px-2 rounded ${
                    pathname === '/businesses'
                      ? 'text-orange-500 bg-orange-25'
                      : 'text-gray-600 hover:text-orange-400 hover:bg-gray-50'
                  }`}
                  onClick={closeMenu}
                  aria-current={pathname === '/businesses' ? 'page' : undefined}
                >
                  <Building2 className="h-4 w-4" />
                  Emprendimientos
                </Link>
                <Link 
                  href="/emprendedores" 
                  className={`flex items-center gap-2 text-sm font-normal transition-colors py-2 px-2 rounded ${
                    pathname === '/emprendedores'
                      ? 'text-orange-500 bg-orange-25'
                      : 'text-gray-600 hover:text-orange-400 hover:bg-gray-50'
                  }`}
                  onClick={closeMenu}
                  aria-current={pathname === '/emprendedores' ? 'page' : undefined}
                >
                  <User className="h-4 w-4" />
                  Para Emprendedores
                </Link>
              </div>

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-1">
                    <Link 
                      href="/dashboard" 
                      className={`flex items-center gap-3 text-base font-medium transition-colors py-3 px-2 rounded-md ${
                        pathname === '/dashboard'
                          ? 'text-orange-600 bg-orange-50 border-l-4 border-orange-500'
                          : 'text-gray-900 hover:text-orange-500 hover:bg-gray-50'
                      }`}
                      onClick={closeMenu}
                      aria-current={pathname === '/dashboard' ? 'page' : undefined}
                    >
                      <Store className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link 
                      href="/profile" 
                      className={`flex items-center gap-3 text-base font-medium transition-colors py-3 px-2 rounded-md ${
                        pathname === '/profile'
                          ? 'text-orange-600 bg-orange-50 border-l-4 border-orange-500'
                          : 'text-gray-900 hover:text-orange-500 hover:bg-gray-50'
                      }`}
                      onClick={closeMenu}
                      aria-current={pathname === '/profile' ? 'page' : undefined}
                    >
                      <User className="h-5 w-5" />
                      Perfil
                    </Link>
                    <Link 
                      href="/settings" 
                      className={`flex items-center gap-3 text-base font-medium transition-colors py-3 px-2 rounded-md ${
                        pathname === '/settings'
                          ? 'text-orange-600 bg-orange-50 border-l-4 border-orange-500'
                          : 'text-gray-900 hover:text-orange-500 hover:bg-gray-50'
                      }`}
                      onClick={closeMenu}
                      aria-current={pathname === '/settings' ? 'page' : undefined}
                    >
                      <Settings className="h-5 w-5" />
                      Configuración
                    </Link>
                    <div className="pt-3">
                      <LogoutButton />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Link href="/auth/register?tab=login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-center text-gray-700 hover:text-orange-500 hover:bg-gray-50 border border-gray-300">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/auth/register?tab=signup" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        Registrarse
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export const Header = memo(HeaderComponent);