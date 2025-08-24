import Link from 'next/link'
import { Mail, MessageCircle, MapPin } from 'lucide-react'
import { memo } from 'react'

function FooterComponent() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">Costa Rica Emprende</h3>
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              Conectando emprendedores costarricenses con oportunidades de crecimiento y desarrollo empresarial.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Legal</h4>
            <div className="space-y-3">
              <Link 
                href="/terms" 
                className="block text-sm text-gray-600 hover:text-orange-500 transition-colors"
              >
                Términos y Condiciones
              </Link>
              <Link 
                href="/privacy" 
                className="block text-sm text-gray-600 hover:text-orange-500 transition-colors"
              >
                Política de Privacidad
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>info@costaricaemprende.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageCircle className="h-4 w-4 text-gray-400" />
                <span>+506 8888-8888</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>San José, Costa Rica</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © 2024 Costa Rica Emprende. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default memo(FooterComponent)