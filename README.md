# 🛒 V-Music | Luis Alvarez - Full Stack

Este proyecto es una aplicación full stack llamada V-Music, que permite buscar, guardar y gestionar álbumes y artistas favoritos usando la API de Spotify. Incluye autenticación OAuth, manejo seguro de tokens, feedback visual con modales y loaders, y una interfaz moderna y responsiva. El objetivo es demostrar habilidades en integración de APIs externas, experiencia de usuario, seguridad y buenas prácticas en Next.js y React.

## 🌐 Deploy

El proyecto está desplegado en Vercel y puedes probarlo aquí:

https://luis-alvarez-full-stack.vercel.app/

## 📦 Estructura del repo

```
Luis_Alvarez_Full-Stack/
├─ app/
│   ├─ api/
│   │   └─ auth/callback/route.ts
│   ├─ components/
│   │   ├─ Header.tsx
│   │   ├─ Loader.tsx
│   │   ├─ Pagination.tsx
│   │   └─ Modal.tsx
│   ├─ artist/[id]/page.tsx
│   ├─ MyAlbums/page.tsx
│   ├─ login/page.tsx
│   └─ search/page.tsx
├─ public/
│   └─ assets/
├─ styles/
│   └─ ...
├─ .env.local
├─ package.json
├─ README.md
└─ tsconfig.json
```

---

## 🧪 Descripción funcional

V-Music permite:

- Buscar álbumes y artistas usando la API de Spotify.
- Guardar y eliminar álbumes favoritos en tu cuenta de Spotify.
- Visualizar tus álbumes guardados y gestionar tu biblioteca personal.
- Autenticarse de forma segura con OAuth y manejo de tokens.

---

## 🚀 Cómo iniciar el proyecto

### 1. Clonar el repositorio

```bash
git clone
cd Luis_Alvarez_Full-Stack
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea el archivo `.env.local` y completa los valores necesarios para la integración con Spotify.

Variables requeridas:

- NEXT_PUBLIC_SPOTIFY_CLIENT_ID
- NEXT_PUBLIC_SPOTIFY_API_URL
- NEXT_PUBLIC_SPOTIFY_TOKEN
- NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
- SPOTIFY_CLIENT_ID
- SPOTIFY_CLIENT_SECRET
- SPOTIFY_REDIRECT_URI

### 4. Iniciar la aplicación (Next.js)

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000` por defecto.

## 📚 Consideraciones técnicas

- El proyecto cumple con la maquetación, responsive e integración de las cuatro pantallas principales: Login, Buscador de artistas, Artista detalle y Mis álbumes guardados.
- Se utilizó Next.js (React) y se priorizó la integración con la API de Spotify y la experiencia de usuario.
- Tambien se logro estructura modular, variables de entorno, despliegue en Vercel, buenas prácticas de Git y Readme, y uso de librerías de CSS solo para optimizar tiempos.

## 🧠 Autor

**Luis Fernando Alvarez Leccia - Full Stack Web Developer**
