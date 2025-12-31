# Architecture du Projet - Contract & Obligation Management Tool

## Vue d'ensemble

Application monolithique modulaire (pas de microservices) avec séparation claire des responsabilités :

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Pages   │  │ Components│  │  API     │  │  Hooks   │    │
│  │  (App)   │  │  (UI)    │  │  Client  │  │  (State) │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (Express)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Routes   │  │Services  │  │ Repos    │  │Middleware│    │
│  │ (HTTP)   │  │(Business)│  │ (Data)   │  │(Auth/Val)│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Users    │  │Contracts │  │Obligations│ │Audit Log │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Jobs (Cron)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Job Scheduler (node-cron)                       │
│  ┌──────────┐  ┌──────────┐                                 │
│  │Notif Jobs│  │Email Jobs│                                 │
│  └──────────┘  └──────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

## Structure des dossiers

```
Contract/
├── backend/
│   ├── src/
│   │   ├── api/              # Routes HTTP
│   │   │   ├── auth/
│   │   │   ├── contracts/
│   │   │   ├── obligations/
│   │   │   └── users/
│   │   ├── services/         # Logique métier
│   │   │   ├── auth.service.ts
│   │   │   ├── contract.service.ts
│   │   │   ├── obligation.service.ts
│   │   │   └── notification.service.ts
│   │   ├── repositories/     # Accès aux données (DAO)
│   │   │   ├── user.repository.ts
│   │   │   ├── contract.repository.ts
│   │   │   └── obligation.repository.ts
│   │   ├── models/           # Modèles TypeScript (DTOs)
│   │   ├── middleware/       # Auth, validation, logging
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── utils/            # Helpers
│   │   │   ├── logger.ts
│   │   │   ├── validators.ts
│   │   │   └── errors.ts
│   │   ├── jobs/             # Jobs planifiés
│   │   │   └── notification.job.ts
│   │   ├── database/         # Migrations, seeds, config
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   └── index.ts
│   │   └── app.ts            # Point d'entrée Express
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── (auth)/
│   │   │   ├── (dashboard)/
│   │   │   └── api/          # API Routes (si besoin)
│   │   ├── components/       # Composants réutilisables
│   │   │   ├── ui/           # Composants de base (Button, Input, etc.)
│   │   │   ├── contracts/
│   │   │   └── obligations/
│   │   ├── hooks/            # Custom hooks React
│   │   ├── lib/              # Utilitaires, clients API
│   │   │   ├── api-client.ts
│   │   │   └── auth.ts
│   │   ├── types/            # Types TypeScript partagés
│   │   └── styles/           # CSS global
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md
│   ├── ARCHITECTURE_DETAILLEE.md
│   ├── ADR/
│   ├── MCD_V2.md
│   ├── MLD_V2.md
│   └── DICTIONNAIRE_DONNEES_V2.md
│
├── docker-compose.yml        # Dev environnement
├── .github/workflows/        # CI/CD
└── README.md
```

## Flux de données

### Authentification
1. User soumet email/password → Frontend
2. Frontend appelle `/api/auth/login`
3. Backend vérifie credentials → génère JWT
4. Frontend stocke JWT (httpOnly cookie ou localStorage)
5. Toutes requêtes suivantes incluent JWT dans header

### Création de contrat
1. User remplit formulaire → Frontend
2. Frontend valide côté client → appelle `/api/contracts`
3. Backend middleware : vérifie JWT + rôles
4. Service valide données métier
5. Repository insère en DB
6. Audit log créé automatiquement
7. Réponse retournée au frontend

### Notifications
1. Job cron tourne quotidiennement (ex: 9h du matin)
2. Job interroge obligations avec dates dans [J, J+90]
3. Service calcule jours restants (90/60/30)
4. Service crée notifications in-app
5. Service envoie emails (si configuré)
6. Logs générés pour traçabilité

## Patterns utilisés

### Backend
- **Repository Pattern** : Séparation accès données / logique métier
- **Service Layer** : Logique métier isolée des routes
- **Middleware Chain** : Auth → Validation → Route Handler → Error Handler
- **DTO Pattern** : Validation des entrées/sorties
- **Dependency Injection** : Services injectés dans routes via constructeur

### Frontend
- **Component Composition** : Composants réutilisables
- **Custom Hooks** : Logique réutilisable (useAuth, useContracts)
- **API Client** : Abstraction des appels HTTP
- **Context API** : État global (auth, notifications)

## Sécurité

1. **JWT** : Tokens signés avec expiration (15min access, 7j refresh)
2. **Password Hashing** : bcrypt avec salt rounds 10
3. **Input Validation** : Zod (backend) + HTML5 (frontend)
4. **SQL Injection** : Requêtes paramétrées (pas de concaténation)
5. **CORS** : Configuration stricte (origins autorisés)
6. **Rate Limiting** : Limite requêtes par IP
7. **HTTPS** : En production (reverse proxy nginx)

## Logging & Monitoring

- **Winston** : Logs structurés (info, warn, error)
- **Morgan** : Logs HTTP middleware
- **Error Tracking** : Capture stack traces avec contexte
- **Audit Trail** : Toutes actions critiques loggées en DB

## Tests

- **Unitaires** : Jest (services, utils, repositories)
- **Intégration** : Supertest (API endpoints)
- **E2E** : (Optionnel) Playwright pour workflows critiques
- **Coverage** : Minimum 70% sur code métier

