# Catering Management Platform

Este proyecto es una plataforma web para la gestión integral de servicios de catering, desarrollada con Next.js, TypeScript y Clerk para autenticación. Incluye módulos para administración de entregas, clientes, inventario, pedidos y un bot inteligente para consultas sobre catering.

## Características principales

- **Gestión de entregas**: Visualiza y administra entregas de catering.
- **Clientes**: Registro, historial y análisis de clientes.
- **Inventario**: Control de insumos y productos.
- **Pedidos**: Creación y seguimiento de pedidos.
- **Bot AI**: Asistente inteligente especializado en catering, usando Gemini de Google vía Vercel AI SDK.
- **Autenticación**: Clerk para registro y acceso seguro.
- **Interfaz moderna**: UI responsiva y componentes reutilizables.

## Estructura del proyecto

```
app/
  dashboard/
    entregas/         # Vista y bot de entregas
    clientes/         # Gestión de clientes
    inventario/       # Inventario de insumos
    pedidos/          # Pedidos y seguimiento
components/           # Componentes UI y funcionales
hooks/                # Custom hooks
lib/                  # Utilidades
public/               # Recursos estáticos
api/chat/route.ts     # Endpoint para el bot AI
middleware.ts         # Middleware Clerk y rutas públicas
```

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <repo-url>
   cd hackathon-front
   ```
2. Instala dependencias:
   ```bash
   pnpm install
   # o npm/yarn/bun
   ```
3. Configura variables de entorno:
   - Crea un archivo `.env.local` y agrega tu API Key de Gemini:
     ```env
     GOOGLE_API_KEY=tu_api_key_aqui
     CLERK_PUBLISHABLE_KEY=tu_clerk_key
     CLERK_SECRET_KEY=tu_clerk_secret
     ```
4. Inicia el servidor:
   ```bash
   pnpm dev
   ```

## Uso

- Accede a `/dashboard/entregas` para interactuar con el bot AI sobre catering.
- Administra clientes, inventario y pedidos desde el dashboard.
- El bot responde preguntas sobre logística, menús, organización y atención al cliente en catering.

## Autenticación

- Clerk protege todas las rutas excepto `/api/chat` y las de login/signup.
- Configura Clerk en el dashboard para gestión de usuarios.

## Dependencias clave

- **Next.js**
- **TypeScript**
- **Clerk** (autenticación)
- **@ai-sdk/react**, **@ai-sdk/google**, **ai** (bot Gemini)
- **TailwindCSS** (estilos)

## Despliegue

Recomendado en [Vercel](https://vercel.com/) para integración nativa con Next.js y AI SDK.

## Contribución

¡Las contribuciones son bienvenidas! Abre un issue o PR para sugerencias y mejoras.

## Licencia

MIT
