# Pipin

Plataforma para publicar y descubrir servicios personales (conversaciones, psicología, masajes, compañía, coaching).
Cada perfil puede registrarse, completar sus datos, publicar sus servicios con fotos, descripción y precio, y recibir contactos directos por WhatsApp.

## Stack

- **Angular 19** (standalone, signals, control flow `@if/@for`)
- **Angular Material 19** + **Tailwind CSS 3**
- **Firebase**: Auth, Firestore, Storage, Hosting (vía `@angular/fire 19`)

## Estructura

```
src/
├─ app/
│  ├─ core/
│  │  ├─ guards/auth.guard.ts        # protege rutas privadas
│  │  ├─ models/                     # Profile, ServiceItem, CATEGORIES
│  │  ├─ services/                   # AuthService, ProfileService, ServicesService, StorageService
│  │  └─ utils/whatsapp.util.ts      # builder de enlaces wa.me
│  ├─ layout/                        # header, footer
│  ├─ pages/
│  │  ├─ auth/                       # login, register
│  │  ├─ home/                       # listado público
│  │  ├─ profile/                    # editar perfil
│  │  └─ services/                   # mis servicios, editor, detalle público
│  ├─ app.component.ts
│  ├─ app.config.ts                  # providers de Firebase
│  └─ app.routes.ts                  # lazy routes
├─ environments/                     # config Firebase (dev / prod)
└─ styles.scss                       # Tailwind + tema Material rosa
```

## Configurar Firebase

1. Ve a la consola de Firebase del proyecto **`project-955086892923`** → *Project settings* → *Your apps* → *Web app*.
2. Copia los valores (`apiKey`, `messagingSenderId`, `appId`, etc.) y reemplázalos en:
   - `src/environments/environment.ts`
   - `src/environments/environment.prod.ts`
3. Habilita los productos:
   - **Authentication** → Sign-in method → *Email/Password*.
   - **Firestore Database** → crear base de datos.
   - **Storage** → crear bucket.
4. Sube las reglas y los índices:

```bash
npx firebase login                       # solo la primera vez
npx firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Desarrollo

```bash
npm start              # http://localhost:4200
```

## Build y deploy a Firebase Hosting

```bash
npm run deploy         # build prod + firebase deploy
# o sólo hosting:
npm run deploy:hosting
```

El `firebase.json` ya apunta el directorio público a `dist/pipin/browser` y redirige todas las rutas a `index.html` para soportar el routing de Angular.

## Flujo de usuario

1. Usuario entra a `/auth/register`, crea cuenta con email + clave → se crea automáticamente un documento en `profiles/{uid}`.
2. Completa su perfil en `/profile` (avatar, bio, ciudad, WhatsApp).
3. Crea servicios en `/services/new` con fotos (Firebase Storage), descripción y precio.
4. El servicio aparece en `/` (home) si está marcado como **publicado**.
5. Visitantes ven el detalle en `/s/:id` y hacen clic en **Contactar por WhatsApp** → abre `wa.me/<numero>?text=...`.

## Seguridad

- `firestore.rules`: lectura pública de perfiles y servicios; escritura restringida al dueño (`auth.uid`).
- `storage.rules`: subida limitada a 5 MB e imágenes, sólo dentro de la carpeta del propio usuario.
