# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Legalis is a Cuban legal information portal (by elTOQUE) built with **Angular 13** and **TypeScript**. It provides search, browsing, and analysis of normative documents, official gazettes, and legal glossaries. The app uses SSR via `@nguniversal` and is deployed to Netlify.

## Commands

```bash
yarn start              # Dev server (ng serve)
yarn build              # Production build with service worker
yarn build:ssr          # Build with SSR
yarn build:netlify      # Production build for Netlify deployment
yarn dev:ssr            # Dev server with SSR
yarn test               # Run Jest tests
yarn test:ci            # Lint + tests in CI mode
yarn lint               # ESLint (TS + HTML) + Stylelint (SCSS)
```

## Architecture

### Path Aliases (tsconfig.json)
- `@app/*` → `src/app/*`
- `@shared` / `@shared/*` → `src/app/@shared/`
- `@env/*` → `src/environments/*`

### Module Structure
All feature modules are **lazy-loaded** via `Shell.childRoutes()` in `app-routing.module.ts`:

| Route | Module |
|-------|--------|
| `/` | Home (eager) |
| `/busqueda-avanzada` | AdvancedSearchModule |
| `/consultas` | AnalysisModule |
| `/glosario` | GlossaryModule |
| `/normativa` | NormativeModule |
| `/gacetas` | GazettesModule |
| `/busqueda` | SearchResultsModule |
| `/acerca-de` | AboutModule |
| `/como-buscar` | HowToSearchModule |

The `Shell` service (`src/app/shell/shell.service.ts`) wraps child routes with the shared layout (header/footer).

### Shared Layer (`src/app/@shared/`)
- **services/**: `ApiService` (main HTTP client), `LayoutService`, `ScreenSizeService`, `RequestCacheService`
- **components/**: Reusable UI components
- **model/**: TypeScript interfaces/models
- **http/**: HTTP interceptors — `ApiPrefixInterceptor`, `ErrorHandlerInterceptor`, `CachingInterceptor`, custom URL encoders
- **pipe/**: Custom pipes (highlight, decode-uri)

### HTTP Layer
No state management library — uses RxJS Observables directly. HTTP interceptors handle API prefix injection, error handling, response caching, and URL encoding.

### Environment Config
API URLs are in `src/environments/`:
- `environment.ts` — dev API: `api-gaceta.datalis.dev`
- `environment.prod.ts` — prod API: `api-gaceta.eltoque.com`

### Styling
- **SCSS** with **Bootstrap 5** and **@ng-bootstrap**
- Theme variables in `src/theme/`
- Component selector prefix: `app-` (kebab-case for components, camelCase for directives)

### SSR & PWA
- Server-side rendering via `@nguniversal/express-engine`
- Service worker configured in `ngsw-config.json`
- App shell for fast initial load
- Route preloading: `PreloadAllModules`

### i18n
Uses `@ngx-translate/core`. Default language: `es-CU` (Spanish/Cuba).

### Testing
Jest with `jest-preset-angular`. Test files follow `*.spec.ts` convention.
