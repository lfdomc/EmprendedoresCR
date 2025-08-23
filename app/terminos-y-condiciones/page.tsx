import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de Costa Rica Emprende',
};

export default function TerminosYCondiciones() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">Términos y Condiciones</h1>
        <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-CR')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Términos de Uso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <section>
            <h3 className="font-semibold mb-2">1. Aceptación de los Términos</h3>
            <p className="text-muted-foreground">
              Al acceder y utilizar Costa Rica Emprende, usted acepta cumplir con estos términos y condiciones. 
              Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestro servicio.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">2. Descripción del Servicio</h3>
            <p className="text-muted-foreground">
              Costa Rica Emprende es una plataforma digital que conecta emprendedores costarricenses con 
              potenciales clientes, facilitando la promoción y venta de productos y servicios locales.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">3. Registro y Cuenta de Usuario</h3>
            <p className="text-muted-foreground">
              Para utilizar ciertas funciones de la plataforma, debe crear una cuenta proporcionando 
              información precisa y actualizada. Es responsable de mantener la confidencialidad de 
              sus credenciales de acceso.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">4. Contenido del Usuario</h3>
            <p className="text-muted-foreground">
              Los usuarios son responsables del contenido que publican en la plataforma. 
              El contenido debe ser legal, preciso y no infringir derechos de terceros.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">5. Prohibiciones</h3>
            <p className="text-muted-foreground">
              Está prohibido utilizar la plataforma para actividades ilegales, spam, 
              contenido ofensivo o cualquier actividad que pueda dañar el servicio o a otros usuarios.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">6. Limitación de Responsabilidad</h3>
            <p className="text-muted-foreground">
              Costa Rica Emprende no se hace responsable por las transacciones realizadas entre usuarios 
              ni por la calidad de los productos o servicios ofrecidos por los emprendedores.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">7. Modificaciones</h3>
            <p className="text-muted-foreground">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán notificados a través de la plataforma.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">8. Contacto</h3>
            <p className="text-muted-foreground">
              Para consultas sobre estos términos, puede contactarnos en: info@costaricaemprende.com
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}