# ✅ Checklist "Je Comprends" - Initialisation Projet

## 📚 Compréhension de la Structure

### 1. Architecture Monorepo
- [ ] Je comprends que backend et frontend sont dans le même repository
- [ ] Je comprends pourquoi c'est avantageux (coordination, CI/CD, versioning)
- [ ] Je sais où se trouvent les dossiers `backend/` et `frontend/`

**Question à vous poser** : Pourquoi un monorepo plutôt que deux repos séparés ?

---

### 2. Configuration TypeScript

#### Backend
- [ ] Je comprends que `tsconfig.json` configure la compilation TypeScript
- [ ] Je sais que `strict: true` active toutes les vérifications strictes
- [ ] Je comprends que `outDir: "./dist"` est où le code compilé va
- [ ] Je comprends `paths: { "@/*": ["src/*"] }` permet imports `@/utils/...`

#### Frontend
- [ ] Je comprends que Next.js a sa propre config TypeScript
- [ ] Je sais que `jsx: "preserve"` laisse Next.js gérer le JSX
- [ ] Je comprends que `paths` fonctionne aussi pour le frontend

**Question à vous poser** : Que se passe-t-il si je supprime `strict: true` dans tsconfig.json ?

---

### 3. Scripts npm

#### Backend
- [ ] Je comprends `npm run dev` lance le serveur en mode watch (recompile auto)
- [ ] Je comprends `npm run build` compile TypeScript → JavaScript
- [ ] Je comprends `npm run start` lance le code compilé (production)
- [ ] Je comprends différence entre `dev` (watch) et `start` (statique)

#### Frontend
- [ ] Je comprends `npm run dev` lance Next.js avec hot-reload
- [ ] Je comprends `npm run build` compile pour production
- [ ] Je sais que Next.js gère automatiquement le TypeScript

**Question à vous poser** : Pourquoi dois-je faire `npm run build` avant `npm run start` en production ?

---

### 4. Linting (ESLint)

#### Backend
- [ ] Je comprends qu'ESLint vérifie la qualité du code
- [ ] Je comprends `npm run lint` montre erreurs sans les corriger
- [ ] Je comprends `npm run lint:fix` corrige automatiquement certaines erreurs
- [ ] Je sais qu'ESLint vérifie aussi les erreurs TypeScript

#### Frontend
- [ ] Je comprends que Next.js inclut ESLint par défaut
- [ ] Je sais que `npm run lint` peut aussi corriger automatiquement

**Question à vous poser** : Que se passe-t-il si j'ai une variable non utilisée ? ESLint la détectera-t-il ?

---

### 5. Formatage (Prettier)

#### Backend & Frontend
- [ ] Je comprends que Prettier formate le code automatiquement
- [ ] Je comprends `npm run format` modifie les fichiers
- [ ] Je comprends `npm run format:check` vérifie sans modifier (utile CI)
- [ ] Je sais que Prettier et ESLint sont configurés pour travailler ensemble

**Configuration Prettier** :
- [ ] Je comprends `singleQuote: true` = guillemets simples
- [ ] Je comprends `semi: true` = point-virgule obligatoire
- [ ] Je comprends `tabWidth: 2` = indentation 2 espaces

**Question à vous poser** : Si je change `tabWidth: 4` dans `.prettierrc`, que se passe-t-il ?

---

### 6. Point d'Entrée Backend (`src/app.ts`)

- [ ] Je comprends que `app.ts` crée le serveur Express
- [ ] Je comprends que `app.listen(PORT)` démarre le serveur
- [ ] Je comprends les middleware : `cors()`, `express.json()`, `morgan()`
- [ ] Je comprends que `dotenv.config()` charge les variables `.env`
- [ ] Je sais où ajouter de nouvelles routes (après les routes existantes)

**Question à vous poser** : Pourquoi utilise-t-on `dotenv` ? Que se passe-t-il si je supprime cette ligne ?

---

### 7. Point d'Entrée Frontend (`src/app/page.tsx`)

- [ ] Je comprends que Next.js 14 utilise l'App Router
- [ ] Je comprends que `page.tsx` = page accessible sur `/`
- [ ] Je comprends que `layout.tsx` = layout commun à toutes les pages
- [ ] Je comprends que `globals.css` charge Tailwind CSS
- [ ] Je sais où créer de nouvelles pages (dans `src/app/`)

