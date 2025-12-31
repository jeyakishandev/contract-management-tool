# Dictionnaire de Données - Version Complète

## Vue d'ensemble

Ce dictionnaire détaille toutes les tables, colonnes, types, contraintes, et exemples de valeurs.

---

## Table: users

**Rôle** : Gestion des utilisateurs de l'application

| Colonne | Type | NULL | DEFAULT | Contraintes | Description | Exemple |
|---------|------|------|---------|-------------|-------------|---------|
| id | SERIAL | ❌ | AUTO | PK | Identifiant unique de l'utilisateur | 1 |
| email | VARCHAR(255) | ❌ | - | UNIQUE, NOT NULL | Adresse email (identifiant de connexion) | john.doe@company.com |
| password_hash | VARCHAR(255) | ❌ | - | NOT NULL | Hash bcrypt du mot de passe (salt rounds 10) | $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy |
| first_name | VARCHAR(100) | ❌ | - | NOT NULL | Prénom de l'utilisateur | John |
| last_name | VARCHAR(100) | ❌ | - | NOT NULL | Nom de famille de l'utilisateur | Doe |
| role | VARCHAR(20) | ❌ | 'VIEWER' | NOT NULL, CHECK | Rôle utilisateur (ADMIN, MANAGER, VIEWER) | MANAGER |
| is_active | BOOLEAN | ❌ | true | NOT NULL | Compte actif ou désactivé | true |
| created_at | TIMESTAMP | ❌ | CURRENT_TIMESTAMP | NOT NULL | Date et heure de création du compte | 2024-01-15 10:30:00 |
| updated_at | TIMESTAMP | ❌ | CURRENT_TIMESTAMP | NOT NULL | Date et heure de dernière modification | 2024-01-20 14:20:00 |
| last_login_at | TIMESTAMP | ✅ | NULL | - | Date et heure de dernière connexion | 2024-01-25 09:15:00 |

**Index** :
- `idx_users_email` sur `email` (UNIQUE)
- `idx_users_role` sur `role`
- `idx_users_active` sur `is_active` WHERE `is_active = true`

**Contraintes** :
- `role IN ('ADMIN', 'MANAGER', 'VIEWER')`
- `email` UNIQUE

**Relations** :
- 1 utilisateur peut créer plusieurs contrats (via `contracts.created_by_id`)
- 1 utilisateur peut créer plusieurs obligations (via `obligations.created_by_id`)
- 1 utilisateur peut avoir plusieurs logs d'audit (via `audit_logs.user_id`)
- 1 utilisateur peut recevoir plusieurs notifications (via `notifications.user_id`)

---

## Table: contracts

**Rôle** : Gestion des contrats avec workflow d'état

| Colonne | Type | NULL | DEFAULT | Contraintes | Description | Exemple |
|---------|------|------|---------|-------------|-------------|---------|
| id | SERIAL | ❌ | AUTO | PK | Identifiant unique du contrat | 1 |
| title | VARCHAR(255) | ❌ | - | NOT NULL | Titre du contrat | Contrat de maintenance IT |
| reference | VARCHAR(100) | ❌ | - | UNIQUE, NOT NULL | Référence unique du contrat (métier) | CONTRACT-2024-001 |
| description | TEXT | ✅ | NULL | - | Description détaillée du contrat | Maintenance serveurs et réseau pour 2024 |
| status | VARCHAR(20) | ❌ | 'DRAFT' | NOT NULL, CHECK | Statut dans workflow | ACTIVE |
| contract_type | VARCHAR(50) | ✅ | NULL | - | Type de contrat | Maintenance, Prestation, Location |
| start_date | DATE | ❌ | - | NOT NULL | Date de début du contrat | 2024-01-01 |
| end_date | DATE | ✅ | NULL | CHECK | Date de fin du contrat (optionnel) | 2024-12-31 |
| value | DECIMAL(15,2) | ✅ | NULL | - | Valeur monétaire du contrat | 50000.00 |
| currency | VARCHAR(3) | ❌ | 'EUR' | DEFAULT | Code devise ISO 4217 | EUR |
| pdf_file_path | VARCHAR(500) | ✅ | NULL | - | Chemin vers le fichier PDF stocké | /uploads/contracts/2024/contract-001.pdf |
| created_by_id | INTEGER | ❌ | - | FK → users(id), NOT NULL | Utilisateur créateur du contrat | 1 |
| created_at | TIMESTAMP | ❌ | CURRENT_TIMESTAMP | NOT NULL | Date et heure de création | 2024-01-15 10:30:00 |
| updated_at | TIMESTAMP | ❌ | CURRENT_TIMESTAMP | NOT NULL | Date et heure de dernière modification | 2024-01-20 14:20:00 |

