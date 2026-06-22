# Tomas Rodriguez — Portafolio (Cybersecurity Engineer)

Portafolio personal interactivo: una SPA con un fondo 3D animado (WebGL), navegación por secciones, soporte bilingüe (ES/EN) y desplegado en Cloudflare Pages con CI/CD.

🔗 **Producción:** https://web.trodriten.com

---

## 1. Tecnologías

| Capa | Herramienta | Versión | Para qué |
|------|-------------|---------|----------|
| UI | **React** | 19.1 | Componentes |
| Build/Dev | **Vite** | 6.3 | Dev server + bundling |
| Routing | **react-router-dom** | 7.17 | Una ruta por sección (SPA) |
| i18n | **i18next / react-i18next** | 25 / 15 | ES/EN, traducciones lazy-loaded |
| Animación UI | **framer-motion** | 12 | Entradas, transiciones, gestos |
| 3D | **three.js** | 0.175 | Motor WebGL |
| 3D React | **@react-three/fiber** | 9.1 | three.js declarativo en React |
| 3D helpers | **@react-three/drei** | 9.12 | `Stars`, `Float`, `Preload` |
| 3D FX | **@react-three/postprocessing** | 3.0 | Bloom, glitch, vignette, aberración |
| Iconos | **react-icons** | 5.5 | FontAwesome (fa / fa6) |
| Lint | **ESLint** | 9 | — |

**Runtime:** Node 20 (recomendado). El proyecto es 100% cliente; **no hay backend ni base de datos**.

---

## 2. Arquitectura

SPA de una sola página con un **fondo 3D fijo** sobre el que flota el contenido HTML.

```
index.html
  └─ src/main.jsx          → StrictMode + <Suspense> + carga i18n y estilos
       └─ src/App.jsx      → <Router>
            ├─ <Scene>      → Canvas 3D fijo, pantalla completa (z-index 0)
            ├─ <Navbar>     → barra fija (z-index 1000) + menú hamburguesa móvil
            └─ <main>       → <Routes> con cada sección (z-index 1)
```

- **Routing = secciones.** Cada ruta renderiza una sección, **lazy-loaded** con `React.lazy` + `<Suspense>` (fallback "DECRYPTING"):
  `/` → Hero · `/about` · `/experience` · `/education` · `/publications` · `/contact`.
- **Contenido desacoplado de la presentación.** Todos los textos y datos (experiencia, educación, publicaciones) viven en `public/locales/{en,es}/translation.json` y se leen con `t(...)` / `t(..., { returnObjects: true })`. Los componentes **no** tienen texto hardcodeado.
- **Capa 3D** (`src/components/three/`), orquestada por `Scene.jsx`:
  - `CryptoCore` — núcleo central (incluye `ShieldMesh`: icosaedros wireframe anidados).
  - `ParticleNetwork` — 2000 partículas en cáscara esférica (muestreo Fibonacci), que reaccionan al mouse (repulsión + resorte) y dibujan líneas entre partículas cercanas.
  - `DataStream` — "lluvia Matrix" vertical.
  - `Stars` (drei) + iluminación + post-procesado (Bloom, ChromaticAberration, Vignette, y un `Glitch` que dispara al cambiar de ruta).
  - El núcleo se desplaza/encoge según la ruta (`/` centrado a escala 1; el resto desplazado en X a escala 0.7).
- **Hooks** (`src/hooks/`): `useMousePosition` (posición normalizada −1..1) y `useScrollProgress` (0..1).
- **Sistema de diseño** en `src/styles/index.css`: tokens CSS en `:root` (paleta oro `#FFD700` sobre negro `#050505`, tipografías JetBrains Mono + Inter, escalas de spacing/tamaños) y reglas responsive. La paleta y la config de partículas también están en `src/utils/constants.js`.

### Estructura de carpetas
```
public/
  _headers              # Cabeceras de seguridad (formato Cloudflare)
  _redirects            # Fallback SPA (/* → /index.html 200)
  favicon.svg
  locales/{en,es}/translation.json   # ← TODO el contenido textual
src/
  main.jsx  App.jsx  i18n/i18n.js  styles/index.css
  utils/    constants.js   url.js   # url.js = safeHref (hardening)
  hooks/    useMousePosition.js  useScrollProgress.js
  components/
    Layout/    Navbar.jsx  SectionWrapper.jsx
    sections/  Hero  About  Experience  Education  Publications  Contact
    three/     Scene  CryptoCore  ShieldMesh  ParticleNetwork  DataStream
.github/  workflows/deploy.yml   dependabot.yml
.npmrc  vite.config.js
```

---

## 3. Metodología

- **Component-driven + data-driven.** UI en componentes pequeños; el contenido se mantiene como datos (JSON de i18n), no en el JSX. Editar la web = editar JSON, no tocar lógica.
- **Mobile-first / responsive real.** Grillas con `minmax(min(100%, Npx), 1fr)` para no desbordar en celulares; navbar colapsa a hamburguesa en ≤768px.
- **Rendimiento 3D consciente.** En los bucles `useFrame` se **mutan buffers `Float32Array` directamente** y se marca `needsUpdate`; nunca se hace `setState` por frame (evita re-renders de React y GC).
- **Security by design / defensa en profundidad.** Se hizo una revisión SAST (OWASP Top 10 / CWE) y se aplicaron controles: CSP + cabeceras, validación de URLs de salida, auditoría de dependencias en CI. Ver §6.
- **CI/CD con gates.** Nada llega a producción sin pasar instalación bloqueada (`npm ci`), auditoría de dependencias de producción y build exitoso.

---

## 4. Puntos clave de la webpage

