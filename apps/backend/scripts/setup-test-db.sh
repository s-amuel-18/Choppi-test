#!/bin/bash

# Script para configurar la base de datos de test
# Este script inicia la base de datos de test y espera a que esté lista

echo "🚀 Iniciando base de datos de test..."

# Iniciar solo el servicio de postgres-test
docker-compose up -d postgres-test

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que la base de datos esté lista..."
until docker exec choppi-postgres-test pg_isready -U postgres > /dev/null 2>&1; do
  echo "   Esperando conexión a la base de datos..."
  sleep 1
done

echo "✅ Base de datos de test lista!"
echo "   Host: localhost"
echo "   Puerto: 5433"
echo "   Base de datos: choppi_db_test"
echo "   Usuario: postgres"
echo "   Contraseña: postgres"