**Index** :
- `idx_contracts_reference` sur `reference` (UNIQUE)
- `idx_contracts_status` sur `status`
- `idx_contracts_created_by` sur `created_by_id`
- `idx_contracts_dates` sur `(start_date, end_date)`
- `idx_contracts_status_dates` sur `(status, start_date)` WHERE `status IN ('ACTIVE', 'SUSPENDED')`

**Contraintes** :
- `status IN ('DRAFT', 'ACTIVE', 'SUSPENDED', 'CLOSING', 'ARCHIVED')`
- `reference` UNIQUE
- `end_date IS NULL OR end_date >= start_date` (CHECK)
- `created_by_id` → `users.id` (FK, ON DELETE RESTRICT)

**Workflow des statuts** :
- **DRAFT** : Brouillon, en cours de rédaction
- **ACTIVE** : Contrat actif, en cours
- **SUSPENDED** : Suspendu temporairement
- **CLOSING** : En cours de clôture
- **ARCHIVED** : Archivé, lecture seule

**Transitions autorisées** :
- DRAFT → ACTIVE (MANAGER/ADMIN)
- ACTIVE → SUSPENDED (MANAGER/ADMIN)
- SUSPENDED → ACTIVE (MANAGER/ADMIN)
- ACTIVE → CLOSING (MANAGER/ADMIN)
- CLOSING → ARCHIVED (ADMIN uniquement)

**Relations** :
- 1 contrat peut avoir plusieurs obligations (via `obligations.contract_id`)

---

## Table: obligations

**Rôle** : Gestion des obligations/échéances liées aux contrats

| Colonne | Type | NULL | DEFAULT | Contraintes | Description | Exemple |
|---------|------|------|---------|-------------|-------------|---------|
| id | SERIAL | ❌ | AUTO | PK | Identifiant unique de l'obligation | 1 |
| contract_id | INTEGER | ❌ | - | FK → contracts(id), NOT NULL | Contrat parent | 1 |
| title | VARCHAR(255) | ❌ | - | NOT NULL | Titre de l'obligation | Paiement trimestriel Q1 |
| description | TEXT | ✅ | NULL | - | Description détaillée | Paiement de la facture Q1 2024 |
| obligation_type | VARCHAR(50) | ❌ | - | NOT NULL | Type d'obligation | Paiement, Renouvellement, Résiliation, Rapport |
| due_date | DATE | ❌ | - | NOT NULL | Date d'échéance de l'obligation | 2024-03-31 |
| reminder_days | INTEGER[] | ❌ | ARRAY[90,60,30] | NOT NULL | Jours avant échéance pour rappels | [90, 60, 30] |
| is_recurring | BOOLEAN | ❌ | false | NOT NULL | Indique si obligation récurrente | true |
| recurrence_pattern | VARCHAR(50) | ✅ | NULL | CHECK | Pattern de récurrence | MONTHLY, QUARTERLY, YEARLY |
| recurrence_end_date | DATE | ✅ | NULL | CHECK | Date de fin de récurrence | 2024-12-31 |
| status | VARCHAR(20) | ❌ | 'PENDING' | NOT NULL, CHECK | Statut de l'obligation | PENDING |
| completed_at | TIMESTAMP | ✅ | NULL | - | Date et heure de complétion | 2024-03-28 16:45:00 |
| created_by_id | INTEGER | ❌ | - | FK → users(id), NOT NULL | Utilisateur créateur | 1 |
| created_at | TIMESTAMP | ❌ | CURRENT_TIMESTAMP | NOT NULL | Date et heure de création | 2024-01-15 10:30:00 |
| updated_at | TIMESTAMP | ❌ | CURRENT_TIMESTAMP | NOT NULL | Date et heure de dernière modification | 2024-01-20 14:20:00 |

**Index** :
- `idx_obligations_contract` sur `contract_id`
- `idx_obligations_due_date` sur `due_date`
- `idx_obligations_status` sur `status`
- `idx_obligations_due_status` sur `(due_date, status)` WHERE `status IN ('PENDING', 'OVERDUE')`
- `idx_obligations_recurring` sur `is_recurring` WHERE `is_recurring = true`

**Contraintes** :
- `status IN ('PENDING', 'COMPLETED', 'OVERDUE')`
- `contract_id` → `contracts.id` (FK, ON DELETE CASCADE)
- `created_by_id` → `users.id` (FK, ON DELETE RESTRICT)
- `(is_recurring = false) OR (is_recurring = true AND recurrence_pattern IS NOT NULL)` (CHECK)
- `recurrence_end_date IS NULL OR recurrence_end_date >= due_date` (CHECK)

