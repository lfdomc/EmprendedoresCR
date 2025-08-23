import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de Costa Rica Emprende',
};

export default function PoliticaDePrivacidad() {
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
        <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
        <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-CR')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Protección de Datos Personales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <section>
            <h3 className="font-semibold mb-2">1. Información que Recopilamos</h3>
            <p className="text-muted-foreground mb-2">
              Recopilamos la siguiente información cuando utiliza nuestros servicios:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Información de registro (nombre, email, teléfono)</li>
              <li>Información del emprendimiento (nombre, descripción, ubicación)</li>
              <li>Datos de productos y servicios publicados</li>
              <li>Información de uso de la plataforma</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">2. Uso de la Información</h3>
            <p className="text-muted-foreground mb-2">
              Utilizamos su información para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Facilitar la conexión entre emprendedores y clientes</li>
              <li>Enviar comunicaciones relacionadas con el servicio</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">3. Compartir Información</h3>
            <p className="text-muted-foreground">
              No vendemos, alquilamos ni compartimos su información personal con terceros, 
              excepto cuando sea necesario para proporcionar el servicio o cuando lo requiera la ley.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">4. Seguridad de los Datos</h3>
            <p className="text-muted-foreground">
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para 
              proteger su información personal contra acceso no autorizado, alteración, 
              divulgación o destrucción.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">5. Cookies y Tecnologías Similares</h3>
            <p className="text-muted-foreground">
              Utilizamos cookies y tecnologías similares para mejorar la experiencia del usuario, 
              analizar el uso del sitio y personalizar el contenido.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">6. Sus Derechos</h3>
            <p className="text-muted-foreground mb-2">
              Usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Acceder a su información personal</li>
              <li>Rectificar datos inexactos</li>
              <li>Solicitar la eliminación de sus datos</li>
              <li>Oponerse al procesamiento de sus datos</li>
              <li>Portabilidad de datos</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">7. Retención de Datos</h3>
            <p className="text-muted-foreground">
              Conservamos su información personal solo durante el tiempo necesario para 
              cumplir con los propósitos descritos en esta política o según lo requiera la ley.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">8. Cambios en la Política</h3>
            <p className="text-muted-foreground">
              Podemos actualizar esta política de privacidad ocasionalmente. 
              Le notificaremos sobre cambios significativos a través de la plataforma.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">9. Contacto</h3>
            <p className="text-muted-foreground">
              Para consultas sobre esta política de privacidad o para ejercer sus derechos, 
              puede contactarnos en: info@costaricaemprende.com
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}