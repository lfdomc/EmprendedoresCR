import { NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/config'

export async function GET() {
  try {
    // Para WhatsApp, usar directamente JPEG para mejor compatibilidad
    const jpegUrl = `${getBaseUrl()}/logosmall.jpg`
    return NextResponse.redirect(jpegUrl)
    
  } catch (error) {
    console.error('Error generating OG image:', error)
    
    // Fallback a la imagen JPEG del logo
    const fallbackUrl = `${getBaseUrl()}/logosmall.jpg`
    return NextResponse.redirect(fallbackUrl)
  }
}

export const runtime = 'edge'