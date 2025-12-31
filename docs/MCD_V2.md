# Modèle Conceptuel de Données (MCD) - Version Détaillée

## Diagramme Entité-Association

```
┌──────────────────────┐
│        USER          │
├──────────────────────┤
│ id (PK)              │
│ email (UQ)           │
│ password_hash        │
│ first_name           │
│ last_name            │
│ role                 │  ◄────┐
│ is_active            │       │
│ created_at           │       │
│ updated_at           │       │
│ last_login_at        │       │
└──────────────────────┘       │
                               │
                ┌──────────────┘
                │
                │ 1,n
                │
┌───────────────▼───────────────────────┐
│         AUDIT_LOG                     │
├───────────────────────────────────────┤
│ id (PK)                               │
│ user_id (FK → USER)                   │
│ action_type                           │
│ entity_type                           │
│ entity_id                             │
│ old_value (JSON)                      │
│ new_value (JSON)                      │
│ justification                         │
│ ip_address                            │
│ user_agent                            │
│ created_at                            │
└───────────────────────────────────────┘
                │
                │ 1,n (tracking)
                │
┌───────────────▼───────────────────────┐
│        CONTRACT                       │
├───────────────────────────────────────┤
│ id (PK)                               │
│ title                                 │
│ reference (UQ)                        │
│ description                           │
│ status                                │  ◄────┐
│ contract_type                         │       │
│ start_date                            │       │
│ end_date                              │       │
│ value                                 │       │
│ currency                              │       │
│ pdf_file_path                         │       │
│ created_by_id (FK → USER)             │       │
│ created_at                            │       │
│ updated_at                            │       │
└───────────────────────────────────────┘       │
                │                                │
                │ 1,n                            │
                │                                │
┌───────────────▼───────────────────────┐       │
│        OBLIGATION                     │       │
├───────────────────────────────────────┤       │
│ id (PK)                               │       │
│ contract_id (FK → CONTRACT)           │       │
│ title                                 │       │
│ description                           │       │
│ obligation_type                       │       │
│ due_date                              │       │
│ reminder_days (ARRAY)                 │       │
│ is_recurring                          │       │
│ recurrence_pattern                    │       │
│ recurrence_end_date                   │       │
│ status                                │       │
│ completed_at                          │       │
│ created_by_id (FK → USER)             │       │
│ created_at                            │       │
│ updated_at                            │       │
└───────────────────────────────────────┘       │
                │                                │
                │ 1,n                            │
                │                                │
┌───────────────▼───────────────────────┐       │
│       NOTIFICATION                    │       │
├───────────────────────────────────────┤       │
│ id (PK)                               │       │
│ user_id (FK → USER)                   │       │
│ obligation_id (FK → OBLIGATION)       │       │
│ type                                  │       │
│ title                                 │       │
│ message                               │       │
│ reminder_day (pour éviter doublons)   │       │
│ is_read                               │       │
│ email_sent                            │       │
│ email_sent_at                         │       │
│ created_at                            │       │
└───────────────────────────────────────┘
```

## Cardinalités Détaillées

| Relation | Cardinalité | Description |
|----------|-------------|-------------|
| USER → AUDIT_LOG | 1,n | Un utilisateur peut générer plusieurs logs d'audit |
| USER → CONTRACT | 1,n | Un utilisateur peut créer plusieurs contrats |
| USER → OBLIGATION | 1,n | Un utilisateur peut créer plusieurs obligations |
| USER → NOTIFICATION | 1,n | Un utilisateur peut recevoir plusieurs notifications |
| CONTRACT → OBLIGATION | 1,n | Un contrat peut avoir plusieurs obligations |
| OBLIGATION → NOTIFICATION | 1,n | Une obligation peut générer plusieurs notifications (une par rappel) |

## Entités Détaillées

### USER (Utilisateur)
- **Rôle** : Gestion des utilisateurs de l'application
- **Propriétés** :
  - Identifiant unique (id)
  - Email unique pour connexion
  - Mot de passe hashé (bcrypt)
  - Informations personnelles (first_name, last_name)
  - Rôle système (ADMIN, MANAGER, VIEWER)
  - État actif/inactif
  - Traçabilité (created_at, updated_at, last_login_at)

### CONTRACT (Contrat)
- **Rôle** : Document contractuel avec workflow d'état
- **Propriétés** :
  - Identifiant unique (id)
  - Référence métier unique (reference)
  - Informations descriptives (title, description, contract_type)
  - Dates (start_date, end_date)
  - Valeur financière (value, currency)
  - Fichier PDF associé (pdf_file_path)
  - Statut dans workflow (status)
  - Traçabilité (created_by_id, created_at, updated_at)

### OBLIGATION (Obligation/Échéance)
- **Rôle** : Échéance ou obligation liée à un contrat
- **Propriétés** :
  - Identifiant unique (id)
  - Lien vers contrat parent (contract_id)
  - Informations descriptives (title, description, obligation_type)
  - Date d'échéance (due_date)
  - Rappels (reminder_days : tableau de jours)
  - Récurrence (is_recurring, recurrence_pattern, recurrence_end_date)
  - Statut (PENDING, COMPLETED, OVERDUE)
  - Traçabilité (created_by_id, created_at, updated_at, completed_at)

### NOTIFICATION (Notification)
- **Rôle** : Alerte pour rappel d'échéance
- **Propriétés** :
  - Identifiant unique (id)
  - Utilisateur destinataire (user_id)
  - Obligation liée (obligation_id, nullable)
  - Type (EMAIL, IN_APP, BOTH)
  - Contenu (title, message)
  - Jour de rappel (reminder_day : 90, 60, 30)
  - État lecture (is_read)
  - État email (email_sent, email_sent_at)
  - Date création (created_at)

