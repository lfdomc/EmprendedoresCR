import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Shield, Settings, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Business, Category } from '@/lib/types/database';

// Tipo para business con categoría incluida
type BusinessWithCategory = Business & {
  categories?: Category | null;
};

export default async function SettingsPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Obtener información del negocio del usuario
  const { data: business }: { data: BusinessWithCategory | null } = await supabase
    .from('businesses')
    .select(`
      *,
      categories (
        id,
        name,
        description,
        icon
      )
    `)
    .eq('user_id', user.id)
    .single();

  const userInitials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Configuración
            </h1>
            <p className="text-muted-foreground mt-1">
              Administra tu cuenta y preferencias
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              Volver al Dashboard
            </Button>
          </Link>
        </div>

        {/* Información de la Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información de la Cuenta
            </CardTitle>
            <CardDescription>
              Detalles de tu cuenta y perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">
                  {user.user_metadata?.full_name || 'Usuario'}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Miembro desde {formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Estado de la Cuenta
                </h4>
                <div className="flex items-center gap-2">
                  <Badge variant={user.email_confirmed_at ? 'default' : 'secondary'}>
                    {user.email_confirmed_at ? 'Email Verificado' : 'Email Pendiente'}
                  </Badge>
                  <Badge variant="outline">
                    {user.role || 'Usuario'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Último Acceso</h4>
                <p className="text-sm text-muted-foreground">
                  {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Nunca'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado del Emprendimiento */}
        <Card>
          <CardHeader>
            <CardTitle>Mi Emprendimiento</CardTitle>
            <CardDescription>
              Estado y configuración de tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {business ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{business.name}</h3>
                    <p className="text-muted-foreground">{business.description}</p>
                  </div>
                  <Badge variant="default">Activo</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Categoría:</span>
                    <p className="text-muted-foreground">{business.categories?.name || 'No especificada'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Ubicación:</span>
                    <p className="text-muted-foreground">{business.address || 'No especificada'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Teléfono:</span>
                    <p className="text-muted-foreground">{business.phone || 'No especificado'}</p>
                  </div>
                  <div>
                    <span className="font-medium">WhatsApp:</span>
                    <p className="text-muted-foreground">{business.whatsapp || 'No especificado'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      Editar Emprendimiento
                    </Button>
                  </Link>
                  <Link href={`/businesses/${business.id}`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Perfil Público
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Aún no has configurado tu emprendimiento
                </p>
                <Link href="/dashboard">
                  <Button>
                    Configurar Mi Emprendimiento
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acciones de Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones de Cuenta</CardTitle>
            <CardDescription>
              Gestiona tu cuenta y seguridad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/auth/update-password">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
              </Link>
              
              <Link href="/profile">
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Ver Perfil
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ir al Marketplace
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Información del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>
              Detalles técnicos y soporte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">ID de Usuario:</span>
                <span className="text-muted-foreground font-mono">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Proveedor de Auth:</span>
                <span className="text-muted-foreground">{user.app_metadata?.provider || 'email'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Versión de la App:</span>
                <span className="text-muted-foreground">1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}