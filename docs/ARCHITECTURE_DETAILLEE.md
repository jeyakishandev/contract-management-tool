# Architecture Détaillée - Contract & Obligation Management Tool

## Type de Repository

**Choix** : **Monorepo** (backend + frontend dans même repository)

**Structure** :
```
Contract/
├── backend/          # API Express
├── frontend/         # Next.js App
├── docs/             # Documentation
├── docker-compose.yml
└── README.md
```

**Avantages** :
- ✅ **Coordination** : Changements frontend/backend synchronisés
- ✅ **Partage** : Types TypeScript partagés possible (package workspace)
- ✅ **CI/CD** : Un seul pipeline
- ✅ **Versioning** : Versions alignées

**Alternative rejetée** : Multi-repo (complexité gestion, synchronisation)

---

## Structure des Dossiers

### Backend

```
backend/
├── src/
│   ├── api/                      # Routes HTTP (Controllers)
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.controller.ts
│   │   ├── contracts/
│   │   │   ├── contract.routes.ts
│   │   │   └── contract.controller.ts
│   │   ├── obligations/
│   │   └── users/
│   │
│   ├── services/                 # Logique métier
│   │   ├── auth.service.ts
│   │   ├── contract.service.ts
│   │   ├── obligation.service.ts
│   │   ├── notification.service.ts
│   │   ├── audit.service.ts
│   │   └── storage/
│   │       ├── storage.service.ts (interface)
│   │       └── local-storage.service.ts
│   │
│   ├── repositories/             # Accès aux données (DAO)
│   │   ├── user.repository.ts
│   │   ├── contract.repository.ts
│   │   ├── obligation.repository.ts
│   │   ├── notification.repository.ts
│   │   └── audit-log.repository.ts
│   │
│   ├── models/                   # DTOs / Types TypeScript
│   │   ├── user.model.ts
│   │   ├── contract.model.ts
│   │   └── ...
│   │
│   ├── middleware/               # Middleware Express
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── utils/                    # Helpers
│   │   ├── logger.ts             # Winston config
│   │   ├── errors.ts             # Classes erreurs custom
│   │   └── validators.ts         # Helpers validation
│   │
│   ├── jobs/                     # Jobs planifiés
│   │   └── notification.job.ts
│   │
│   ├── database/                 # Prisma
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── index.ts              # Prisma client export
│   │
│   └── app.ts                    # Point d'entrée Express
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── repositories/
│   └── integration/
│       └── api/
│
├── prisma/
│   └── schema.prisma
│
├── uploads/                      # Fichiers locaux (dev, gitignored)
│
├── package.json
├── tsconfig.json
└── .env.example
```

### Frontend

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/          # Route group protégé
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── contracts/
│   │   │   │   ├── page.tsx      # Liste
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx  # Détail
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   └── obligations/
│   │   │
│   │   └── api/                  # API Routes Next.js (si besoin)
│   │
│   ├── components/               # Composants React
│   │   ├── ui/                   # Composants de base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Table.tsx
│   │   │
│   │   ├── contracts/
│   │   │   ├── ContractCard.tsx
│   │   │   ├── ContractTable.tsx
│   │   │   └── ContractForm.tsx
│   │   │
│   │   ├── obligations/
│   │   │   └── ...
│   │   │
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── NotificationBadge.tsx
│   │
│   ├── hooks/                    # Custom hooks React
│   │   ├── useAuth.ts
│   │   ├── useContracts.ts
│   │   └── useNotifications.ts
│   │
│   ├── lib/                      # Utilitaires
│   │   ├── api-client.ts         # Client HTTP (fetch wrapper)
│   │   └── auth.ts               # Helpers auth (token storage)
│   │
│   ├── types/                    # Types TypeScript partagés
│   │   ├── user.types.ts
│   │   ├── contract.types.ts
│   │   └── api.types.ts
│   │
│   └── styles/
│       └── globals.css           # CSS global (Tailwind)
│
├── tests/
│   └── components/
│
├── public/                       # Assets statiques
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## Conventions de Nommage

### Backend

**Fichiers** :
- Routes : `*.routes.ts` (ex: `contract.routes.ts`)
- Controllers : `*.controller.ts` (ex: `contract.controller.ts`)
- Services : `*.service.ts` (ex: `contract.service.ts`)
- Repositories : `*.repository.ts` (ex: `contract.repository.ts`)
- Middleware : `*.middleware.ts` (ex: `auth.middleware.ts`)
- Models/DTOs : `*.model.ts` (ex: `contract.model.ts`)

**Classes** :
- PascalCase : `ContractService`, `UserRepository`, `AuthMiddleware`

**Fonctions** :
- camelCase : `createContract`, `findByEmail`, `validateToken`

**Variables** :
- camelCase : `contractId`, `userEmail`, `isActive`

**Constantes** :
- UPPER_SNAKE_CASE : `MAX_FILE_SIZE`, `JWT_SECRET`

