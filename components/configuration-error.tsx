import { AlertTriangle, Settings, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ConfigurationError() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Error de Configuración
          </CardTitle>
          <CardDescription className="text-lg">
            La aplicación no puede conectarse a la base de datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertTitle>Variables de entorno faltantes</AlertTitle>
            <AlertDescription>
              Las siguientes variables de entorno son requeridas para que la aplicación funcione correctamente:
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li><code className="bg-muted px-1 py-0.5 rounded text-sm">NEXT_PUBLIC_SUPABASE_URL</code></li>
                <li><code className="bg-muted px-1 py-0.5 rounded text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Pasos para solucionar:</h3>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  1
                </span>
                <div>
                  <p className="font-medium">Crear un proyecto en Supabase</p>
                  <p className="text-muted-foreground">Ve a database.new y crea un nuevo proyecto</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  2
                </span>
                <div>
                  <p className="font-medium">Obtener las credenciales</p>
                  <p className="text-muted-foreground">Copia la URL del proyecto y la clave anon desde Settings → API</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  3
                </span>
                <div>
                  <p className="font-medium">Configurar variables de entorno</p>
                  <p className="text-muted-foreground">Crea un archivo .env.local con las credenciales</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  4
                </span>
                <div>
                  <p className="font-medium">Ejecutar el esquema de base de datos</p>
                  <p className="text-muted-foreground">Ejecuta el contenido de database/schema.sql en el SQL Editor de Supabase</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  5
                </span>
                <div>
                  <p className="font-medium">Reiniciar el servidor</p>
                  <p className="text-muted-foreground">Ejecuta npm run dev para cargar las nuevas variables</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <a 
                href="https://database.new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Crear proyecto en Supabase
              </a>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <a 
                href="https://supabase.com/docs/guides/getting-started/quickstarts/nextjs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Ver documentación
              </a>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>¿Necesitas ayuda? Contacta al equipo de <strong>Emprendimientos CR</strong></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}