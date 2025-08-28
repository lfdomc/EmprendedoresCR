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
        url: '/opengraph-image.png',
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
    images: ['/twitter-image.png'],
  },
}

export default function EmprendedoresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              ✨ Plataforma 100% Gratuita
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Tu Emprendimiento
              <span className="block text-yellow-300">Visible en Google</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Únete a <strong>Costa Rica Emprende</strong>, la plataforma gratuita e intuitiva donde puedes 
              exponer tus productos y servicios con indexación automática en Google.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg">
                <Link href="/auth/register" className="flex items-center gap-2">
                  Comenzar Gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-blue-600 bg-white hover:bg-blue-50 hover:text-blue-700 px-8 py-4 text-lg">
                <Link href="#beneficios">
                  Ver Beneficios
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios Principales */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Costa Rica Emprende?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diseñada específicamente para emprendedores costarricenses que buscan 
              crecer y destacar en el mundo digital.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Indexación en Google</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Tus productos y servicios aparecerán automáticamente en los resultados 
                  de búsqueda de Google, aumentando tu visibilidad online.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">100% Gratuito</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Sin costos ocultos, sin comisiones por ventas. Una plataforma 
                  completamente gratuita para impulsar tu emprendimiento.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Fácil de Usar</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Interfaz intuitiva diseñada para emprendedores. Publica tus productos 
                  y servicios en minutos, sin conocimientos técnicos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">SEO Optimizado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Cada página está optimizada para motores de búsqueda, mejorando 
                  las posibilidades de que tus clientes te encuentren.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Crecimiento Garantizado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Herramientas y funcionalidades diseñadas para hacer crecer tu 
                  emprendimiento y llegar a más clientes potenciales.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Soporte Local</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Creado por y para costarricenses. Entendemos las necesidades 
                  específicas del mercado local.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Características Detalladas */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para destacar
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Funcionalidades pensadas para emprendedores que quieren profesionalizar 
              su presencia digital.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Expone tus productos y servicios como un profesional
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Galería de imágenes ilimitada</h4>
                    <p className="text-gray-600">Sube todas las fotos que necesites para mostrar tus productos desde todos los ángulos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Descripciones detalladas</h4>
                    <p className="text-gray-600">Espacio ilimitado para describir tus productos y servicios con todo el detalle necesario.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Información de contacto integrada</h4>
                    <p className="text-gray-600">WhatsApp, teléfono, email y redes sociales en un solo lugar para facilitar el contacto.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Categorización inteligente</h4>
                    <p className="text-gray-600">Organiza tus productos por categorías para que los clientes encuentren exactamente lo que buscan.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Tu página web profesional
                </h4>
                <p className="text-gray-600 mb-6">
                  Cada emprendimiento obtiene su propia página web con URL personalizada, 
                  optimizada para aparecer en Google.
                </p>
                <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-700">
                  <strong>Ejemplo:</strong><br />
                  costaricaemprende.com/businesses/tu-emprendimiento
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            ¿Listo para hacer crecer tu emprendimiento?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Únete a cientos de emprendedores costarricenses que ya están 
            aprovechando esta plataforma gratuita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg">
              <Link href="/auth/register" className="flex items-center gap-2">
                Crear mi cuenta gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              <Link href="/businesses">
                Ver emprendimientos
              </Link>
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            Sin costos ocultos • Sin comisiones • Soporte en español
          </p>
        </div>
      </section>
    </div>
  )
}