**Routes API** :
- RESTful : `/api/contracts`, `/api/contracts/:id`, `/api/contracts/:id/status`
- Ressources au pluriel : `contracts` pas `contract`

### Frontend

**Composants** :
- PascalCase : `ContractCard`, `UserProfile`, `NotificationBadge`
- Fichiers : `ContractCard.tsx`

**Hooks** :
- camelCase avec préfixe `use` : `useAuth`, `useContracts`

**Fonctions utilitaires** :
- camelCase : `formatDate`, `validateEmail`, `apiClient`

**Variables** :
- camelCase : `isLoading`, `contractList`, `selectedContract`

**Constantes** :
- UPPER_SNAKE_CASE : `API_BASE_URL`, `MAX_UPLOAD_SIZE`

---

## Diagramme de Flux - Requête → Services → DB

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                            │
│                                                                 │
│  User action (ex: Créer contrat)                               │
│  → Formulaire soumis                                           │
│  → API Client (fetch)                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST /api/contracts
                              │ Headers: Authorization: Bearer <token>
                              │ Body: { title, reference, ... }
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND - EXPRESS SERVER                           │
│                                                                 │
│  1. MIDDLEWARE CHAIN                                            │
│     ├─ CORS middleware                                          │
│     ├─ Body parser (JSON)                                      │
│     ├─ Morgan (HTTP logging)                                   │
│     │                                                           │
│  2. ROUTE HANDLER                                               │
│     POST /api/contracts                                         │
│     └─ contract.controller.create()                            │
│                                                                 │
│  3. MIDDLEWARE AUTH                                             │
│     └─ requireAuth()                                            │
│        ├─ Lit token header                                     │
│        ├─ Valide JWT (jsonwebtoken)                            │
│        ├─ Récupère user depuis DB                              │
│        └─ Ajoute req.user                                      │
│                                                                 │
│  4. MIDDLEWARE VALIDATION                                       │
│     └─ validateRequest(schema)                                  │
│        ├─ Valide body avec Zod                                 │
│        └─ Rejette si invalide (400)                            │
│                                                                 │
│  5. MIDDLEWARE AUTHORIZATION                                    │
│     └─ requireRole(['ADMIN', 'MANAGER'])                        │
│        ├─ Vérifie req.user.role                                │
│        └─ Rejette si non autorisé (403)                        │
│                                                                 │
│  6. CONTROLLER                                                  │
│     contract.controller.create(req, res, next)                  │
│     └─ Appelle service                                          │
│        const contract = await contractService                   │
│          .createContract(req.body, req.user.id)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                │
│                                                                 │
│  ContractService.createContract(data, userId)                   │
│                                                                 │
│  1. VALIDATION MÉTIER                                           │
│     ├─ Vérifie reference unique                                │
│     ├─ Vérifie dates (end >= start)                            │
│     └─ Lance ValidationError si invalide                       │
│                                                                 │
│  2. PRÉPARATION DONNÉES                                         │
│     ├─ Détermine status (DEFAULT: 'DRAFT')                     │
│     ├─ Ajoute created_by_id = userId                           │
│     └─ Format données pour repository                          │
│                                                                 │
│  3. APPEL REPOSITORY                                            │
│     const contract = await contractRepository                   │
│       .create(contractData)                                     │
│                                                                 │
│  4. AUDIT TRAIL (après création)                                │
│     await auditService.logAction({                              │
│       action: 'CREATE',                                         │
│       entityType: 'CONTRACT',                                   │
│       entityId: contract.id,                                    │
│       userId,                                                   │
│       newValue: contract                                        │
│     })                                                          │
│                                                                 │
│  5. RETOUR                                                      │
│     return contract                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  REPOSITORY LAYER                               │
│                                                                 │
│  ContractRepository.create(data)                                │
│                                                                 │
│  1. CONVERSION DONNÉES                                          │
│     └─ Transforme data → format Prisma                         │
│                                                                 │
│  2. APPEL PRISMA                                                │
│     return await prisma.contract.create({                       │
│       data: {                                                   │
│         title: data.title,                                      │
│         reference: data.reference,                              │
│         ...                                                     │
│         created_by_id: data.created_by_id                      │
│       }                                                         │
│     })                                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL via Prisma Client
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   POSTGRESQL DATABASE                           │
│                                                                 │
│  INSERT INTO contracts (...)                                    │
│  VALUES (...);                                                  │
│                                                                 │
│  ┌──────────────┐                                              │
│  │  contracts   │                                              │
│  ├──────────────┤                                              │
│  │ id: 1        │                                              │
│  │ title: ...   │                                              │
│  │ status: ...  │                                              │
│  └──────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Résultat retourné
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              RETOUR (Service → Controller)                      │
│                                                                 │
│  Controller reçoit contract                                     │
│  └─ res.status(201).json(contract)                             │
│                                                                 │
│  MIDDLEWARE ERROR HANDLER (si erreur)                           │
│  └─ Capture erreur                                              │
│     ├─ Log avec Winston                                        │
│     └─ res.status(err.statusCode).json({ error: ... })         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP 201 Created
                              │ Body: { id, title, ... }
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                            │
│                                                                 │
│  API Client reçoit réponse                                      │
│  └─ Mise à jour état (React)                                   │
│     └─ Redirection ou notification                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Résumé du flux** :
1. **Client** → Requête HTTP avec JWT
2. **Middleware** → Auth + Validation + Authorization
3. **Controller** → Ordonne action
4. **Service** → Logique métier + Validation
5. **Repository** → Accès données (Prisma)
6. **Database** → Stockage PostgreSQL
7. **Retour** → Service → Controller → Client

