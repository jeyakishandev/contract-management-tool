# Guide de Démarrage - Contract Management Tool

## 📋 Prérequis

- **Node.js** : Version 18 ou supérieure
- **npm** : Version 9 ou supérieure (ou yarn/pnpm)
- **Docker** : Version 20 ou supérieure + Docker Compose (pour PostgreSQL)
- **Git** : Pour le contrôle de version

Vérifier les versions :
```bash
node --version      # Doit être >= 18
npm --version       # Doit être >= 9
docker --version    # Doit être installé
docker-compose --version  # Doit être installé
```

---

## 🐳 Démarrage avec Docker (Recommandé)

### Option A : PostgreSQL via Docker (Recommandé pour développement)

**Avantages** :
- ✅ Pas besoin d'installer PostgreSQL localement
- ✅ Configuration automatique
- ✅ Données persistées dans volume Docker
- ✅ Facile à réinitialiser

#### 1. Créer fichier `.env` à la racine (pour Docker Compose)

Créer `.env` à la racine du projet :

```bash
cd /root/Contract
cat > .env << EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=contract_db
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key-min-32-characters-change-in-production
EOF
```

⚠️ **Ne jamais commiter `.env`** (déjà dans `.gitignore`)

#### 2. Démarrer PostgreSQL avec Docker Compose

```bash
# Démarrer PostgreSQL (détaché, en arrière-plan)
docker-compose up -d postgres

# Vérifier que PostgreSQL est démarré et healthy
docker-compose ps

# Voir les logs
docker-compose logs postgres
```

**Résultat attendu** :
```
CONTAINER ID   IMAGE                STATUS
abc123...      postgres:15-alpine   Up (healthy)
```

**Variables d'environnement PostgreSQL** (dans `.env` racine) :
- `POSTGRES_USER` : Utilisateur PostgreSQL (défaut: `postgres`)
- `POSTGRES_PASSWORD` : Mot de passe PostgreSQL (défaut: `postgres`)
- `POSTGRES_DB` : Nom de la base de données (défaut: `contract_db`)

**⚠️ Note** : Le port externe est `5433` (pas `5432`) pour éviter les conflits avec d'autres conteneurs PostgreSQL.

#### 3. Configurer `backend/.env` pour se connecter à PostgreSQL

Créer `backend/.env` :

```bash
cd backend
cat > .env << EOF
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/contract_db?schema=public"
JWT_SECRET="your-secret-key-min-32-characters-change-in-production"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
EOF
```

#### 4. Commandes Docker utiles

```bash
# Arrêter PostgreSQL
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v

# Redémarrer PostgreSQL
docker-compose restart postgres

# Voir les logs en temps réel
docker-compose logs -f postgres

# Accéder au shell PostgreSQL
docker-compose exec postgres psql -U postgres -d contract_db

# Vérifier le healthcheck
docker-compose ps
```

#### 5. Optionnel : Lancer le backend via Docker

**Note** : Cette option nécessite un `Dockerfile` dans `backend/` (sera créé plus tard si besoin).

```bash
# Lancer backend + postgres ensemble
docker-compose --profile backend up

# Ou seulement backend (si postgres déjà lancé)
docker-compose up backend
```

**Actuellement** : Le backend se lance mieux directement avec `npm run dev` (hot-reload).

---

### Option B : PostgreSQL installé localement