**Question à vous poser** : Comment créer une page `/about` avec Next.js App Router ?

---

### 8. Variables d'Environnement

#### Backend
- [ ] Je comprends que `.env` contient les secrets (non commité)
- [ ] Je comprends que `.env.example` est le template (commité)
- [ ] Je comprends que `dotenv` charge `.env` automatiquement
- [ ] Je sais que `process.env.PORT` lit la variable PORT

#### Frontend
- [ ] Je comprends que `.env.local` est pour le frontend (non commité)
- [ ] Je comprends que `NEXT_PUBLIC_*` expose variables au client
- [ ] Je comprends qu'on ne met JAMAIS de secrets dans `NEXT_PUBLIC_*`

**Question à vous poser** : Pourquoi `JWT_SECRET` ne doit PAS être dans `NEXT_PUBLIC_JWT_SECRET` ?

---

### 9. .gitignore

- [ ] Je comprends que `.gitignore` liste fichiers à ne pas commiter
- [ ] Je comprends pourquoi `node_modules/` est ignoré
- [ ] Je comprends pourquoi `.env` est ignoré (secrets)
- [ ] Je comprends pourquoi `dist/` et `.next/` sont ignorés (fichiers générés)

**Question à vous poser** : Que se passe-t-il si je commite accidentellement `.env` avec des secrets ?

---

### 10. Dépendances et Packages

#### Backend - Dependencies principales
- [ ] Je comprends `express` = framework web HTTP
- [ ] Je comprends `typescript` = compilateur TypeScript
- [ ] Je comprends `tsx` = exécute TypeScript directement (dev)
- [ ] Je comprends `dotenv` = charge variables d'environnement
- [ ] Je comprends `cors` = autorise requêtes cross-origin
- [ ] Je comprends `morgan` = log les requêtes HTTP

#### Frontend - Dependencies principales
- [ ] Je comprends `next` = framework React avec SSR
- [ ] Je comprends `react` + `react-dom` = bibliothèque React
- [ ] Je comprends `tailwindcss` = framework CSS utility-first
- [ ] Je comprends `typescript` = TypeScript pour Next.js

**Question à vous poser** : Quelle est la différence entre `dependencies` et `devDependencies` dans package.json ?

---

## 🎯 Validation Finale

### Je peux répondre à ces questions :

1. ✅ **Où se trouve le code du serveur Express ?**
   → `backend/src/app.ts`

2. ✅ **Comment lancer le backend en développement ?**
   → `cd backend && npm run dev`

3. ✅ **Comment lancer le frontend en développement ?**
   → `cd frontend && npm run dev`

4. ✅ **Où sont les variables d'environnement du backend ?**
   → `backend/.env` (copier depuis `.env.example`)

5. ✅ **Quelle est la différence entre `npm run dev` et `npm run start` ?**
   → `dev` = watch mode (recompile auto), `start` = production (code compilé)

6. ✅ **Comment formater mon code automatiquement ?**
   → `npm run format` (backend ou frontend)

7. ✅ **Que fait ESLint ?**
   → Vérifie qualité code, erreurs TypeScript, bonnes pratiques

8. ✅ **Pourquoi utiliser TypeScript plutôt que JavaScript ?**
   → Type-safety, moins de bugs, meilleure DX, refactoring sûr

9. ✅ **Où créer une nouvelle page dans Next.js ?**
   → `frontend/src/app/nom-page/page.tsx`

10. ✅ **Comment ajouter une nouvelle route API dans Express ?**
    → Dans `backend/src/app.ts`, après les routes existantes

---

## ✅ Si vous pouvez répondre à toutes ces questions...

**Vous êtes prêt pour** :
- ✅ Passer au Ticket T2 (Docker Compose)
- ✅ Comprendre la structure du code
- ✅ Ajouter de nouvelles fonctionnalités

**Si vous avez des doutes** :
- 📖 Relire `GUIDE_DEMARRAGE.md`
- 🔍 Vérifier les fichiers créés
- ❓ Poser des questions avant de continuer

---

**Date de validation** : _______________

**Signature** : _______________ (Cochez toutes les cases ci-dessus ✅)



