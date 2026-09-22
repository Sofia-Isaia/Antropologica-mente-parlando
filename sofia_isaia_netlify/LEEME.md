# Web de Sofia Isaia

Sitio estático (carpeta `public/`) + blog con comentarios y editor privado,
hecho con Netlify Functions y Netlify Blobs.

## Qué hay dentro

- `public/index.html` — la web (sobre mí, proyectos, blog, trayectoria, contacto).
- `public/admin/` — el editor del blog, en `tu-dominio/admin`. Pide usuario y contraseña.
- `netlify/functions/` — el "backend": login, entradas, comentarios, subida de imágenes.
- `netlify/lib/seed.mjs` — las dos primeras entradas. Solo se usan hasta que guardes algo desde /admin.

## Cómo publicarla (una sola vez)

Importante: esta versión NO funciona arrastrando la carpeta a Netlify (drag & drop),
porque las funciones del blog necesitan que Netlify instale dependencias. Hay que
conectarla a un repositorio de GitHub:

1. Crea un repositorio nuevo en GitHub y sube todo el contenido de esta carpeta
   (sin la carpeta `node_modules`, si existiera).
2. En Netlify: Add new project → Import an existing project → GitHub → elige el repositorio.
   Netlify leerá `netlify.toml` solo; no hace falta cambiar nada del build.
3. Antes del primer uso del editor, en Netlify ve a
   Project configuration → Environment variables y crea estas tres variables:
   - `ADMIN_USER` → el correo con el que entrarás al editor
   - `ADMIN_PASSWORD` → la contraseña del editor
   - `AUTH_SECRET` → una frase larga y aleatoria (más de 32 caracteres; no hace falta recordarla)
4. Vuelve a desplegar (Deploys → Trigger deploy) para que las variables se apliquen.

La contraseña nunca está escrita en el código: solo vive en esas variables de Netlify.
Para cambiarla, edita `ADMIN_PASSWORD` y vuelve a desplegar.

## Día a día

- Escribir: entra en `/admin`, rellena título, mes, categoría, imagen y texto → "Publicar entrada".
  La web se actualiza al momento, sin volver a desplegar.
- Las entradas se ordenan solas de la más reciente a la más antigua (por el mes que elijas).
- Comentarios: cualquiera puede comentar con nombre y correo. El correo no se muestra en la web;
  tú lo ves en /admin, donde también puedes borrar comentarios.
