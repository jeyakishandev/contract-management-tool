# Contract & Obligation Management Tool

Outil interne de gestion des contrats et obligations pour PME.

## 🎯 Fonctionnalités (V1)

- ✅ Authentification avec rôles (ADMIN, MANAGER, VIEWER)
- ✅ Gestion des contrats (CRUD + upload PDF)
- ✅ Gestion des obligations/échéances (CRUD + récurrence)
- ✅ Notifications in-app + email (rappels 90/60/30 jours)
- ✅ Workflow contrats : DRAFT → ACTIVE → SUSPENDED → CLOSING → ARCHIVED
- ✅ Audit trail complet (qui a changé quoi, quand, pourquoi)
- ✅ Dashboard : prochaines échéances, contrats à risque, stats

## 🛠️ Stack Technique

- **Backend** : Node.js + TypeScript + Express
- **Database** : PostgreSQL + Prisma ORM
- **Frontend** : Next.js (React) + TypeScript + Tailwind CSS
- **Auth** : JWT
- **Jobs** : node-cron
- **Tests** : Jest + Supertest

## 📁 Structure du Projet

```
Contract/
├── backend/          # API Express
├── frontend/         # Next.js App
├── docs/             # Documentation (MCD, MLD, ADR, etc.)
└── docker-compose.yml
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

1. **Installer les dépendances**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. **Configurer les variables d'environnement**

Backend :
```bash
cd backend
cp .env.example .env
# Éditer .env avec vos valeurs
```

Frontend :
```bash
cd frontend
cp .env.example .env.local
```

3. **Lancer les serveurs**

Terminal 1 (Backend) :
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend) :
```bash
cd frontend
npm run dev
```

4. **Accéder à l'application**
- Frontend : http://localhost:3000
- Backend API : http://localhost:3001
- Health Check : http://localhost:3001/health

📖 **Guide complet** : Voir [GUIDE_DEMARRAGE.md](./GUIDE_DEMARRAGE.md) pour détails, scripts, linting, formatage.

## 👤 Compte par défaut

Après `npm run seed` :
- Email : `admin@example.com`
- Password : `admin123`
- Role : `ADMIN`

⚠️ **À changer en production !**

## 📚 Documentation

### Modèles de Données (V2 - Améliorés)
- [Modèle Conceptuel de Données (MCD) V2](./docs/MCD_V2.md) - Entités + relations + workflow
- [Modèle Logique de Données (MLD) V2](./docs/MLD_V2.md) - Variantes Simple vs Robuste + trade-offs
- [Dictionnaire de Données V2](./docs/DICTIONNAIRE_DONNEES_V2.md) - Tables complètes avec exemples

### Architecture & Planning
- [Architecture](./docs/ARCHITECTURE.md) - Vue d'ensemble
- [Architecture Détaillée](./docs/ARCHITECTURE_DETAILLEE.md) ← **Structure complète + conventions + diagramme flux**
- [Architecture Decision Records (ADR)](./docs/ADR/) - 8 ADR (choix techniques justifiés)
- [Backlog Numéroté (T1-T37)](./docs/BACKLOG_NUMEROTE.md) ← **Recommandé pour développement**

### Workflow & Décisions Techniques
- [Workflow Git Professionnel](./docs/WORKFLOW_GIT.md) - Structure branches, PR, releases
- [Explication Port 5432 → 5433](./docs/POURQUOI_PORT_5432.md) - Diagnostic et résolution de conflit Docker

### Analyses
- [📊 Analyse du Projet & Feedback Candidature](./docs/ANALYSE_PROJET.md)
- [📋 Évaluation Fonctionnalités](./docs/EVALUATION_FONCTIONNALITES.md)

## 🧪 Tests

```bash
# Backend - Tests unitaires
cd backend
npm run test

# Backend - Tests d'intégration
npm run test:integration

# Backend - Coverage
npm run test:coverage

# Frontend - Tests
cd frontend
npm run test
```

## 🔧 Commandes Utiles

### Backend

```bash
npm run dev          # Développement (watch mode)
npm run build        # Compiler TypeScript
npm run start        # Production
npm run lint         # Linter
npm run test         # Tests
```

### Prisma

```bash
npx prisma migrate dev        # Créer et appliquer migration
npx prisma migrate deploy     # Appliquer migrations (prod)
npx prisma studio             # Interface graphique DB
npx prisma generate           # Régénérer client Prisma
npx prisma db seed            # Seed données
```

### Frontend

```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Production
npm run lint         # Linter
```

## 🐳 Docker

### Développement

```bash
# Démarrer PostgreSQL
docker-compose up -d postgres

# Arrêter
docker-compose down
```

## 🔐 Variables d'Environnement

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/contract_db"

# JWT
JWT_SECRET="your-secret-key-min-32-chars"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@company.com"

# Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760  # 10MB
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 Workflow de Développement

1. **Créer une branche** : `git checkout -b feature/nom-feature`
2. **Développer** : Suivre les tickets du [backlog numéroté (T1-T37)](./docs/BACKLOG_NUMEROTE.md)
3. **Tests** : Écrire tests avant ou après code (TDD si possible)
4. **Commit** : Messages clairs (`feat: ajout création contrat`)
5. **Push** : Créer PR, CI vérifie automatiquement
6. **Review** : Code review avant merge

## 🚢 Déploiement

Voir [Guide de déploiement](./docs/DEPLOYMENT.md) (à créer).

## 📄 Licence

Interne - Tous droits réservés

## 👥 Équipe

Lead Dev + Mentor

---

**Note** : Ce projet est en développement actif. Consulter le [backlog numéroté (T1-T37)](./docs/BACKLOG_NUMEROTE.md) pour voir l'avancement.

