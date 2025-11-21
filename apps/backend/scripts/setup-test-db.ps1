# Script PowerShell para configurar la base de datos de test en Windows
# Este script inicia la base de datos de test y espera a que esté lista

Write-Host "🚀 Iniciando base de datos de test..." -ForegroundColor Cyan

# Iniciar solo el servicio de postgres-test
docker-compose up -d postgres-test

# Esperar a que la base de datos esté lista
Write-Host "⏳ Esperando a que la base de datos esté lista..." -ForegroundColor Yellow

$maxAttempts = 30
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts -and -not $ready) {
    $result = docker exec choppi-postgres-test pg_isready -U postgres 2>&1
    if ($LASTEXITCODE -eq 0) {
        $ready = $true
    } else {
        Start-Sleep -Seconds 1
        $attempt++
        Write-Host "   Esperando conexión a la base de datos... (intento $attempt/$maxAttempts)" -ForegroundColor Gray
    }
}

if ($ready) {
    Write-Host "✅ Base de datos de test lista!" -ForegroundColor Green
    Write-Host "   Host: localhost" -ForegroundColor White
    Write-Host "   Puerto: 5433" -ForegroundColor White
    Write-Host "   Base de datos: choppi_db_test" -ForegroundColor White
    Write-Host "   Usuario: postgres" -ForegroundColor White
    Write-Host "   Contraseña: postgres" -ForegroundColor White
} else {
    Write-Host "❌ Error: No se pudo conectar a la base de datos de test" -ForegroundColor Red
    exit 1
}