### AUDIT_LOG (Journal d'audit)
- **Rôle** : Traçabilité complète des actions
- **Propriétés** :
  - Identifiant unique (id)
  - Utilisateur auteur (user_id)
  - Type d'action (action_type : CREATE, UPDATE, DELETE, STATUS_CHANGE)
  - Entité concernée (entity_type, entity_id)
  - Valeurs avant/après (old_value, new_value en JSON)
  - Justification (justification, obligatoire pour certaines actions)
  - Contexte (ip_address, user_agent)
  - Date (created_at)

## Contraintes d'Intégrité

### Contraintes d'Identité
- **USER.email** : UNIQUE, NOT NULL
- **CONTRACT.reference** : UNIQUE, NOT NULL
- **NOTIFICATION** : (obligation_id, user_id, reminder_day) UNIQUE (évite doublons)

### Contraintes Référentielles
- **CONTRACT.created_by_id** → USER.id (ON DELETE RESTRICT)
- **OBLIGATION.contract_id** → CONTRACT.id (ON DELETE CASCADE)
- **OBLIGATION.created_by_id** → USER.id (ON DELETE RESTRICT)
- **NOTIFICATION.user_id** → USER.id (ON DELETE CASCADE)
- **NOTIFICATION.obligation_id** → OBLIGATION.id (ON DELETE CASCADE)
- **AUDIT_LOG.user_id** → USER.id (ON DELETE RESTRICT)

### Contraintes Fonctionnelles
- **CONTRACT.end_date >= CONTRACT.start_date**
- **OBLIGATION.recurrence_end_date >= OBLIGATION.due_date** (si renseigné)
- **OBLIGATION.recurrence_pattern IS NOT NULL** si is_recurring = true

### Contraintes de Domaine
- **USER.role** IN ('ADMIN', 'MANAGER', 'VIEWER')
- **CONTRACT.status** IN ('DRAFT', 'ACTIVE', 'SUSPENDED', 'CLOSING', 'ARCHIVED')
- **OBLIGATION.status** IN ('PENDING', 'COMPLETED', 'OVERDUE')
- **NOTIFICATION.type** IN ('EMAIL', 'IN_APP', 'BOTH')
- **AUDIT_LOG.action_type** IN ('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'FILE_UPLOAD')

## Règles Métier

### Workflow des Contrats

**Graphe de transitions autorisées** :
```
DRAFT ──(Manager/Admin)──> ACTIVE
  │
  └──> (Manager/Admin) ──> ACTIVE ──> SUSPENDED ──> ACTIVE
                                      │
                                      └──> CLOSING ──(Admin)──> ARCHIVED
```

**Transitions autorisées** :
- DRAFT → ACTIVE (MANAGER ou ADMIN)
- ACTIVE → SUSPENDED (MANAGER ou ADMIN)
- SUSPENDED → ACTIVE (MANAGER ou ADMIN)
- ACTIVE → CLOSING (MANAGER ou ADMIN)
- CLOSING → ARCHIVED (ADMIN uniquement)

**Transitions interdites** :
- ARCHIVED → * (irréversible)
- SUSPENDED → ARCHIVED (doit passer par CLOSING)
- DRAFT → CLOSING (doit passer par ACTIVE)
- Toute transition non listée ci-dessus

**Contraintes supplémentaires** :
- ARCHIVED : lecture seule, aucune modification possible
- Justification obligatoire pour : DELETE contrat, transition vers ARCHIVED

### Workflow des Obligations

**Statuts possibles** :
- **PENDING** : Échéance future, en attente
- **COMPLETED** : Obligation remplie
- **OVERDUE** : Échéance dépassée, non complétée

**Règles** :
- Calcul automatique OVERDUE : si due_date < TODAY et status = PENDING → OVERDUE
- Récurrence : Si is_recurring = true et obligation complétée, créer nouvelle occurrence
- Rappels : Notifications générées à 90, 60, 30 jours avant due_date

### Permissions par Rôle

| Action | ADMIN | MANAGER | VIEWER |
|--------|-------|---------|--------|
| Créer contrat | ✅ | ✅ | ❌ |
| Modifier contrat | ✅ | ✅ | ❌ |
| Supprimer contrat | ✅ | ❌ | ❌ |
| Changer statut → ARCHIVED | ✅ | ❌ | ❌ |
| Créer obligation | ✅ | ✅ | ❌ |
| Voir tous contrats | ✅ | ✅ | ✅ |
| Export CSV | ✅ | ✅ | ⚠️ (limité) |
| Voir audit logs | ✅ | ❌ | ❌ |
| Gérer utilisateurs | ✅ | ❌ | ❌ |

### Notifications

**Génération automatique** :
- Job cron quotidien (9h)
- Trouve obligations avec due_date dans [J, J+90]
- Calcule jours restants
- Si jours restants ∈ reminder_days → crée notification
- Une notification par (obligation, user, reminder_day) → pas de doublons

**Types** :
- **EMAIL** : Envoi email uniquement
- **IN_APP** : Notification in-app uniquement
- **BOTH** : Les deux

### Audit Trail

**Actions trackées** :
- CREATE : Création entité
- UPDATE : Modification entité
- DELETE : Suppression entité
- STATUS_CHANGE : Changement de statut (workflow)
- FILE_UPLOAD : Upload fichier PDF

**Justification obligatoire pour** :
- DELETE contrat
- STATUS_CHANGE vers ARCHIVED ou CLOSING
- Suppression obligation récurrente

**Snapshots** :
- old_value : État complet avant modification (JSON)
- new_value : État complet après modification (JSON)

