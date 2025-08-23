import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {/* Información de la empresa */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Costa Rica Emprende</h3>
            <p className="text-muted-foreground text-xs">
              Plataforma para emprendedores costarricenses
            </p>
          </div>      

        {/* Enlaces legales */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Legal</h4>
            <div className="space-y-1">
              <Link 
                href="/terminos-y-condiciones" 
                className="text-muted-foreground hover:text-foreground transition-colors text-xs block"
              >
                Términos y Condiciones
              </Link>
              <Link 
                href="/politica-de-privacidad" 
                className="text-muted-foreground hover:text-foreground transition-colors text-xs block"
              >
                Política de Privacidad
              </Link>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Contacto</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Mail className="h-3 w-3" />
                <span>info@crtemsa.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Phone className="h-3 w-3" />
              <span>WhatsApp: +506 7012-0250</span>       
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <MapPin className="h-3 w-3" />
                <span>San José, Costa Rica</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-6 pt-4">
          <div className="text-center text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Costa Rica Emprende. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}