**Statuts possibles** :
- **PENDING** : Échéance future, en attente
- **COMPLETED** : Obligation remplie
- **OVERDUE** : Échéance dépassée, non complétée (calculé automatiquement)

**Types d'obligations** :
- `PAYMENT` : Paiement
- `RENEWAL` : Renouvellement
- `TERMINATION` : Résiliation
- `REPORT` : Rapport à fournir
- `MEETING` : Réunion
- `DOCUMENT` : Document à fournir

**Patterns de récurrence** :
- `MONTHLY` : Mensuel
- `QUARTERLY` : Trimestriel
- `YEARLY` : Annuel
- `WEEKLY` : Hebdomadaire (optionnel)

**Reminder_days** : Tableau PostgreSQL d'entiers
- Format : `[90, 60, 30]` signifie rappels à 90j, 60j, et 30j avant `due_date`
- Utilisé par job cron pour générer notifications

**Relations** :
- 1 obligation appartient à 1 contrat (via `contract_id`)
- 1 obligation peut générer plusieurs notifications (via `notifications.obligation_id`)

---

## Table: notifications

**Rôle** : Gestion des notifications (in-app et email) pour rappels d'échéances

| Colonne | Type | NULL | DEFAULT | Contraintes | Description | Exemple |
|---------|------|------|---------|-------------|-------------|---------|
| id | SERIAL | ❌ | AUTO | PK | Identifiant unique de la notification | 1 |
| user_id | INTEGER | ❌ | - | FK → users(id), NOT NULL | Utilisateur destinataire | 2 |
| obligation_id | INTEGER | ✅ | NULL | FK → obligations(id) | Obligation liée (nullable pour notifs système) | 1 |
| type | VARCHAR(20) | ❌ | - | NOT NULL, CHECK | Type de notification | IN_APP, EMAIL, BOTH |
| title | VARCHAR(255) | ❌ | - | NOT NULL | Titre de la notification | Échéance dans 30 jours |
| message | TEXT | ❌ | - | NOT NULL | Message de la notification | Le contrat CONTRACT-2024-001 a une échéance le 2024-03-31 |
| reminder_day | INTEGER | ❌ | - | NOT NULL | Jour de rappel (90, 60, ou 30) | 30 |
| is_read | BOOLEAN | ❌ | false | NOT NULL | Indique si notification lue | false |
| email_sent | BOOLEAN | ❌ | false | NOT NULL | Indique si email envoyé avec succès | true |
| email_sent_at | TIMESTAMP | ✅ | NULL | - | Date et heure d'envoi de l'email | 2024-02-01 09:00:00 |
| created_at | TIMESTAMP | ❌ | CURRENT_TIMESTAMP | NOT NULL | Date et heure de création | 2024-02-01 09:00:00 |

**Index** :
- `idx_notifications_user` sur `user_id`
- `idx_notifications_obligation` sur `obligation_id`
- `idx_notifications_unread` sur `(user_id, is_read)` WHERE `is_read = false`
- `idx_notifications_created` sur `created_at DESC`

**Contraintes** :
- `type IN ('EMAIL', 'IN_APP', 'BOTH')`
- `user_id` → `users.id` (FK, ON DELETE CASCADE)
- `obligation_id` → `obligations.id` (FK, ON DELETE CASCADE, nullable)
- `UNIQUE (obligation_id, user_id, reminder_day)` : Évite doublons de notifications

**Types** :
- **EMAIL** : Notification email uniquement
- **IN_APP** : Notification in-app uniquement
- **BOTH** : Les deux (email + in-app)

**reminder_day** : Valeurs possibles 90, 60, 30
- Utilisé avec contrainte UNIQUE pour éviter doublons
- Permet de créer une notification par jour de rappel

**Relations** :
- 1 notification est destinée à 1 utilisateur (via `user_id`)
- 1 notification peut être liée à 1 obligation (via `obligation_id`, nullable)

---

## Table: audit_logs

**Rôle** : Traçabilité complète des actions (qui a changé quoi, quand, pourquoi)

