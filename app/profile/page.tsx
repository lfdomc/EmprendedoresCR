import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Obtener información del negocio del usuario
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const userInitials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <Link href="/dashboard">
            <Button variant="outline">Ir al Dashboard</Button>
          </Link>
        </div>

        {/* Información del Usuario */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {user.user_metadata?.full_name || 'Usuario'}
                </CardTitle>
                <CardDescription className="flex items-center mt-2">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Miembro desde: {new Date(user.created_at).toLocaleDateString('es-CR')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={user.email_confirmed_at ? 'default' : 'secondary'}>
                  {user.email_confirmed_at ? 'Email Verificado' : 'Email Pendiente'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del Negocio */}
        {business ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Mi Negocio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{business.name}</h3>
                  <p className="text-muted-foreground">{business.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {business.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{business.phone}</span>
                    </div>
                  )}
                  
                  {business.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{business.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Badge>{business.category}</Badge>
                  <Badge variant="outline">
                    {business.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <Link href={`/businesses/${business.slug}`} className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full">Ver Perfil Público</Button>
                  </Link>
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button className="w-full">Editar Negocio</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Mi Negocio</CardTitle>
              <CardDescription>
                Aún no has configurado tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button>Configurar Mi Negocio</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Marketplace
                </Button>
              </Link>
              <Link href="/businesses">
                <Button variant="outline" className="w-full">
                  Explorar Negocios
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}