---

## Questions d'Entretien sur ces Choix

### 1. ORM / Query Builder
**Question** : Pourquoi avoir choisi Prisma plutôt qu'un query builder pur comme Knex.js ? Dans quels cas utiliseriez-vous `prisma.$queryRaw` pour du SQL brut ?

**Réponse attendue** :
- Prisma offre type-safety automatique et DX supérieure
- Knex nécessiterait plus de code boilerplate
- `prisma.$queryRaw` pour requêtes complexes (analytics, aggregations) ou optimisations SQL spécifiques
- Exemple : Vues matérialisées PostgreSQL, requêtes avec window functions

---

### 2. Authentification JWT
**Question** : Avec JWT, comment gérez-vous la révocation immédiate d'un token compromis ? Que se passe-t-il si un utilisateur se déconnecte ou change de rôle ?

**Réponse attendue** :
- Access token expire rapidement (15min) limite la fenêtre de vulnérabilité
- Refresh token stocké en DB avec flag `revoked` → révocation immédiate possible
- Déconnexion → révoquer refresh token → access token expire dans 15min max
- Changement rôle → access token reste valide 15min (acceptable pour sécurité)
- Alternative : Blacklist tokens révoqués (table + TTL) si besoin révocation immédiate

---

### 3. Upload Fichiers
**Question** : Pourquoi avoir créé une abstraction StorageService plutôt que d'utiliser directement multer + filesystem en dev et S3 en prod avec des conditions if/else ?

**Réponse attendue** :
- Abstraction = découplage logique métier / implémentation stockage
- Tests simplifiés (mock interface facilement)
- Migration transparente (changer implémentation sans modifier services)
- Principes SOLID : Open/Closed (ouvert à extension, fermé à modification)
- Évolutivité : Ajouter MinIO, Azure Blob, etc. sans toucher code métier

---

### 4. Jobs Planifiés
**Question** : Si votre job de notifications échoue (erreur DB, timeout), comment garantissez-vous qu'il sera réexécuté ? Que feriez-vous si vous avez 10 000 notifications à envoyer par jour ?

**Réponse attendue** :
- V1 : node-cron simple → job réexécuté au prochain run (24h) si échec
- Limitation acceptable V1 (< 100 notifications/jour)
- Si > 1000 notifications/jour → Migrer vers Bull + Redis :
  - Retry automatique avec backoff
  - Jobs persistés (pas perdus)
  - Workers parallèles (scalabilité)
  - Monitoring dashboard
- Transition : Code métier (NotificationService) inchangé, seul scheduler change

---

### 5. Logging / Error Handling
**Question** : Comment différenciez-vous une erreur "attendue" (ex: validation échouée) d'une erreur "inattendue" (ex: bug code) dans vos logs ? Comment éviteriez-vous d'exposer des informations sensibles (stack traces, secrets) en production ?

**Réponse attendue** :
- Classes erreurs custom : `AppError.isOperational` distingue erreurs attendues/inattendues
- Erreurs opérationnelles : Loggées en `warn`/`info`, message retourné au client
- Erreurs inattendues : Loggées en `error` avec stack, message générique au client
- Winston : Format JSON en prod (pas de stack trace dans réponse HTTP)
- Variables sensibles : Filtrées avant logging (helper `sanitizeForLogging`)
- Monitoring : Intégration Sentry/DataDog pour alertes erreurs critiques

---

## Références

- [ADR 0001](./ADR/0001-architecture-monolithique.md) - Architecture monolithique
- [ADR 0002](./ADR/0002-stack-technologique.md) - Stack technologique
- [ADR 0003](./ADR/0003-patterns-et-structure.md) - Patterns et structure
- [ADR 0004](./ADR/0004-orm-query-builder.md) - ORM / Query Builder
- [ADR 0005](./ADR/0005-authentification.md) - Authentification
- [ADR 0006](./ADR/0006-upload-fichiers.md) - Upload fichiers
- [ADR 0007](./ADR/0007-jobs-planifies.md) - Jobs planifiés
- [ADR 0008](./ADR/0008-logging-error-handling.md) - Logging / Error Handling

