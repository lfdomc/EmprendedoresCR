'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar,
  MapPin,
  Globe,
  Clock,
  MessageSquare,
  ExternalLink,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  BarChart3,
  Package,
  Wrench
} from 'lucide-react';
import { Business } from '@/lib/types/database';

interface DashboardStatsProps {
  business: Business;
  stats: {
    totalProducts: number;
    totalServices: number;
    whatsappStats: {
      totalContacts: number;
      productContacts: number;
      serviceContacts: number;
    };
  };
}

export function DashboardStats({ business, stats }: DashboardStatsProps) {
  return (
    <div className="space-y-6">
      {/* WhatsApp Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estadísticas de WhatsApp
          </CardTitle>
          <CardDescription>
            Solicitudes de información recibidas por WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.whatsappStats.totalContacts}</p>
              <p className="text-sm text-muted-foreground">Total Contactos</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{stats.whatsappStats.productContacts}</p>
              <p className="text-sm text-muted-foreground">Por Productos</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Wrench className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{stats.whatsappStats.serviceContacts}</p>
              <p className="text-sm text-muted-foreground">Por Servicios</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Detailed Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Detallada del Emprendimiento</CardTitle>
          <CardDescription>
            Detalles completos y datos de contacto
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <div className="flex items-start gap-3">
                 <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                 <div>
                   <p className="font-medium">Dirección</p>
                   <p className="text-sm text-muted-foreground">{business.address}</p>
                 </div>
               </div>
               
               <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <p className="text-sm text-muted-foreground">{business.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{business.email}</p>
                  </div>
                </div>
               
               {business.website && (
                 <div className="flex items-start gap-3">
                   <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                   <div>
                     <p className="font-medium">Sitio Web</p>
                     <a 
                       href={business.website} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-sm text-primary hover:underline flex items-center gap-1"
                     >
                       Ver sitio web
                       <ExternalLink className="h-3 w-3" />
                     </a>
                   </div>
                 </div>
               )}
               
               {business.whatsapp && (
                 <div className="flex items-start gap-3">
                   <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                   <div>
                     <p className="font-medium">WhatsApp</p>
                     <p className="text-sm text-muted-foreground">{business.whatsapp}</p>
                   </div>
                 </div>
               )}
             </div>
             
             <div className="space-y-4">
               {business.opening_hours && (
                 <div className="flex items-start gap-3">
                   <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                   <div>
                     <p className="font-medium">Horarios de Atención</p>
                     <p className="text-sm text-muted-foreground whitespace-pre-line">
                       {business.opening_hours}
                     </p>
                   </div>
                 </div>
               )}
               
               <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Descripción</p>
                    <p className="text-sm text-muted-foreground">{business.description}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  {business.is_active ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">Estado</p>
                    <p className={`text-sm ${business.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {business.is_active ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                </div>
               
               <div className="flex items-start gap-3">
                 <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                 <div>
                   <p className="font-medium">Fecha de Creación</p>
                   <p className="text-sm text-muted-foreground">
                     {new Date(business.created_at).toLocaleDateString('es-ES', {
                       year: 'numeric',
                       month: 'long',
                       day: 'numeric'
                     })}
                   </p>
                 </div>
               </div>
             </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}