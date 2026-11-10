# JavaScript

Prácticas de JavaScript de la tecnicatura: desde ejercicios de DOM y un juego hasta un e-commerce con Mercado Pago y una aplicación full-stack PERN. Dictadas por el tutor Ariel Betancud ([GitHub](https://github.com/ArielBetancud22)).

## Índice de proyectos

| Carpeta | Tema |
| ------- | ---- |
| [BOMBA-JS](BOMBA-JS/) | Juego de la bomba con DOM y temporizador |
| [E-Commerce](E-Commerce/) | Tienda con carrito y pago con Mercado Pago |
| [PERN-STACK](PERN-STACK/) | App full-stack de tareas (PostgreSQL, Express, React y Node) |

## BOMBA-JS — Juego de la bomba

Juego web con HTML, CSS y JavaScript: una bomba con temporizador, alarma y explosión, con sonido y una secuencia de activación.

- [index.html](BOMBA-JS/index.html) — estructura del juego
- [prueba.js](BOMBA-JS/prueba.js) — cuenta regresiva, activación y detonación
- [css/style.css](BOMBA-JS/css/style.css) — estilos y animaciones

## E-Commerce — Tienda con carrito

Frontend en HTML, CSS y JavaScript con catálogo de productos y carrito, más un backend en Express que genera la preferencia de pago de Mercado Pago.

- [client/index.html](E-Commerce/client/index.html) — estructura de la tienda
- [client/js/products.js](E-Commerce/client/js/products.js) — catálogo de productos
- [client/js/index.js](E-Commerce/client/js/index.js) — render de productos y carga al carrito
- [client/js/cart.js](E-Commerce/client/js/cart.js) — lógica y vista del carrito
- [client/styles.css](E-Commerce/client/styles.css) — estilos
- [server/server.js](E-Commerce/server/server.js) — servidor Express y preferencia de Mercado Pago

## PERN-STACK — Tareas full-stack

Aplicación de tareas con autenticación por JWT: backend REST en Express con PostgreSQL y frontend en React, Vite y Tailwind.

**Backend** (`src/`):

- [index.js](PERN-STACK/src/index.js) — punto de entrada del servidor
- [app.js](PERN-STACK/src/app.js) — configuración de Express y rutas
- [db.js](PERN-STACK/src/db.js) — pool de PostgreSQL
- [config.js](PERN-STACK/src/config.js) — configuración general
- [controllers/auth.controller.js](PERN-STACK/src/controllers/auth.controller.js) · [controllers/tareas.controllers.js](PERN-STACK/src/controllers/tareas.controllers.js) — controladores
- [router/auth.routes.js](PERN-STACK/src/router/auth.routes.js) · [router/tareas.routes.js](PERN-STACK/src/router/tareas.routes.js) — rutas
- [middlewares/auth.middleware.js](PERN-STACK/src/middlewares/auth.middleware.js) · [middlewares/validate.middleware.js](PERN-STACK/src/middlewares/validate.middleware.js) — autenticación y validación
- [schemas/auth.schema.js](PERN-STACK/src/schemas/auth.schema.js) · [schemas/tareas.schema.js](PERN-STACK/src/schemas/tareas.schema.js) — esquemas de Zod
- [libs/jwt.js](PERN-STACK/src/libs/jwt.js) — firma y verificación de tokens

**Frontend** (`frontend/src/`):

- [main.jsx](PERN-STACK/frontend/src/main.jsx) · [App.jsx](PERN-STACK/frontend/src/App.jsx) — arranque y ruteo
- [api/axios.js](PERN-STACK/frontend/src/api/axios.js) · [api/tareas.api.js](PERN-STACK/frontend/src/api/tareas.api.js) — cliente HTTP
- [context/AuthContext.jsx](PERN-STACK/frontend/src/context/AuthContext.jsx) · [context/TareasContext.jsx](PERN-STACK/frontend/src/context/TareasContext.jsx) — estado global
- Páginas: [HomePage](PERN-STACK/frontend/src/pages/HomePage.jsx) · [LoginPage](PERN-STACK/frontend/src/pages/LoginPage.jsx) · [RegisterPage](PERN-STACK/frontend/src/pages/RegisterPage.jsx) · [TareasPage](PERN-STACK/frontend/src/pages/TareasPage.jsx) · [TareaFormPage](PERN-STACK/frontend/src/pages/TareaFormPage.jsx) · [ProfilePage](PERN-STACK/frontend/src/pages/ProfilePage.jsx) · [AboutPage](PERN-STACK/frontend/src/pages/AboutPage.jsx) · [NotFound](PERN-STACK/frontend/src/pages/NotFound.jsx)
- Componentes: [Navbar](PERN-STACK/frontend/src/components/navbar/Navbar.jsx) · [navigation](PERN-STACK/frontend/src/components/navbar/navigation.jsx) · [ProtectedRoute](PERN-STACK/frontend/src/components/ProtectedRoute.jsx) · [CardTareas](PERN-STACK/frontend/src/components/tareas/CardTareas.jsx)
- Componentes UI: [button](PERN-STACK/frontend/src/components/ui/button.jsx) · [card](PERN-STACK/frontend/src/components/ui/card.jsx) · [Container](PERN-STACK/frontend/src/components/ui/Container.jsx) · [input](PERN-STACK/frontend/src/components/ui/input.jsx) · [Label](PERN-STACK/frontend/src/components/ui/Label.jsx) · [Textarea](PERN-STACK/frontend/src/components/ui/Textarea.jsx) · [index](PERN-STACK/frontend/src/components/ui/index.js)