Si vous préférez installer PostgreSQL localement :

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Créer la base de données
createdb contract_db
```

Puis configurer `backend/.env` avec :
```
DATABASE_URL="postgresql://user:password@localhost:5433/contract_db?schema=public"
```

---

## 🚀 Installation Initiale

### 1. Installer les dépendances Backend

```bash
cd backend
npm install
```

**Ce que ça installe** :
- `express` : Framework web
- `typescript` : Compilateur TypeScript
- `tsx` : Exécution TypeScript en dev (watch mode)
- `eslint` + `prettier` : Linting et formatage
- `dotenv` : Variables d'environnement
- Et autres dépendances (voir `backend/package.json`)

---

### 2. Installer les dépendances Frontend

```bash
cd ../frontend
npm install
```

**Ce que ça installe** :
- `next` : Framework React
- `react` + `react-dom` : Bibliothèque React
- `tailwindcss` : Framework CSS
- `typescript` : TypeScript pour Next.js
- Et autres dépendances (voir `frontend/package.json`)

---

## ⚙️ Configuration

### Variables d'Environnement

#### Backend

Copier `.env.example` vers `.env` dans le dossier `backend/` :

```bash
cd backend
cp .env.example .env
```

**Variables importantes** :
- `PORT` : Port du serveur (défaut: 3001)
- `DATABASE_URL` : URL PostgreSQL (à configurer plus tard avec Prisma)
- `JWT_SECRET` : Secret pour signer les JWT (⚠️ **CHANGER EN PRODUCTION**)

Pour l'instant, vous pouvez laisser les valeurs par défaut pour tester.

#### Frontend

Copier `.env.example` vers `.env.local` dans le dossier `frontend/` :

```bash
cd frontend
cp .env.example .env.local
```

**Variable importante** :
- `NEXT_PUBLIC_API_URL` : URL du backend API (défaut: http://localhost:3001)

---

## ▶️ Lancer le Projet

### Option 1 : Deux Terminaux (Recommandé pour développement)

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

**Ce que ça fait** :
- Lance `tsx watch src/app.ts`
- Surveille les changements dans `src/`
- Recompile automatiquement
- Serveur accessible sur http://localhost:3001

**Vérification** :
- Ouvrir http://localhost:3001/health → Devrait retourner `{"status":"OK",...}`
- Ouvrir http://localhost:3001/api/test → Devrait retourner `{"message":"Backend API is working!"}`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

**Ce que ça fait** :
- Lance Next.js en mode développement
- Hot-reload automatique
- Accessible sur http://localhost:3000

**Vérification** :
- Ouvrir http://localhost:3000 → Devrait afficher "Contract & Obligation Management Tool"

---

## 🛠️ Scripts Disponibles

### Backend (`backend/package.json`)

| Script | Commande | Description |
|--------|----------|-------------|
| **Développement** | `npm run dev` | Lance serveur en mode watch (recompile auto) |
| **Build** | `npm run build` | Compile TypeScript → JavaScript dans `dist/` |
| **Production** | `npm run start` | Lance serveur compilé (après `build`) |
| **Lint** | `npm run lint` | Vérifie erreurs ESLint |
| **Lint Fix** | `npm run lint:fix` | Corrige automatiquement erreurs ESLint |
| **Format** | `npm run format` | Formate code avec Prettier |
| **Format Check** | `npm run format:check` | Vérifie formatage (sans modifier) |
| **Test** | `npm run test` | Lance tests Jest |
| **Test Watch** | `npm run test:watch` | Tests en mode watch |
| **Coverage** | `npm run test:coverage` | Génère rapport de couverture |

### Frontend (`frontend/package.json`)

| Script | Commande | Description |
|--------|----------|-------------|
| **Développement** | `npm run dev` | Lance Next.js dev server (port 3000) |
| **Build** | `npm run build` | Compile pour production |
| **Production** | `npm run start` | Lance serveur de production (après `build`) |
| **Lint** | `npm run lint` | Vérifie erreurs ESLint |
| **Format** | `npm run format` | Formate code avec Prettier |
| **Format Check** | `npm run format:check` | Vérifie formatage |

---

## 🔍 Linting et Formatage

### ESLint (Vérification du code)

**Backend** :
```bash
cd backend
npm run lint          # Vérifie erreurs
npm run lint:fix      # Corrige automatiquement
```

**Frontend** :
```bash
cd frontend
npm run lint          # Vérifie erreurs (Next.js inclut fix auto)
```

**Ce que ESLint vérifie** :
- Erreurs TypeScript
- Variables non utilisées
- Promesses non gérées
- Bonnes pratiques

### Prettier (Formatage du code)

**Backend** :
```bash
cd backend
npm run format        # Formate tous les fichiers .ts
npm run format:check  # Vérifie formatage (CI)
```

**Frontend** :
```bash
cd frontend
npm run format        # Formate tous les fichiers
npm run format:check  # Vérifie formatage (CI)
```

**Configuration Prettier** :
- Guillemets simples
- Point-virgule
- Indentation 2 espaces
- Largeur max 100 caractères

**Intégration IDE** :
- **VSCode** : Installer extensions "ESLint" + "Prettier"
- Format on save : Auto-formate à la sauvegarde

---

## 🌍 Variables d'Environnement

### Backend

**Fichier** : `backend/.env`

| Variable | Description | Exemple |
|----------|-------------|---------|
| `PORT` | Port serveur Express | `3001` |
| `NODE_ENV` | Environnement (development/production) | `development` |
| `DATABASE_URL` | URL PostgreSQL (Prisma) | `postgresql://user:pass@localhost:5433/db` |
| `JWT_SECRET` | Secret pour signer JWT | `your-secret-key-min-32-chars` |
| `JWT_ACCESS_EXPIRES_IN` | Durée access token | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Durée refresh token | `7d` |
| `SMTP_HOST` | Serveur SMTP (email) | `smtp.gmail.com` |
| `STORAGE_TYPE` | Type stockage fichiers | `local` (dev) ou `s3` (prod) |
| `UPLOAD_DIR` | Dossier uploads local | `./uploads` |

