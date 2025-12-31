# ADR 0002 : Stack Technologique

**Statut** : ✅ Accepté  
**Date** : 2024-01-XX  
**Décideurs** : Lead Dev  
**Contexte** : Choix des technologies pour backend, frontend, base de données

## Décisions

### Backend : Node.js + TypeScript + Express

**Pourquoi** :
- ✅ TypeScript : Type-safety, meilleure DX, moins de bugs en production
- ✅ Express : Framework mature, écosystème riche, léger
- ✅ Node.js : Même langage frontend/backend, communauté active

**Alternatives considérées** :
- **NestJS** : ❌ Trop lourd pour un projet simple, sur-ingénierie
- **Fastify** : ⚠️ Plus rapide mais Express suffit, écosystème moins riche
- **Python/Django** : ❌ Langage différent du frontend, pas demandé

### Base de données : PostgreSQL

**Pourquoi** :
- ✅ Relationnelle : Parfait pour données structurées (contrats, obligations, relations)
- ✅ ACID : Garanties transactionnelles importantes (audit trail, cohérence)
- ✅ JSONB : Flexibilité si besoin (old_value/new_value en audit)
- ✅ Mature, robuste, open-source

**Alternatives considérées** :
- **MongoDB** : ❌ Pas adapté pour relations complexes, pas ACID par défaut
- **MySQL** : ⚠️ Bon mais PostgreSQL offre plus (JSONB, array types)
- **SQLite** : ❌ Pas adapté production multi-utilisateurs

### Frontend : Next.js (React) + TypeScript

**Pourquoi** :
- ✅ Next.js : SSR/SSG, routing intégré, API routes si besoin, déploiement simple
- ✅ React : Standard, écosystème riche, composants réutilisables
- ✅ TypeScript : Cohérence avec backend, type-safety

**Alternatives considérées** :
- **Vue.js** : ⚠️ Bon mais moins d'écosystème, pas demandé
- **SvelteKit** : ⚠️ Prometteur mais moins mature
- **Create React App** : ❌ Déprécié, Next.js meilleur choix

### ORM : Prisma ou TypeORM ?

**Décision** : Prisma

**Pourquoi Prisma** :
- ✅ Type-safety end-to-end (génération types TypeScript)
- ✅ Migrations simples et sûres
- ✅ Excellent DX (Prisma Studio, introspection)
- ✅ Query builder intuitif

**Alternatives** :
- **TypeORM** : ⚠️ Plus de features (relation complexe) mais plus verbeux, types moins sûrs
- **Sequelize** : ❌ Déclin, moins maintenu
- **Knex.js** : ❌ Query builder pur, pas d'ORM, plus de code boilerplate

### Validation : Zod

**Pourquoi** :
- ✅ TypeScript-first (inférence de types)
- ✅ Validation runtime + génération de types
- ✅ API simple et expressive
- ✅ Alternatives : Joi (plus lourd), class-validator (moins type-safe)

### Authentification : JWT

**Pourquoi** :
- ✅ Stateless (pas de session DB)
- ✅ Scalable
- ✅ Standard industrie
- Alternatives : Session cookie (nécessite Redis/session store), OAuth (overkill V1)

### Stockage fichiers : Local (dev) → S3 (prod optionnel)

**Pourquoi** :
- ✅ Local en dev : Simple, pas de dépendance externe
- ✅ S3 en prod : Scalable, robuste, standard cloud
- Alternatives : MinIO (S3-compatible self-hosted), Cloudinary (overkill)

### Jobs planifiés : node-cron

**Pourquoi** :
- ✅ Simple, léger, intégré Node.js
- ✅ Suffisant pour V1 (notifications quotidiennes)
- ⚠️ Limite : Pas de retry automatique, pas de queue → migration vers Bull + Redis si besoin

## Conséquences

- ✅ Stack cohérente et moderne
- ✅ Bonne DX (TypeScript partout)
- ✅ Maintenabilité à long terme
- ⚠️ Prisma : Courbe d'apprentissage si nouvelle équipe
- ⚠️ node-cron : Limitation si jobs complexes → migration future possible