- 🎨 **Fondo 3D interactivo** que reacciona al mouse y cambia con la navegación (núcleo + red de partículas + lluvia de datos + post-procesado).
- 🌐 **Bilingüe ES/EN** con detección automática (navegador/localStorage), cambio en caliente y `<html lang>` sincronizado.
- ⚡ **Carga diferida** de cada sección (code-splitting con `React.lazy`).
- 📱 **Responsive** con menú hamburguesa móvil y grillas sin desborde horizontal.
- 🔗 **Tarjetas accionables:** Educación enlaza a los programas (MESI / ISIS) y Publicaciones a los papers (ICS), todo en pestaña nueva con `rel="noopener noreferrer"`.
- 🛡️ **Endurecido para producción:** CSP estricta, anti-clickjacking, HSTS, `safeHref`, sin secretos en el repo.
- ♿ **Detalles a11y/UX:** `aria-label`s, foco visible, respeto a `prefers-reduced-motion`.

---

## 5. CI/CD

Pipeline en **GitHub Actions** (`.github/workflows/deploy.yml`). Se dispara en cada `push` a `master`/`main`:

```
checkout → setup-node 20 → npm ci → npm audit (prod) → npm run build → deploy
```

- **`npm ci`** instala exactamente desde el lockfile (requiere `.npmrc`, ver §6).
- **Gate de seguridad:** `npm audit --omit=dev --audit-level=high` falla el pipeline si algo que **se publica** tiene CVE alto/crítico (las deps de build se vigilan aparte con Dependabot).
- **Build:** `vite build` → genera `dist/` (incluye `_headers`, `_redirects`, `locales/`, assets con hash).
- **Deploy:** sube `dist/` al hosting (Cloudflare Pages, vía wrangler — *Direct Upload*).
- **Dependabot** (`.github/dependabot.yml`) abre PRs semanales para mantener dependencias y actions al día.

**Secrets necesarios** en GitHub (*repo → Settings → Secrets and variables → Actions*):
`CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`.

> Cada push genera un deployment nuevo; el último es el que sirve el dominio. Los anteriores quedan accesibles por su URL con hash (se borran a mano desde el panel si se quiere).

---

## 6. Mantenimiento (lo esencial para sostenerlo en solitario)

### Correr en local
```bash
npm install          # usa .npmrc (legacy-peer-deps); npm ci también sirve
npm run dev          # http://localhost:3000 (abre el navegador)
npm run build        # genera dist/
npm run preview      # sirve dist/ para revisar el build
npm run lint
```

### Tareas frecuentes
- **Cambiar textos / datos:** editar `public/locales/en/translation.json` **y** `es/...` (misma estructura, mismas claves). No se toca el JSX.
- **Agregar una sección nueva:**
  1. Crear el componente en `src/components/sections/`.
  2. Registrarlo en `src/App.jsx` (`lazy(...)` + una `<Route>`).
  3. Añadir el ítem en `NAV_ITEMS` de `src/components/Layout/Navbar.jsx`.
  4. Añadir las claves de texto en **ambos** JSON de `locales`.
- **Enlaces de Educación:** array `EDUCATION_LINKS` (por índice) en `Education.jsx`.
- **Cualquier `href` que venga de datos** debe pasar por `safeHref(...)` de `src/utils/url.js` (bloquea `javascript:` etc.).
- **Colores / espaciados:** variables CSS en `:root` de `src/styles/index.css` (y `src/utils/constants.js` para el 3D).

### Puntos delicados — NO romper sin entender
- **`.npmrc` con `legacy-peer-deps=true`:** existe por un conflicto real de peers — `@react-three/drei@9` pide React 18/fiber 8, pero el proyecto usa **React 19 / fiber 9**. Sin esto, `npm ci` falla en CI. Los componentes drei usados (`Stars`, `Float`, `Preload`) funcionan igual. *Arreglo definitivo a futuro: migrar a `@react-three/drei@^10`.*
- **`public/_redirects`** (`/* /index.html 200`): sin él, recargar `/about` (o cualquier deep-link) da **404** en el hosting estático. No borrar.
- **`public/_headers`**: ahí viven la **CSP y cabeceras de seguridad**. Si agregas un script externo (p. ej. analytics) o una fuente/CDN nueva, **debes** añadir su origen a la CSP o el navegador lo bloqueará.
- **`vite.config.js` → `build.modulePreload.polyfill: false`:** desactivado a propósito para que el `index.html` no tenga `<script>` inline y la CSP pueda ser estricta (`script-src 'self'`). Si lo reactivas, ajusta la CSP.
- **Bucles `useFrame` (3D):** nunca metas `setState` dentro; muta los buffers y marca `needsUpdate` (patrón ya usado en `ParticleNetwork`).
- **`dist/` y `node_modules/`** están en `.gitignore`. El build se hace en CI; no commitear `dist/`.

### Seguridad (resumen de la revisión SAST aplicada)
Sitio estático sin backend/secretos → no aplican inyección server-side, auth/sesiones, BOLA/IDOR ni CORS. Controles aplicados:
- **A05 (config):** CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `COOP`, `HSTS` → en `public/_headers`.
- **A06 (dependencias):** gate de `npm audit` en CI + Dependabot.
- **A03 (XSS / open redirect):** `safeHref` para hrefs de datos; React auto-escapa el texto; sin `dangerouslySetInnerHTML`/`eval`.
- **Sin secretos** en el repo; `target="_blank"` siempre con `rel="noopener noreferrer"`.

Validación post-deploy recomendada: DevTools → Console (sin violaciones de CSP) y [securityheaders.com](https://securityheaders.com).

---

## Licencia
Uso personal. © Tomas Alberto Rodriguez Peña.
