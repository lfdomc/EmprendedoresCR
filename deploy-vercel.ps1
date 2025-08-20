# Script de Despliegue para Vercel - Emprendimientos CR
# Ejecutar en PowerShell: .\deploy-vercel.ps1

Write-Host "🚀 Iniciando despliegue en Vercel..." -ForegroundColor Green

# Verificar si Vercel CLI está instalado
if (!(Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI no está instalado. Instalando..." -ForegroundColor Yellow
    npm install -g vercel
}

# Verificar si existe .env.local
if (!(Test-Path ".env.local")) {
    Write-Host "❌ Archivo .env.local no encontrado." -ForegroundColor Red
    Write-Host "Por favor, crea el archivo .env.local con tus variables de entorno." -ForegroundColor Red
    Write-Host "Puedes usar .env.example como referencia." -ForegroundColor Yellow
    exit 1
}

# Leer variables de .env.local
Write-Host "📋 Leyendo variables de entorno..." -ForegroundColor Blue
$envVars = @{}
Get-Content ".env.local" | ForEach-Object {
    if ($_ -match "^([^#][^=]+)=(.*)$") {
        $envVars[$matches[1]] = $matches[2]
    }
}

# Verificar variables requeridas
$requiredVars = @("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY")
foreach ($var in $requiredVars) {
    if (!$envVars.ContainsKey($var)) {
        Write-Host "❌ Variable requerida $var no encontrada en .env.local" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Variables de entorno verificadas" -ForegroundColor Green

# Ejecutar build local para verificar
Write-Host "🔨 Ejecutando build local para verificar..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build falló. Por favor, corrige los errores antes de desplegar." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build local exitoso" -ForegroundColor Green

# Preguntar si desea configurar variables en Vercel
$configureEnv = Read-Host "¿Deseas configurar las variables de entorno en Vercel? (y/n)"

if ($configureEnv -eq "y" -or $configureEnv -eq "Y") {
    Write-Host "🔧 Configurando variables de entorno en Vercel..." -ForegroundColor Blue
    
    foreach ($var in $requiredVars) {
        $value = $envVars[$var]
        Write-Host "Configurando $var..." -ForegroundColor Yellow
        vercel env add $var production
        vercel env add $var preview
    }
    
    Write-Host "✅ Variables de entorno configuradas" -ForegroundColor Green
}

# Desplegar a Vercel
Write-Host "🚀 Desplegando a Vercel..." -ForegroundColor Blue
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 ¡Despliegue exitoso!" -ForegroundColor Green
    Write-Host "📱 Tu aplicación está ahora disponible en producción." -ForegroundColor Green
    Write-Host "📖 Consulta VERCEL_DEPLOYMENT.md para más información." -ForegroundColor Blue
} else {
    Write-Host "❌ Error en el despliegue. Revisa los logs de Vercel." -ForegroundColor Red
    exit 1
}