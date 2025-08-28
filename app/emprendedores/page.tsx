import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Globe, Search, Users, Zap, ArrowRight, Star, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Para Emprendedores - Costa Rica Emprende | Plataforma Gratuita para tu Negocio',
  description: 'Únete a Costa Rica Emprende, la plataforma gratuita e intuitiva donde puedes exponer tus productos y servicios. Indexación en Google garantizada, fácil de usar y diseñada para emprendedores costarricenses.',
  keywords: 'emprendedores costa rica, plataforma gratuita, productos servicios online, indexación google, marketplace costarricense',
  openGraph: {
    title: 'Para Emprendedores - Costa Rica Emprende',
    description: 'Plataforma gratuita e intuitiva para emprendedores costarricenses. Expone tus productos y servicios con indexación en Google.',
    url: 'https://www.costaricaemprende.com/emprendedores',
    siteName: 'Costa Rica Emprende',
    images: [
      {
        url: '/logonew.jpeg',
        width: 1200,
        height: 630,
        alt: 'Costa Rica Emprende - Para Emprendedores',
      },
    ],
    locale: 'es_CR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Para Emprendedores - Costa Rica Emprende',
    description: 'Plataforma gratuita e intuitiva para emprendedores costarricenses.',
    images: ['/logonew.jpeg'],
  },
}

export default function EmprendedoresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-12 md:py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 md:mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              ✨ Plataforma 100% Gratuita
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Tu Emprendimiento
              <span className="block text-yellow-300">Visible en Google</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-blue-100 max-w-3xl mx-auto">
              Únete a <strong>Costa Rica Emprende</strong>, la plataforma gratuita e intuitiva donde puedes 
              exponer tus productos y servicios con indexación automática en Google.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 md:px-8 py-3 md:py-4 text-base md:text-lg">
                <Link href="/auth/register" className="flex items-center gap-2">
                  Comenzar Gratis
                  <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-blue-600 bg-white hover:bg-blue-50 hover:text-blue-700 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg">
                <Link href="#beneficios">
                  Ver Beneficios
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios Principales */}
      <section id="beneficios" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              ¿Por qué elegir Costa Rica Emprende?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Plataforma diseñada para emprendedores que buscan 
              crecer y destacar digitalmente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-1.5 md:pb-3">
                <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">Indexación en Google</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm md:text-base">
                  Aparece automáticamente en Google, aumentando tu visibilidad online.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-1.5 md:pb-3">
                <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">100% Gratuito</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm md:text-base">
                  Sin costos ocultos ni comisiones. Completamente gratuito.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-1.5 md:pb-3">
                <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">Fácil de Usar</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm md:text-base">
                  Interfaz intuitiva. Publica en minutos, sin conocimientos técnicos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-1.5 md:pb-3">
                <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">SEO Optimizado</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm md:text-base">
                  Optimizado para motores de búsqueda. Tus clientes te encuentran fácil.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-1.5 md:pb-3">
                <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">Crecimiento Garantizado</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm md:text-base">
                  Herramientas diseñadas para hacer crecer tu emprendimiento.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-1.5 md:pb-3">
                <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">Soporte Local</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm md:text-base">
                  Creado por y para costarricenses. Entendemos el mercado local.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Características Detalladas */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Todo lo que necesitas para destacar
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Funcionalidades para profesionalizar tu presencia digital.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-center max-w-6xl mx-auto">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                Expone tus productos como un profesional
              </h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">Galería de imágenes ilimitada</h4>
                    <p className="text-gray-600 text-sm md:text-base">Sube todas las fotos para mostrar tus productos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">Descripciones detalladas</h4>
                    <p className="text-gray-600 text-sm md:text-base">Espacio ilimitado para describir tus productos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">Contacto integrado</h4>
                    <p className="text-gray-600 text-sm md:text-base">WhatsApp, teléfono y redes sociales en un lugar.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">Categorización inteligente</h4>
                    <p className="text-gray-600 text-sm md:text-base">Organiza por categorías para facilitar la búsqueda.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Globe className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                  Tu página web profesional
                </h4>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                  Cada emprendimiento obtiene su página web con URL personalizada, 
                  optimizada para Google.
                </p>
                <div className="bg-gray-100 rounded-lg p-3 md:p-4 text-xs md:text-sm text-gray-700">
                  <strong>Ejemplo:</strong><br />
                  costaricaemprende.com/businesses/tu-emprendimiento
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            ¿Listo para hacer crecer tu emprendimiento?
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto text-blue-100">
            Únete a cientos de emprendedores costarricenses que aprovechan 
            esta plataforma gratuita.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 md:px-8 py-3 md:py-4 text-base md:text-lg">
              <Link href="/auth/register" className="flex items-center gap-2">
                Crear mi cuenta gratis
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-blue-800 hover:bg-white hover:text-blue-600 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold">
              <Link href="/businesses">
                Ver emprendimientos
              </Link>
            </Button>
          </div>
          <p className="text-xs md:text-sm text-blue-200 mt-4 md:mt-6">
            Sin costos ocultos • Sin comisiones • Soporte en español
          </p>
        </div>
      </section>
    </div>
  )
}