**⚠️ Important** :
- Ne jamais commiter `.env` (déjà dans `.gitignore`)
- Toujours utiliser `.env.example` comme référence
- Changer `JWT_SECRET` en production (générer avec `openssl rand -hex 32`)

### Frontend

**Fichier** : `frontend/.env.local`

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL backend API | `http://localhost:3001` |

**⚠️ Important** :
- Variables `NEXT_PUBLIC_*` sont exposées au client (pas de secrets !)
- Fichier `.env.local` dans `.gitignore`

---

## 🏗️ Structure des Fichiers Créés

### Backend

```
backend/
├── src/
│   └── app.ts              ← Point d'entrée Express (serveur HTTP)
├── package.json            ← Dépendances + scripts
├── tsconfig.json           ← Configuration TypeScript
├── .eslintrc.json          ← Règles ESLint
├── .prettierrc             ← Règles Prettier
├── .prettierignore         ← Fichiers ignorés par Prettier
└── .env.example            ← Template variables d'environnement
```

**Fichier principal** : `src/app.ts`
- Crée serveur Express
- Configure middleware (CORS, JSON parser, logging)
- Définit routes de base
- Écoute sur port 3001

### Frontend

```
frontend/
├── src/
│   └── app/
│       ├── page.tsx        ← Page d'accueil (Next.js App Router)
│       ├── layout.tsx      ← Layout racine (métadonnées)
│       └── globals.css     ← CSS global (Tailwind)
├── package.json            ← Dépendances + scripts
├── tsconfig.json           ← Configuration TypeScript
├── next.config.js          ← Configuration Next.js
├── tailwind.config.js      ← Configuration Tailwind CSS
├── postcss.config.js       ← Configuration PostCSS
├── .eslintrc.json          ← Règles ESLint
├── .prettierrc             ← Règles Prettier
└── .env.example            ← Template variables d'environnement
```

**Fichier principal** : `src/app/page.tsx`
- Page d'accueil React
- Utilise Tailwind CSS
- App Router de Next.js 14

---

## ✅ Vérification Post-Installation

### 1. Vérifier Backend

```bash
cd backend
npm run dev
```

**Résultat attendu** :
```
🚀 Server is running on http://localhost:3001
📝 Health check: http://localhost:3001/health
```

**Tester** :
- http://localhost:3001/health → `{"status":"OK",...}`
- http://localhost:3001/api/test → `{"message":"Backend API is working!"}`

### 2. Vérifier Frontend

```bash
cd frontend
npm run dev
```

**Résultat attendu** :
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

**Tester** :
- http://localhost:3000 → Page avec "Contract & Obligation Management Tool"

### 3. Vérifier Linting

```bash
# Backend
cd backend
npm run lint    # Devrait passer sans erreur

# Frontend
cd frontend
npm run lint    # Devrait passer sans erreur
```

### 4. Vérifier Formatage

```bash
# Backend
cd backend
npm run format:check

# Frontend
cd frontend
npm run format:check
```

---

## 🐛 Dépannage

### Erreur : "Cannot find module"

**Solution** :
```bash
# Réinstaller dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "Port already in use"

**Solution** :
```bash
# Backend : Changer PORT dans .env
PORT=3002

# Frontend : Lancer sur autre port
npm run dev -- -p 3001
```

### Erreur : TypeScript compilation errors

**Solution** :
```bash
# Vérifier tsconfig.json
# Vérifier que fichiers sont dans src/
# Vérifier imports corrects
```

---

## 📝 Prochaines Étapes

Une fois l'initialisation validée, vous pouvez passer au **Ticket T2** (Docker Compose) puis **T3** (Prisma + Migrations).

---

## 🔗 Liens Utils

- **Backend API** : http://localhost:3001
- **Frontend** : http://localhost:3000
- **Health Check** : http://localhost:3001/health



