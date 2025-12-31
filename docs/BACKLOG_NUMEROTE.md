# Backlog Numéroté - Contract & Obligation Management Tool

## Vue d'ensemble

Backlog découpé en **tickets numérotés** (T1, T2, T3...) avec critères d'acceptation détaillés.

**Total estimé** : ~120-140h (selon expérience)

---

## 🏗️ Infrastructure & Setup

### T1 : Initialisation du projet
**Priorité** : 🔴 Haute  
**Estimation** : 2h  
**Épique** : Infrastructure

**Description** :
- Créer structure de dossiers backend/frontend selon architecture
- Initialiser package.json backend (TypeScript, Express, Prisma, Jest, etc.)
- Initialiser package.json frontend (Next.js, TypeScript, Tailwind CSS, etc.)
- Configurer tsconfig.json (backend + frontend) avec strict mode
- Configurer ESLint + Prettier (règles partagées)
- Ajouter .gitignore complet
- Créer README.md de base avec structure projet

**Livrables** :
- [ ] Structure de dossiers complète (backend/src/{api,services,repositories,...})
- [ ] Backend : Express serveur qui démarre (Hello World sur port 3001)
- [ ] Frontend : Next.js qui démarre (page d'accueil sur port 3000)
- [ ] Linting configuré (ESLint + Prettier)
- [ ] .gitignore (node_modules, .env, dist, etc.)

**Critères d'acceptation** :
1. ✅ `cd backend && npm run dev` démarre serveur Express sur port 3001
2. ✅ `cd frontend && npm run dev` démarre Next.js sur port 3000
3. ✅ `npm run lint` ne génère aucune erreur
4. ✅ `npm run build` compile TypeScript sans erreur (backend + frontend)
5. ✅ Structure de dossiers conforme à `docs/ARCHITECTURE.md`

---

### T2 : Configuration Docker Compose
**Priorité** : 🔴 Haute  
**Estimation** : 1h  
**Épique** : Infrastructure

**Description** :
- Créer docker-compose.yml avec service PostgreSQL
- Configurer PostgreSQL (port 5432, volumes persistants)
- Créer .env.example avec toutes variables nécessaires
- Documenter démarrage via Docker dans README

**Livrables** :
- [ ] docker-compose.yml fonctionnel
- [ ] PostgreSQL accessible sur localhost:5432
- [ ] .env.example documenté (DATABASE_URL, JWT_SECRET, PORT, etc.)
- [ ] Section Docker dans README

**Critères d'acceptation** :
1. ✅ `docker-compose up -d postgres` démarre PostgreSQL
2. ✅ Backend peut se connecter à PostgreSQL via DATABASE_URL
3. ✅ Variables d'environnement documentées dans .env.example
4. ✅ README contient section "Démarrer avec Docker"

---

### T3 : Configuration Prisma + Migrations
**Priorité** : 🔴 Haute  
**Estimation** : 3h  
**Épique** : Infrastructure

**Description** :
- Initialiser Prisma dans backend
- Créer schema.prisma basé sur MLD Variante 1 (SIMPLE)
  - Modèles : User, Contract, Obligation, Notification, AuditLog
  - Relations FK
  - Contraintes CHECK
- Créer première migration
- Configurer seed (utilisateur admin par défaut)
- Documenter commandes Prisma dans README

**Livrables** :
- [ ] schema.prisma complet (5 modèles)
- [ ] Migration initiale créée et appliquée
- [ ] Seed créant 1 utilisateur ADMIN (email: admin@example.com, password: admin123 hashé)
- [ ] Documentation commandes Prisma (migrate, studio, seed)

**Critères d'acceptation** :
1. ✅ `npx prisma migrate dev` crée toutes les tables (users, contracts, obligations, notifications, audit_logs)
2. ✅ `npx prisma db seed` crée utilisateur admin avec hash bcrypt
3. ✅ `npx prisma studio` peut afficher toutes les tables
4. ✅ Schéma conforme à `docs/MLD_V2.md` (Variante 1)
5. ✅ Toutes contraintes CHECK présentes (role, status, etc.)

---

### T4 : Configuration CI/CD (GitHub Actions)
**Priorité** : 🟡 Moyenne  
**Estimation** : 2h  
**Épique** : Infrastructure

**Description** :
- Créer workflow GitHub Actions pour backend
  - Node.js setup
  - Install dependencies
  - Run lint
  - Run tests (quand disponibles)
  - Run build
- Workflow pour frontend (lint + build)
- Tests avec PostgreSQL (service container)
- Badge status dans README

**Livrables** :
- [ ] .github/workflows/backend.yml
- [ ] .github/workflows/frontend.yml
- [ ] CI passe sur push/PR (green badge)

**Critères d'acceptation** :
1. ✅ Push sur main déclenche CI automatiquement
2. ✅ CI échoue si `npm run lint` échoue
3. ✅ CI échoue si `npm run build` échoue
4. ✅ CI passe avec PostgreSQL service container
5. ✅ Badge CI visible dans README

---

## 🔐 Authentification & Autorisation

### T5 : Modèle User + Repository
**Priorité** : 🔴 Haute  
**Estimation** : 2h  
**Épique** : Authentification

**Description** :
- Créer UserRepository (backend/src/repositories/user.repository.ts)
- Méthodes : findByEmail, findById, create, update, findAll
- Types TypeScript : User, CreateUserInput, UpdateUserInput (sans password_hash)
- Tests unitaires UserRepository (Jest)

**Livrables** :
- [ ] UserRepository avec méthodes CRUD complètes
- [ ] Types TypeScript (User, CreateUserInput, UpdateUserInput)
- [ ] Tests unitaires UserRepository (coverage > 80%)

**Critères d'acceptation** :
1. ✅ `userRepository.create(data)` crée utilisateur en DB
2. ✅ `userRepository.findByEmail(email)` trouve utilisateur
3. ✅ `userRepository.findById(id)` trouve utilisateur
4. ✅ `userRepository.update(id, data)` met à jour utilisateur
5. ✅ Tests passent avec coverage > 80%
6. ✅ Type User ne contient pas password_hash (sécurité)

---

### T6 : Service d'authentification (hash password, JWT)
**Priorité** : 🔴 Haute  
**Estimation** : 3h  
**Épique** : Authentification

**Description** :
- Créer AuthService (backend/src/services/auth.service.ts)
- Méthodes :
  - register(email, password, firstName, lastName, role) → retourne User + JWT
  - login(email, password) → retourne User + JWT
  - validateToken(token) → retourne User
- Utiliser bcrypt (salt rounds 10) pour hash password
- Utiliser jsonwebtoken pour JWT (access token 15min, refresh token 7j)
- Tests unitaires AuthService

**Livrables** :
- [ ] AuthService avec register/login/validateToken
- [ ] Hash bcrypt configuré (salt rounds 10)
- [ ] JWT avec access + refresh tokens
- [ ] Tests unitaires AuthService (mock UserRepository)

**Critères d'acceptation** :
1. ✅ `authService.register(...)` crée utilisateur avec password hashé (pas en clair)
2. ✅ `authService.login(email, password)` retourne JWT valide si credentials corrects
3. ✅ `authService.login(email, wrongPassword)` lève erreur "Invalid credentials"
4. ✅ `authService.validateToken(token)` décode et vérifie JWT, retourne User
5. ✅ `authService.validateToken(invalidToken)` lève erreur si token invalide
6. ✅ JWT access token expire après 15min
7. ✅ Tests passent avec coverage > 80%

---

### T7 : Routes API Auth (POST /api/auth/register, /api/auth/login)
**Priorité** : 🔴 Haute  
**Estimation** : 2h  
**Épique** : Authentification

**Description** :
- Créer routes POST /api/auth/register et POST /api/auth/login
- Validation avec Zod (email format, password min 8 caractères)
- Gestion erreurs (email existant → 409, credentials invalides → 401)
- Retourner JWT dans body JSON (access + refresh)
- Tests d'intégration (Supertest)

**Livrables** :
- [ ] Routes /api/auth/register et /api/auth/login
- [ ] Validation Zod des inputs (schémas CreateUserInput, LoginInput)
- [ ] Codes d'erreur HTTP appropriés (400, 401, 409)
- [ ] Tests d'intégration (Supertest)

**Critères d'acceptation** :
1. ✅ POST /api/auth/register avec données valides crée utilisateur et retourne JWT
2. ✅ POST /api/auth/register avec email existant retourne 409 Conflict
3. ✅ POST /api/auth/register avec email invalide retourne 400 Bad Request
4. ✅ POST /api/auth/register avec password < 8 caractères retourne 400
5. ✅ POST /api/auth/login avec credentials corrects retourne JWT
6. ✅ POST /api/auth/login avec credentials incorrects retourne 401 Unauthorized
7. ✅ Tests d'intégration passent

---

### T8 : Middleware d'authentification (verify JWT)
**Priorité** : 🔴 Haute  
**Estimation** : 2h  
**Épique** : Authentification

**Description** :
- Créer middleware authenticate() (backend/src/middleware/auth.middleware.ts)
  - Lit JWT depuis header Authorization: Bearer <token>
  - Valide token (signature, expiration)
  - Récupère user depuis DB via UserRepository
  - Ajoute user à req.user (typage TypeScript)
- Middleware requireAuth() qui appelle authenticate() et renvoie 401 si échec
- Gestion erreurs (token invalide, expiré, user inexistant)

**Livrables** :
- [ ] Middleware authenticate() et requireAuth()
- [ ] req.user typé (TypeScript)
- [ ] Gestion erreurs complète (401, messages clairs)
- [ ] Tests middleware

**Critères d'acceptation** :
1. ✅ Route protégée avec requireAuth() renvoie 401 si pas de token
2. ✅ Route protégée avec requireAuth() renvoie 401 si token invalide
3. ✅ Route protégée avec requireAuth() renvoie 401 si token expiré
4. ✅ Route protégée avec requireAuth() retourne user si token valide
5. ✅ req.user est typé correctement (TypeScript)
6. ✅ Tests middleware passent

---

### T9 : Middleware d'autorisation (rôles)
**Priorité** : 🔴 Haute  
**Estimation** : 2h  
**Épique** : Authentification

**Description** :
- Créer middleware requireRole(allowedRoles: Role[]) (backend/src/middleware/auth.middleware.ts)
  - Vérifie que req.user existe (après requireAuth)
  - Vérifie que req.user.role est dans allowedRoles
  - Renvoie 403 si non autorisé
- Exemples : requireRole(['ADMIN']), requireRole(['ADMIN', 'MANAGER'])

**Livrables** :
- [ ] Middleware requireRole()
- [ ] Tests middleware (ADMIN peut accéder, VIEWER ne peut pas)

**Critères d'acceptation** :
1. ✅ ADMIN peut accéder à route requireRole(['ADMIN', 'MANAGER'])
2. ✅ MANAGER peut accéder à route requireRole(['ADMIN', 'MANAGER'])
3. ✅ VIEWER reçoit 403 sur route requireRole(['ADMIN'])
4. ✅ Requête sans auth reçoit 401 (requireAuth échoue avant requireRole)
5. ✅ Tests middleware passent

---

### T10 : Frontend - Pages Login/Register + API Client
**Priorité** : 🔴 Haute  
**Estimation** : 4h  
**Épique** : Authentification

**Description** :
- Créer page /login (formulaire email/password)
- Créer page /register (formulaire email/password/firstName/lastName/role)
- Créer API client (frontend/src/lib/api-client.ts) avec méthodes login/register
- Stocker JWT (localStorage ou cookie httpOnly)
- Gérer état auth (Context API useAuth())
- Redirection après login (vers /dashboard)
- Protection routes (redirect si non authentifié vers /login)

**Livrables** :
- [ ] Pages /login et /register (composants React)
- [ ] API client avec login/register (fetch vers backend)
- [ ] Context useAuth() pour état global (user, token, isAuthenticated)
- [ ] Protection routes (middleware ou HOC)
- [ ] Redirection automatique

**Critères d'acceptation** :
1. ✅ Formulaire login fonctionne et stocke JWT
2. ✅ Redirection automatique vers /dashboard après login réussi
3. ✅ Si non authentifié, redirection vers /login
4. ✅ Token stocké dans localStorage (ou cookie)
5. ✅ useAuth() expose user, isAuthenticated, login(), logout()
6. ✅ Page /register crée utilisateur et connecte automatiquement

---

## 📄 Gestion des Contrats

### T11 : Modèle Contract + Repository
**Priorité** : 🔴 Haute  
**Estimation** : 2h  
**Épique** : Contrats

**Description** :
- Créer ContractRepository (backend/src/repositories/contract.repository.ts)
- Méthodes : create, findById, findAll, update, delete
- Méthodes de filtrage : findByStatus, findByCreatedBy, search
- Types TypeScript : Contract, CreateContractInput, UpdateContractInput

**Livrables** :
- [ ] ContractRepository complet
- [ ] Types TypeScript
- [ ] Tests unitaires ContractRepository

**Critères d'acceptation** :
1. ✅ `contractRepository.create(data)` crée contrat en DB
2. ✅ `contractRepository.findById(id)` trouve contrat
3. ✅ `contractRepository.findAll({ status: 'ACTIVE' })` filtre par status
4. ✅ `contractRepository.search('keyword')` recherche dans title/reference
5. ✅ `contractRepository.update(id, data)` met à jour contrat
6. ✅ Tests passent

---

### T12 : Service Contract (logique métier, validation workflow)
**Priorité** : 🔴 Haute  
**Estimation** : 4h  
**Épique** : Contrats

**Description** :
- Créer ContractService (backend/src/services/contract.service.ts)
- Méthodes :
  - createContract(data, userId)
  - updateContract(id, data, userId)
  - changeStatus(id, newStatus, userId, justification?)
  - deleteContract(id, userId, justification)
- Validation workflow : DRAFT → ACTIVE → SUSPENDED → CLOSING → ARCHIVED
- Vérification permissions (ADMIN/MANAGER peuvent changer status)
- Validation métier : end_date >= start_date, reference unique

**Livrables** :
- [ ] ContractService avec toutes méthodes
- [ ] Validation workflow (transitions autorisées/interdites)
- [ ] Validation métier (dates, référence unique)
- [ ] Tests unitaires ContractService (mock Repository)

**Critères d'acceptation** :
1. ✅ changeStatus refuse transitions invalides (ex: ARCHIVED → ACTIVE)
2. ✅ changeStatus accepte transitions valides (ex: DRAFT → ACTIVE)
3. ✅ createContract rejette si reference existe déjà (erreur 409)
4. ✅ createContract rejette si end_date < start_date (erreur 400)
5. ✅ Justification obligatoire pour DELETE et changement vers ARCHIVED
6. ✅ Tests passent avec coverage > 80%

---

### T13 : Routes API Contracts (CRUD)
**Priorité** : 🔴 Haute  
**Estimation** : 3h  
**Épique** : Contrats

**Description** :
- Routes :
  - GET /api/contracts (liste, avec filtres ?status=, ?search=)
  - GET /api/contracts/:id
  - POST /api/contracts (create, requireAuth + requireRole(['ADMIN', 'MANAGER']))
  - PUT /api/contracts/:id (update)
  - DELETE /api/contracts/:id (require justification)
  - PATCH /api/contracts/:id/status (changeStatus)
- Validation Zod pour tous les inputs
- Tests d'intégration

**Livrables** :
- [ ] Routes CRUD complètes
- [ ] Validation Zod (schémas CreateContractInput, UpdateContractInput)
- [ ] Permissions respectées (middleware requireAuth + requireRole)
- [ ] Tests d'intégration (Supertest)

**Critères d'acceptation** :
1. ✅ GET /api/contracts retourne liste contrats
2. ✅ GET /api/contracts?status=ACTIVE filtre par status
3. ✅ GET /api/contracts?search=keyword recherche dans title/reference
4. ✅ POST /api/contracts crée contrat (ADMIN/MANAGER uniquement)
5. ✅ POST /api/contracts retourne 403 si VIEWER
6. ✅ PUT /api/contracts/:id met à jour contrat
7. ✅ DELETE /api/contracts/:id supprime contrat (justification obligatoire)
8. ✅ PATCH /api/contracts/:id/status change statut (validation workflow)
9. ✅ Tests d'intégration passent

---

### T14 : Upload de fichiers PDF (stockage local)
**Priorité** : 🟡 Moyenne  
**Estimation** : 3h  
**Épique** : Contrats

**Description** :
- Middleware multer pour upload fichiers
- Route POST /api/contracts/:id/upload-pdf
- Validation : uniquement PDF, max 10MB
- Stockage : dossier /uploads/contracts/{year}/{contract-id}.pdf
- Mise à jour contract.pdf_file_path en DB
- Route GET /api/contracts/:id/pdf pour télécharger

**Livrables** :
- [ ] Upload PDF fonctionnel (multer)
- [ ] Validation type/taille fichier
- [ ] Téléchargement PDF fonctionnel
- [ ] Tests intégration

**Critères d'acceptation** :
1. ✅ POST /api/contracts/:id/upload-pdf sauvegarde fichier PDF
2. ✅ POST /api/contracts/:id/upload-pdf rejette fichier non-PDF (400)
3. ✅ POST /api/contracts/:id/upload-pdf rejette fichier > 10MB (400)
4. ✅ GET /api/contracts/:id/pdf retourne fichier PDF
5. ✅ contract.pdf_file_path mis à jour en DB après upload
6. ✅ Tests intégration passent

---

### T15 : Frontend - Pages Contracts (liste, détail, formulaire)
**Priorité** : 🔴 Haute  
**Estimation** : 6h  
**Épique** : Contrats

**Description** :
- Page /contracts (liste avec tableau)
  - Colonnes : reference, title, status, start_date, end_date
  - Filtres : status, recherche texte
  - Boutons : Voir, Modifier, Supprimer (selon permissions)
- Page /contracts/new (formulaire création)
- Page /contracts/:id (détail contrat)
- Page /contracts/:id/edit (formulaire modification)
- Composants réutilisables : ContractCard, ContractTable, ContractForm

**Livrables** :
- [ ] Pages liste/détail/formulaire
- [ ] Composants UI réutilisables
- [ ] Intégration API (hooks useContracts())
- [ ] Gestion erreurs/loading (états UI)

**Critères d'acceptation** :
1. ✅ Liste affiche tous les contrats
2. ✅ Filtres status/search fonctionnent
3. ✅ Formulaire création/modification fonctionne
4. ✅ Permissions respectées (VIEWER voit mais ne peut pas modifier)
5. ✅ Upload PDF fonctionne depuis détail contrat
6. ✅ Téléchargement PDF fonctionne

---

## ⏰ Gestion des Obligations

### T16 : Modèle Obligation + Repository
**Priorité** : 🔴 Haute  
**Estimation** : 2h  
**Épique** : Obligations

**Description** :
- Créer ObligationRepository (backend/src/repositories/obligation.repository.ts)
- Méthodes : create, findById, findByContractId, update, delete
- Méthode : findByDueDateRange(start, end) pour notifications
- Types TypeScript : Obligation, CreateObligationInput, UpdateObligationInput

**Livrables** :
- [ ] ObligationRepository complet
- [ ] Types TypeScript
- [ ] Tests unitaires ObligationRepository

**Critères d'acceptation** :
1. ✅ `obligationRepository.create(data)` crée obligation en DB
2. ✅ `obligationRepository.findByContractId(contractId)` trouve obligations d'un contrat
3. ✅ `obligationRepository.findByDueDateRange(start, end)` trouve obligations dans période
4. ✅ Tests passent

---

### T17 : Service Obligation (logique métier, récurrence)
**Priorité** : 🔴 Haute  
**Estimation** : 4h  
**Épique** : Obligations

**Description** :
- Créer ObligationService (backend/src/services/obligation.service.ts)
- Méthodes :
  - createObligation(data, userId)
  - updateObligation(id, data, userId)
  - completeObligation(id, userId)
  - Si is_recurring, créer prochaine occurrence après complétion
- Validation : due_date obligatoire, récurrence pattern si is_recurring

**Livrables** :
- [ ] ObligationService avec méthodes
- [ ] Gestion récurrence (création automatique prochaine occurrence)
- [ ] Tests unitaires ObligationService

**Critères d'acceptation** :
1. ✅ Obligation récurrente crée automatiquement prochaine occurrence après complétion
2. ✅ Prochaine occurrence a due_date calculée selon recurrence_pattern
3. ✅ Validation rejette obligations invalides (due_date manquante, etc.)
4. ✅ Tests passent avec coverage > 80%

---

### T18 : Routes API Obligations (CRUD)
**Priorité** : 🔴 Haute  
**Estimation** : 2h  
**Épique** : Obligations

**Description** :
- Routes :
  - GET /api/obligations (filtres : ?contractId=, ?status=, ?dueDateFrom=, ?dueDateTo=)
  - GET /api/obligations/:id
  - POST /api/obligations
  - PUT /api/obligations/:id
  - DELETE /api/obligations/:id
  - PATCH /api/obligations/:id/complete
- Validation Zod

**Livrables** :
- [ ] Routes CRUD
- [ ] Validation Zod
- [ ] Tests intégration

**Critères d'acceptation** :
1. ✅ GET /api/obligations retourne liste obligations
2. ✅ Filtres fonctionnent (?contractId, ?status, ?dueDateFrom, ?dueDateTo)
3. ✅ POST /api/obligations crée obligation
4. ✅ PATCH /api/obligations/:id/complete marque comme COMPLETED
5. ✅ Tests intégration passent

---

### T19 : Frontend - Pages Obligations
**Priorité** : 🔴 Haute  
**Estimation** : 5h  
**Épique** : Obligations

**Description** :
- Page /obligations (liste, filtres)
- Page /obligations/new (formulaire, sélection contrat)
- Page /obligations/:id/edit
- Composants : ObligationCard, ObligationForm
- Intégration avec contrats (créer obligation depuis détail contrat)

**Livrables** :
- [ ] Pages obligations
- [ ] Composants UI
- [ ] Hooks useObligations()

**Critères d'acceptation** :
1. ✅ Liste affiche obligations
2. ✅ Formulaire création/modification fonctionne
3. ✅ Sélection contrat depuis dropdown fonctionne
4. ✅ Créer obligation depuis détail contrat fonctionne
5. ✅ Marquer comme complétée fonctionne

---

## 📋 Audit Trail

### T20 : Modèle AuditLog + Repository
**Priorité** : 🟡 Moyenne  
**Estimation** : 2h  
**Épique** : Audit Trail

**Description** :
- Créer AuditLogRepository (backend/src/repositories/audit-log.repository.ts)
- Méthodes : create, findByEntity, findByUser, findAll (avec filtres)
- Types TypeScript : AuditLog, CreateAuditLogInput

**Livrables** :
- [ ] AuditLogRepository
- [ ] Types
- [ ] Tests

**Critères d'acceptation** :
1. ✅ `auditLogRepository.create(data)` crée log en DB
2. ✅ `auditLogRepository.findByEntity(entityType, entityId)` trouve logs d'une entité
3. ✅ Tests passent

---

### T21 : Middleware/Service Audit (création automatique logs)
**Priorité** : 🟡 Moyenne  
**Estimation** : 3h  
**Épique** : Audit Trail

**Description** :
- Créer AuditService (backend/src/services/audit.service.ts) avec méthode logAction()
- Intercepter actions dans ContractService, ObligationService :
  - Avant update : sauvegarder oldValue
  - Après update : créer log avec oldValue/newValue
- Middleware HTTP pour capturer IP/userAgent (req.ip, req.get('user-agent'))

**Livrables** :
- [ ] AuditService
- [ ] Intégration dans ContractService/ObligationService
- [ ] Middleware capture IP/userAgent
- [ ] Logs créés automatiquement

**Critères d'acceptation** :
1. ✅ Toute modification contrat crée log d'audit avec oldValue/newValue
2. ✅ Toute modification obligation crée log d'audit
3. ✅ Log contient IP address et user agent
4. ✅ Log contient justification si action critique (DELETE, ARCHIVED)
5. ✅ Tests passent

---

### T22 : Route API GET /api/audit-logs
**Priorité** : 🟢 Basse  
**Estimation** : 2h  
**Épique** : Audit Trail

**Description** :
- Route GET /api/audit-logs avec filtres :
  - ?entityType=, ?entityId=, ?userId=, ?actionType=
- Pagination (?page=, ?limit=)
- Seulement ADMIN peut accéder

**Livrables** :
- [ ] Route audit-logs
- [ ] Filtres/pagination
- [ ] Tests

**Critères d'acceptation** :
1. ✅ GET /api/audit-logs retourne logs (ADMIN uniquement)
2. ✅ Filtres fonctionnent (?entityType, ?entityId, ?userId, ?actionType)
3. ✅ Pagination fonctionne
4. ✅ VIEWER/MANAGER reçoivent 403
5. ✅ Tests passent

---

### T23 : Frontend - Page Audit Logs
**Priorité** : 🟢 Basse  
**Estimation** : 3h  
**Épique** : Audit Trail

**Description** :
- Page /audit-logs (tableau avec filtres)
- Affichage : date, user, action, entity, old/new values (format JSON pretty)
- Seulement ADMIN

**Livrables** :
- [ ] Page audit-logs
- [ ] Composants UI
- [ ] Filtres fonctionnels

**Critères d'acceptation** :
1. ✅ Page affiche logs d'audit
2. ✅ Filtres fonctionnent
3. ✅ old/new values affichés en JSON formaté
4. ✅ ADMIN peut accéder, autres rôles redirigés

---

## 🔔 Notifications

### T24 : Modèle Notification + Repository
**Priorité** : 🟡 Moyenne  
**Estimation** : 2h  
**Épique** : Notifications

**Description** :
- Créer NotificationRepository (backend/src/repositories/notification.repository.ts)
- Méthodes : create, findByUserId, markAsRead, markAllAsRead, countUnread
- Types TypeScript : Notification, CreateNotificationInput

**Livrables** :
- [ ] NotificationRepository
- [ ] Types
- [ ] Tests

**Critères d'acceptation** :
1. ✅ `notificationRepository.create(data)` crée notification
2. ✅ `notificationRepository.findByUserId(userId)` trouve notifications d'un user
3. ✅ `notificationRepository.countUnread(userId)` compte non lues
4. ✅ Tests passent

---

### T25 : Service Notification (création, envoi email)
**Priorité** : 🟡 Moyenne  
**Estimation** : 4h  
**Épique** : Notifications

**Description** :
- Créer NotificationService (backend/src/services/notification.service.ts)
- Méthodes :
  - createNotification(userId, obligationId, type, title, message, reminderDay)
  - sendEmail(userId, subject, body) → intégration nodemailer (SMTP)
- Configurer SMTP (variables env, template email simple HTML)

**Livrables** :
- [ ] NotificationService
- [ ] Intégration nodemailer
- [ ] Templates email (HTML simple)
- [ ] Tests (mock SMTP)

**Critères d'acceptation** :
1. ✅ createNotification crée notif in-app
2. ✅ sendEmail envoie email réel (si SMTP configuré)
3. ✅ Template email contient titre + message formaté
4. ✅ Tests mock SMTP passent

---

### T26 : Job planifié (génération notifications)
**Priorité** : 🟡 Moyenne  
**Estimation** : 4h  
**Épique** : Notifications

**Description** :
- Créer job node-cron (backend/src/jobs/notification.job.ts) qui tourne quotidiennement (9h)
- Job appelle NotificationService pour :
  - Trouver obligations avec due_date dans [J, J+90]
  - Calculer jours restants
  - Si jours restants dans reminder_days (90, 60, 30), créer notification
  - Envoyer email si type = EMAIL ou BOTH
- Éviter doublons (vérifier contrainte UNIQUE obligation_id, user_id, reminder_day)
- Logs job (Winston)

**Livrables** :
- [ ] Job node-cron
- [ ] Logique génération notifications
- [ ] Logs job (Winston)
- [ ] Tests (mocker date)

**Critères d'acceptation** :
1. ✅ Job crée notifications 90/60/30 jours avant due_date
2. ✅ Pas de doublons (contrainte UNIQUE respectée)
3. ✅ Emails envoyés si configuré
4. ✅ Logs générés pour traçabilité
5. ✅ Tests passent (date mockée)

---

### T27 : Routes API Notifications
**Priorité** : 🟡 Moyenne  
**Estimation** : 2h  
**Épique** : Notifications

**Description** :
- Routes :
  - GET /api/notifications (notifications de l'utilisateur connecté)
  - GET /api/notifications/unread (compteur)
  - PATCH /api/notifications/:id/read
  - PATCH /api/notifications/read-all

**Livrables** :
- [ ] Routes notifications
- [ ] Tests

**Critères d'acceptation** :
1. ✅ GET /api/notifications retourne notifications de l'utilisateur connecté
2. ✅ GET /api/notifications/unread retourne compteur
3. ✅ PATCH /api/notifications/:id/read marque comme lue
4. ✅ PATCH /api/notifications/read-all marque toutes comme lues
5. ✅ Tests passent

---

### T28 : Frontend - Composants Notifications
**Priorité** : 🟡 Moyenne  
**Estimation** : 3h  
**Épique** : Notifications

**Description** :
- Badge notification dans header (compteur non lues)
- Dropdown notifications (liste, marquer comme lu)
- Page /notifications (liste complète)
- Toast/alert pour nouvelles notifications (optionnel)

**Livrables** :
- [ ] Composants notifications
- [ ] Badge compteur
- [ ] Dropdown
- [ ] Intégration API

**Critères d'acceptation** :
1. ✅ Badge affiche compteur non lues
2. ✅ Dropdown affiche dernières notifications
3. ✅ Marquer comme lu fonctionne
4. ✅ Page /notifications affiche toutes notifications

---

## 📊 Dashboard

### T29 : Routes API Dashboard (stats, prochaines échéances)
**Priorité** : 🟡 Moyenne  
**Estimation** : 3h  
**Épique** : Dashboard

**Description** :
- Route GET /api/dashboard/stats :
  - Nombre contrats par status
  - Nombre obligations par status
  - Contrats à risque (avec obligations OVERDUE)
- Route GET /api/dashboard/upcoming-obligations :
  - Obligations dans les 30 prochains jours
  - Triées par due_date
- Utiliser vues SQL si besoin (upcoming_obligations, contracts_at_risk)

**Livrables** :
- [ ] Routes dashboard
- [ ] Requêtes SQL optimisées
- [ ] Tests

**Critères d'acceptation** :
1. ✅ GET /api/dashboard/stats retourne stats complètes
2. ✅ GET /api/dashboard/upcoming-obligations retourne obligations < 30 jours
3. ✅ Requêtes optimisées (index utilisés)
4. ✅ Tests passent

---

### T30 : Frontend - Page Dashboard
**Priorité** : 🟡 Moyenne  
**Estimation** : 5h  
**Épique** : Dashboard

**Description** :
- Page /dashboard avec :
  - Cartes stats (contrats ACTIVE, obligations PENDING, etc.)
  - Tableau prochaines échéances (30 jours)
  - Liste contrats à risque
  - Graphique répartition par status (Chart.js ou Recharts)
- Design moderne et sobre (Tailwind CSS)

**Livrables** :
- [ ] Page dashboard
- [ ] Composants stats/cartes
- [ ] Graphique (Chart.js/Recharts)
- [ ] Design moderne

**Critères d'acceptation** :
1. ✅ Cartes stats affichent chiffres corrects
2. ✅ Tableau échéances fonctionne
3. ✅ Liste contrats à risque fonctionne
4. ✅ Graphique affiche répartition par status
5. ✅ Design moderne et responsive

---

### T31 : Export CSV
**Priorité** : 🟢 Basse  
**Estimation** : 2h  
**Épique** : Dashboard

**Description** :
- Route GET /api/contracts/export?format=csv
- Route GET /api/obligations/export?format=csv
- Générer CSV avec toutes colonnes pertinentes
- Headers CSV corrects

**Livrables** :
- [ ] Routes export CSV
- [ ] Génération CSV correcte
- [ ] Tests

**Critères d'acceptation** :
1. ✅ GET /api/contracts/export?format=csv génère CSV téléchargeable
2. ✅ CSV contient toutes colonnes pertinentes
3. ✅ CSV ouvre correctement dans Excel/LibreOffice
4. ✅ Tests passent

---

## 🧪 Tests & Qualité

### T32 : Tests unitaires Services
**Priorité** : 🟡 Moyenne  
**Estimation** : 6h  
**Épique** : Tests

**Description** :
- Tests AuthService, ContractService, ObligationService, NotificationService
- Mocking repositories
- Coverage > 80%

**Livrables** :
- [ ] Tests services complets
- [ ] Coverage rapport (> 80%)

**Critères d'acceptation** :
1. ✅ Tous services ont tests unitaires
2. ✅ Coverage > 80% sur code métier
3. ✅ Tests passent

---

### T33 : Tests d'intégration API
**Priorité** : 🟡 Moyenne  
**Estimation** : 6h  
**Épique** : Tests

**Description** :
- Tests toutes routes API avec Supertest
- Setup/teardown DB (test database)
- Scénarios complets (créer contrat, créer obligation, notifications)

**Livrables** :
- [ ] Tests intégration complets
- [ ] Setup/teardown DB
- [ ] Coverage rapport

**Critères d'acceptation** :
1. ✅ Toutes routes API testées
2. ✅ Scénarios complets (workflows)
3. ✅ Tests passent avec DB de test
4. ✅ Coverage > 70% sur routes

---

### T34 : Tests E2E Frontend (optionnel)
**Priorité** : 🟢 Basse  
**Estimation** : 4h  
**Épique** : Tests

**Description** :
- Tests Playwright ou Cypress pour workflows critiques :
  - Login → Créer contrat → Créer obligation → Voir dashboard

**Livrables** :
- [ ] Tests E2E
- [ ] Documentation

**Critères d'acceptation** :
1. ✅ Workflow complet testé E2E
2. ✅ Tests passent

---

## 📚 Documentation & Déploiement

### T35 : Documentation API (Swagger/OpenAPI)
**Priorité** : 🟢 Basse  
**Estimation** : 3h  
**Épique** : Documentation

**Description** :
- Générer documentation OpenAPI avec swagger-jsdoc
- Route /api-docs avec Swagger UI
- Documenter toutes routes

**Livrables** :
- [ ] Documentation OpenAPI
- [ ] Swagger UI accessible

**Critères d'acceptation** :
1. ✅ /api-docs accessible et fonctionne
2. ✅ Toutes routes documentées
3. ✅ Exemples de requêtes/réponses

---

### T36 : README complet
**Priorité** : 🟡 Moyenne  
**Estimation** : 2h  
**Épique** : Documentation

**Description** :
- Documentation installation complète
- Variables d'environnement
- Commandes utiles
- Architecture résumée
- Screenshots (si disponibles)

**Livrables** :
- [ ] README.md complet et à jour

**Critères d'acceptation** :
1. ✅ README contient toutes infos nécessaires
2. ✅ Installation fonctionne en suivant README
3. ✅ Commandes documentées

---

### T37 : Guide déploiement production
**Priorité** : 🟢 Basse  
**Estimation** : 3h  
**Épique** : Déploiement

**Description** :
- Docker Compose production
- Variables env production
- Reverse proxy (nginx)
- SSL/HTTPS
- Backup DB

**Livrables** :
- [ ] Guide déploiement
- [ ] Docker Compose prod (optionnel)

**Critères d'acceptation** :
1. ✅ Guide déploiement complet
2. ✅ Instructions claires

---

## 📊 Résumé

**Total tickets** : 37  
**Priorité Haute** : 19 tickets (T1-T19)  
**Priorité Moyenne** : 14 tickets (T20-T34)  
**Priorité Basse** : 4 tickets (T35-T37)

**Estimation totale** : ~120-140h

**Ordre recommandé** : T1 → T37 (séquentiel par épique)

