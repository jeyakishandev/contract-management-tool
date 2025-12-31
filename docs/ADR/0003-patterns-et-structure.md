# ADR 0003 : Patterns et Structure de Code

**Statut** : ✅ Accepté  
**Date** : 2024-01-XX  
**Décideurs** : Lead Dev  
**Contexte** : Organisation du code backend et frontend, patterns à suivre

## Décisions

### Backend : Repository Pattern + Service Layer

**Structure** :
```
routes/     → Gestion HTTP (req/res)
services/   → Logique métier (validation, règles, orchestration)
repositories/ → Accès données (CRUD DB, abstrait de Prisma)
```

**Pourquoi** :
- ✅ **Séparation des responsabilités** : Routes = HTTP, Services = Business, Repos = Data
- ✅ **Testabilité** : Services testables sans DB (mocking repos)
- ✅ **Maintenabilité** : Changer d'ORM plus tard = modifier uniquement repos
- ✅ **Réutilisabilité** : Services utilisables par jobs, CLI, etc.

**Exemple** :
```typescript
// Route (HTTP layer)
POST /api/contracts
  → ContractController.create()
    → ContractService.createContract(data, userId)
      → ContractRepository.create(data)
      → AuditLogRepository.create(action, userId, entity)
```

**Alternatives considérées** :
- **ActiveRecord** : ❌ Logique métier dans modèles → difficile à tester
- **Transaction Script** : ❌ Pas de réutilisabilité, code dupliqué

### Frontend : Component Composition + Custom Hooks

**Structure** :
```
components/  → Composants UI réutilisables
  ui/        → Composants de base (Button, Input, etc.)
hooks/       → Logique réutilisable (useAuth, useContracts)
lib/         → Utilitaires, clients API
```

**Pourquoi** :
- ✅ **Composition** : Composants petits et réutilisables
- ✅ **Hooks** : Logique partagée (fetch, state, auth)
- ✅ **Séparation** : UI / Logique / Données

### Validation : Backend + Frontend

**Stratégie** :
- **Frontend** : Validation UX (feedback immédiat, HTML5 + Zod pour formulaires)
- **Backend** : Validation sécurité (TOUJOURS, même si frontend valide)

**Pourquoi** :
- ✅ Frontend valide = meilleure UX
- ✅ Backend valide = sécurité (ne jamais faire confiance au client)

### Gestion d'erreurs : Classes d'erreurs custom

**Stratégie** :
```typescript
AppError (base)
  ├── ValidationError (400)
  ├── NotFoundError (404)
  ├── UnauthorizedError (401)
  └── ForbiddenError (403)
```

**Pourquoi** :
- ✅ Erreurs typées et structurées
- ✅ Middleware global gère toutes les erreurs
- ✅ Messages cohérents frontend/backend

### Logging : Winston

**Stratégie** :
- Niveaux : error, warn, info, debug
- Format : JSON structuré (production) ou pretty (dev)
- Sortie : Console (dev) + File (prod)

**Pourquoi** :
- ✅ Logs structurés (parsing facile)
- ✅ Niveaux configurables
- ✅ Intégration facile avec outils monitoring (Sentry, etc.)

## Conséquences

### Positives
- ✅ Code organisé et prévisible
- ✅ Tests faciles (mocking simple)
- ✅ Onboarding rapide (structure claire)

### Négatives
- ⚠️ Plus de fichiers (mais meilleure organisation)
- ⚠️ Un peu plus verbeux (mais maintenabilité > concision)

## Implémentation

Voir structure détaillée dans `docs/ARCHITECTURE_DETAILLEE.md` (structure complète + conventions + diagramme flux).

