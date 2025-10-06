# DIPLOMADO INGENIERÍA DE CALIDAD DE SOFTWARE COMERCIAL (3ra Edición)
## CARRERA DE INGENIERÍA INFORMÁTICA Y SISTEMAS
### Módulo 6 - Automatización de Pruebas en Sistemas Web

---

### Instalación

1. Inicializar Playwright (opcional, ya está configurado en este proyecto):  
```bash
npm init playwright@latest
```

2. Instalar dependencias:  
```bash
npm install
```
3. Por defecto, con npm install se instala solo el navegador chromium.
Si se desea instalar todos los navegadores se debe cambiar en package.json el script: **"postinstall": "npx playwright install chromium"** de la siguente manera:
```
"postinstall": "npx playwright install --with-dep"
```
> Para éste proyecto solo estamos usando el navegador chromuim.

---

### Ejecución de Tests

El proyecto está configurado con **Playwright Projects** para separar API y UI:

> Comandos principales

| Comando | Descripción |
|---------|-------------|
| `npm run test` | Ejecuta **todos los tests** (API + UI Login + UI Autenticados) |
| `npm run test:api` | Ejecuta solo los tests de **API** (`tests/api/**/*.spec.ts`) |
| `npm run test:login` | Ejecuta solo el test de **login UI** (`tests/ui/login.spec.ts`) |
| `npm run test:ui` | Ejecuta los tests de **UI autenticados** (`tests/ui/**/*.spec.ts` excepto `login.spec.ts`) |

> Comandos extras

| Comando | Descripción |
|---------|-------------|
| `npx playwright test tests/api/api.spec.ts` | Ejecuta un archivo específico |
| `npx playwright test -g "Recuperar board"` | Ejecuta un test específico por su título |
| `npx playwright test --headed` | Corre los tests con navegador visible |
| `npx playwright test --ui` | Abre la interfaz visual de Playwright Test Runner |
| `npx playwright test --debug` | Corre en modo debug (pausas, inspector) |

---

### Estructura relevante

```
├── tests/
│   ├── api/                    # Tests de API
│   │   └── api.spec.ts
│   └── ui/                     # Tests de UI
│       ├── login.spec.ts       # Login en frío
│       └── ui.spec.ts          # Tests autenticados
├── config/                     # Global setup, teardown, helpers
├── utils/                      # Utilidades y helpers compartidos
├── playwright.config.ts        # Configuración de Playwright con projects
├── .env                        # Variables de entorno (API y UI)
```

---

### Ejemplo de `.env`

```ini
# Environment variables for Trello API access
BASE_URL=https://api.trello.com/1/
API_KEY=your_api_key
API_TOKEN=your_api_token

# Environment variables for Trello UI access
EMAIL=your_email@example.com
PASSWORD=your_password
BASE_URL_UI=https://trello.com
MFA=your_mfa_secret
USERNAME=your_username
```