| Colonne | Type | NULL | DEFAULT | Contraintes | Description | Exemple |
|---------|------|------|---------|-------------|-------------|---------|
| id | SERIAL | ❌ | AUTO | PK | Identifiant unique du log | 1 |
| user_id | INTEGER | ❌ | - | FK → users(id), NOT NULL | Utilisateur ayant effectué l'action | 1 |
| action_type | VARCHAR(50) | ❌ | - | NOT NULL | Type d'action effectuée | CREATE, UPDATE, DELETE, STATUS_CHANGE |
| entity_type | VARCHAR(50) | ❌ | - | NOT NULL | Type d'entité concernée | CONTRACT, OBLIGATION, USER |
| entity_id | INTEGER | ❌ | - | NOT NULL | ID de l'entité concernée | 1 |
| old_value | JSONB | ✅ | NULL | - | État complet avant modification (JSON) | {"status": "DRAFT", "title": "..."} |
| new_value | JSONB | ✅ | NULL | - | État complet après modification (JSON) | {"status": "ACTIVE", "title": "..."} |
| justification | TEXT | ✅ | NULL | - | Justification de l'action (obligatoire pour certaines) | Renouvellement automatique |
| ip_address | VARCHAR(45) | ✅ | NULL | - | Adresse IP de l'utilisateur (IPv4 ou IPv6) | 192.168.1.100 |
| user_agent | TEXT | ✅ | NULL | - | User-Agent du navigateur | Mozilla/5.0 (Windows NT 10.0; Win64; x64)... |
| created_at | TIMESTAMP | ❌ | CURRENT_TIMESTAMP | NOT NULL | Date et heure de l'action | 2024-01-20 14:20:00 |

**Index** :
- `idx_audit_user` sur `user_id`
- `idx_audit_entity` sur `(entity_type, entity_id)`
- `idx_audit_action` sur `action_type`
- `idx_audit_created` sur `created_at DESC`
- `idx_audit_entity_created` sur `(entity_type, entity_id, created_at DESC)`

**Contraintes** :
- `user_id` → `users.id` (FK, ON DELETE RESTRICT)

**Types d'actions** :
- **CREATE** : Création d'une entité
- **UPDATE** : Modification d'une entité
- **DELETE** : Suppression d'une entité
- **STATUS_CHANGE** : Changement de statut (workflow)
- **FILE_UPLOAD** : Upload de fichier PDF

**Types d'entités** :
- **CONTRACT** : Contrat
- **OBLIGATION** : Obligation
- **USER** : Utilisateur
- **NOTIFICATION** : Notification (rare)

**Justification obligatoire pour** :
- DELETE contrat
- STATUS_CHANGE vers ARCHIVED ou CLOSING
- Suppression obligation récurrente

**old_value / new_value** : JSONB
- Format : Snapshot complet de l'entité en JSON
- Exemple pour contrat :
  ```json
  {
    "id": 1,
    "title": "Contrat maintenance",
    "status": "DRAFT",
    "start_date": "2024-01-01",
    ...
  }
  ```

**Relations** :
- 1 log d'audit est associé à 1 utilisateur (via `user_id`)

---

## Résumé des Relations

| Relation | Cardinalité | Table Source | Colonne Source | Table Cible | Colonne Cible | CASCADE |
|----------|-------------|--------------|----------------|-------------|---------------|---------|
| contracts → users | n,1 | contracts | created_by_id | users | id | RESTRICT |
| obligations → contracts | n,1 | obligations | contract_id | contracts | id | CASCADE |
| obligations → users | n,1 | obligations | created_by_id | users | id | RESTRICT |
| notifications → users | n,1 | notifications | user_id | users | id | CASCADE |
| notifications → obligations | n,1 | notifications | obligation_id | obligations | id | CASCADE |
| audit_logs → users | n,1 | audit_logs | user_id | users | id | RESTRICT |

**CASCADE** :
- **CASCADE** : Suppression parent → supprime enfants (obligations si contrat supprimé)
- **RESTRICT** : Empêche suppression parent si enfants existent (utilisateurs si contrats créés)

---

## Règles Métier par Table

### users
- Email doit être unique
- Password hash obligatoire (sauf invitation en attente, cas non couvert V1)
- Role doit être ADMIN, MANAGER, ou VIEWER

### contracts
- Reference doit être unique
- end_date >= start_date
- Status suit workflow (transitions validées en application)
- ARCHIVED = lecture seule

### obligations
- due_date obligatoire
- Si is_recurring = true, recurrence_pattern obligatoire
- status = OVERDUE si due_date < TODAY et status = PENDING (calculé automatiquement)

### notifications
- UNIQUE (obligation_id, user_id, reminder_day) pour éviter doublons
- email_sent = true uniquement si email effectivement envoyé

### audit_logs
- justification obligatoire pour DELETE contrat, STATUS_CHANGE vers ARCHIVED/CLOSING
- old_value et new_value : snapshot complet en JSONB

