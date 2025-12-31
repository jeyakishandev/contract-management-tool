# Modèle Logique de Données (MLD) - Version Détaillée

## Vue d'Ensemble

Le MLD détaille l'implémentation SQL du MCD avec :
- Tables avec types de données précis
- Clés primaires (PK) et étrangères (FK)
- Contraintes d'intégrité (CHECK, UNIQUE, NOT NULL)
- Index pour performances
- Triggers pour automatisations
- Vues pour requêtes récurrentes

---

## Variante 1 : SIMPLE (Recommandée pour V1)

### Table: users

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'VIEWER' 
        CHECK (role IN ('ADMIN', 'MANAGER', 'VIEWER')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Index pour performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
```

**Explication** :
- `role` en VARCHAR avec CHECK : Simple, facile à modifier
- Index sur email (connexion fréquente)
- Index partiel sur is_active (filtrage utilisateurs actifs)

### Table: contracts

```sql
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    reference VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'ACTIVE', 'SUSPENDED', 'CLOSING', 'ARCHIVED')),
    contract_type VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE,
    value DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'EUR',
    pdf_file_path VARCHAR(500),
    created_by_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes métier
    CONSTRAINT chk_end_after_start CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Index
CREATE INDEX idx_contracts_reference ON contracts(reference);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_created_by ON contracts(created_by_id);
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);
CREATE INDEX idx_contracts_status_dates ON contracts(status, start_date) 
    WHERE status IN ('ACTIVE', 'SUSPENDED');
```

**Explication** :
- Index composite `status + start_date` pour requêtes dashboard fréquentes
- Contrainte CHECK sur dates pour cohérence métier

### Table: obligations

```sql
CREATE TABLE obligations (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    obligation_type VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    reminder_days INTEGER[] NOT NULL DEFAULT ARRAY[90, 60, 30],
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurrence_pattern VARCHAR(50),
    recurrence_end_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'COMPLETED', 'OVERDUE')),
    completed_at TIMESTAMP,
    created_by_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes métier
    CONSTRAINT chk_recurrence 
        CHECK ((is_recurring = false) OR (is_recurring = true AND recurrence_pattern IS NOT NULL)),
    CONSTRAINT chk_recurrence_end 
        CHECK (recurrence_end_date IS NULL OR recurrence_end_date >= due_date)
);

-- Index
CREATE INDEX idx_obligations_contract ON obligations(contract_id);
CREATE INDEX idx_obligations_due_date ON obligations(due_date);
CREATE INDEX idx_obligations_status ON obligations(status);
CREATE INDEX idx_obligations_due_status ON obligations(due_date, status) 
    WHERE status IN ('PENDING', 'OVERDUE');
CREATE INDEX idx_obligations_recurring ON obligations(is_recurring) 
    WHERE is_recurring = true;
```

**Explication** :
- Index composite `due_date + status` pour requêtes notifications (job cron)
- Index partiel sur is_recurring pour filtrage récurrences

### Table: notifications

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    obligation_id INTEGER REFERENCES obligations(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('EMAIL', 'IN_APP', 'BOTH')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reminder_day INTEGER NOT NULL, -- 90, 60, ou 30 (pour éviter doublons)
    is_read BOOLEAN NOT NULL DEFAULT false,
    email_sent BOOLEAN NOT NULL DEFAULT false,
    email_sent_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Contrainte unique pour éviter doublons
    CONSTRAINT unq_notification_unique 
        UNIQUE (obligation_id, user_id, reminder_day)
);

-- Index
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_obligation ON notifications(obligation_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) 
    WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

**Explication** :
- **Contrainte unique** `(obligation_id, user_id, reminder_day)` : Évite doublons de notifications
- Index partiel sur `is_read = false` pour compteur non lues

### Table: audit_logs

```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    old_value JSONB,
    new_value JSONB,
    justification TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_action ON audit_logs(action_type);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_entity_created ON audit_logs(entity_type, entity_id, created_at DESC);
```

**Explication** :
- `JSONB` pour old_value/new_value : Permet requêtes JSON et index GIN si besoin
- Index composite pour requêtes audit par entité

---

## Variante 2 : ROBUSTE (Évolutif, plus complexe)

### Différences principales

#### 1. Enums PostgreSQL au lieu de VARCHAR

```sql
-- Créer les types ENUM
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'VIEWER');
CREATE TYPE contract_status AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'CLOSING', 'ARCHIVED');
CREATE TYPE obligation_status AS ENUM ('PENDING', 'COMPLETED', 'OVERDUE');
CREATE TYPE notification_type AS ENUM ('EMAIL', 'IN_APP', 'BOTH');

-- Utiliser dans les tables
CREATE TABLE users (
    -- ...
    role user_role NOT NULL DEFAULT 'VIEWER',
    -- ...
);

CREATE TABLE contracts (
    -- ...
    status contract_status NOT NULL DEFAULT 'DRAFT',
    -- ...
);
```

**Avantages** :
- ✅ Type-safety : Impossible d'insérer valeur invalide
- ✅ Performance : Stockage plus compact
- ✅ Documentation : Valeurs possibles visibles dans schéma

**Inconvénients** :
- ❌ Moins flexible : Modifier enum = migration complexe
- ❌ Moins portable : PostgreSQL-specific

#### 2. Table de relation pour reminder_days

Au lieu de `reminder_days INTEGER[]`, créer une table :

```sql
CREATE TABLE obligation_reminders (
    id SERIAL PRIMARY KEY,
    obligation_id INTEGER NOT NULL REFERENCES obligations(id) ON DELETE CASCADE,
    reminder_day INTEGER NOT NULL CHECK (reminder_day IN (90, 60, 30)),
    notification_sent BOOLEAN NOT NULL DEFAULT false,
    notification_sent_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unq_obligation_reminder UNIQUE (obligation_id, reminder_day)
);

CREATE INDEX idx_reminders_obligation ON obligation_reminders(obligation_id);
CREATE INDEX idx_reminders_pending ON obligation_reminders(obligation_id, notification_sent) 
    WHERE notification_sent = false;
```

**Avantages** :
- ✅ Historique : Traçabilité des rappels envoyés
- ✅ Flexibilité : Ajouter métadonnées (notification_sent_at)
- ✅ Normalisation : Structure relationnelle pure

**Inconvénients** :
- ❌ Plus complexe : Jointure supplémentaire
- ❌ Plus de code : Gestion relation supplémentaire

#### 3. Soft Delete pour contrats

```sql
CREATE TABLE contracts (
    -- ... autres colonnes ...
    deleted_at TIMESTAMP,
    deleted_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT chk_not_deleted_or_valid 
        CHECK ((deleted_at IS NULL) OR (deleted_at IS NOT NULL AND deleted_by_id IS NOT NULL))
);

-- Index pour filtrer actifs
CREATE INDEX idx_contracts_active ON contracts(id) WHERE deleted_at IS NULL;
```

**Avantages** :
- ✅ Audit complet : Pas de perte de données
- ✅ Récupération possible : Restauration
- ✅ Cohérence : Obligations toujours liées même si contrat "supprimé"

**Inconvénients** :
- ❌ Plus complexe : Toutes requêtes doivent filtrer `deleted_at IS NULL`
- ❌ Stockage : Données "supprimées" restent

#### 4. Table de workflow pour transitions

```sql
CREATE TABLE contract_status_transitions (
    id SERIAL PRIMARY KEY,
    from_status contract_status NOT NULL,
    to_status contract_status NOT NULL,
    allowed_roles user_role[] NOT NULL,
    requires_justification BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unq_transition UNIQUE (from_status, to_status)
);

-- Données de référence
INSERT INTO contract_status_transitions (from_status, to_status, allowed_roles, requires_justification) VALUES
('DRAFT', 'ACTIVE', ARRAY['MANAGER', 'ADMIN']::user_role[], false),
('ACTIVE', 'SUSPENDED', ARRAY['MANAGER', 'ADMIN']::user_role[], false),
('SUSPENDED', 'ACTIVE', ARRAY['MANAGER', 'ADMIN']::user_role[], false),
('ACTIVE', 'CLOSING', ARRAY['MANAGER', 'ADMIN']::user_role[], true),
('CLOSING', 'ARCHIVED', ARRAY['ADMIN']::user_role[], true);
```

**Avantages** :
- ✅ Configuration : Workflow modifiable sans code
- ✅ Audit : Traçabilité des règles
- ✅ Flexibilité : Ajouter transitions facilement

**Inconvénients** :
- ❌ Overkill pour V1 : Complexité inutile
- ❌ Plus de requêtes : Vérification transition en DB

---

## Triggers et Fonctions

### Trigger: Auto-update updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at 
    BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obligations_updated_at 
    BEFORE UPDATE ON obligations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Trigger: Calcul automatique OVERDUE

```sql
CREATE OR REPLACE FUNCTION update_obligation_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Marquer comme OVERDUE si due_date est passée et status = PENDING
    IF NEW.due_date < CURRENT_DATE 
       AND NEW.status = 'PENDING' 
       AND (OLD IS NULL OR OLD.status != 'OVERDUE') THEN
        NEW.status = 'OVERDUE';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_obligation_due_date 
    BEFORE INSERT OR UPDATE ON obligations
    FOR EACH ROW EXECUTE FUNCTION update_obligation_status();
```

**Note** : Un job cron quotidien complétera ce trigger pour les obligations existantes qui deviennent OVERDUE sans modification.

---

## Vues Utiles

### Vue: Prochaines échéances (Dashboard)

```sql
CREATE VIEW upcoming_obligations AS
SELECT 
    o.id,
    o.title,
    o.due_date,
    o.obligation_type,
    o.status,
    c.id as contract_id,
    c.title as contract_title,
    c.reference as contract_reference,
    (o.due_date - CURRENT_DATE) as days_remaining
FROM obligations o
INNER JOIN contracts c ON o.contract_id = c.id
WHERE o.status IN ('PENDING', 'OVERDUE')
    AND c.status NOT IN ('ARCHIVED')
ORDER BY o.due_date ASC;
```

### Vue: Contrats à risque

```sql
CREATE VIEW contracts_at_risk AS
SELECT 
    c.id,
    c.title,
    c.reference,
    c.status,
    COUNT(CASE WHEN o.status = 'OVERDUE' THEN 1 END) as overdue_count,
    COUNT(CASE WHEN o.due_date <= CURRENT_DATE + INTERVAL '30 days' 
               AND o.status = 'PENDING' THEN 1 END) as upcoming_30_days
FROM contracts c
LEFT JOIN obligations o ON c.id = o.contract_id
WHERE c.status IN ('ACTIVE', 'SUSPENDED')
GROUP BY c.id, c.title, c.reference, c.status
HAVING COUNT(CASE WHEN o.status = 'OVERDUE' THEN 1 END) > 0
    OR COUNT(CASE WHEN o.due_date <= CURRENT_DATE + INTERVAL '30 days' 
                  AND o.status = 'PENDING' THEN 1 END) > 3;
```

---

## Comparaison Variantes : Trade-offs

| Aspect | Variante 1 (SIMPLE) | Variante 2 (ROBUSTE) |
|--------|---------------------|----------------------|
| **Complexité** | ✅ Simple, facile à comprendre | ❌ Plus complexe, courbe d'apprentissage |
| **Performance** | ✅ Bonne (index optimisés) | ✅ Équivalente ou légèrement meilleure |
| **Flexibilité** | ✅ Facile à modifier (VARCHAR) | ❌ Moins flexible (ENUM, tables de config) |
| **Maintenabilité** | ✅ Code simple, moins de tables | ⚠️ Plus de tables, plus de relations |
| **Type-safety** | ⚠️ Validation application (Zod) | ✅ Validation DB (ENUM) |
| **Audit/Historique** | ⚠️ Audit logs uniquement | ✅ Soft delete + historique complet |
| **Time-to-market** | ✅ Rapide (V1) | ❌ Plus long (setup initial) |
| **Évolutivité** | ⚠️ Bonne pour < 10K contrats | ✅ Meilleure pour > 10K contrats |
| **Portabilité** | ✅ Portable (SQL standard) | ⚠️ PostgreSQL-specific |

### Recommandation : **Variante 1 (SIMPLE) pour V1**

**Pourquoi** :
- ✅ Time-to-market : Développement plus rapide
- ✅ Maintenabilité : Code plus simple à comprendre
- ✅ Flexibilité : Facile d'ajouter statuts/transitions sans migration
- ✅ Suffisant : Pour PME (< 1000 contrats), performance OK

**Quand passer à Variante 2** :
- ⚠️ Si > 10 000 contrats
- ⚠️ Si besoin de workflow très complexe/configurable
- ⚠️ Si besoin de soft delete pour récupération
- ⚠️ Si besoin de type-safety absolu en DB

---

## Notes d'Optimisation

### Index Partiels (WHERE)

Index conditionnels pour réduire taille et améliorer performance :
```sql
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
CREATE INDEX idx_obligations_recurring ON obligations(is_recurring) WHERE is_recurring = true;
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
```

### Index GIN pour JSONB (audit_logs)

Si besoin de rechercher dans old_value/new_value :
```sql
CREATE INDEX idx_audit_old_value ON audit_logs USING GIN (old_value);
CREATE INDEX idx_audit_new_value ON audit_logs USING GIN (new_value);
```

### Partitionnement (Futur)

Si audit_logs > 1M lignes :
```sql
-- Partitionnement par mois
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

---

## Migration depuis Variante 1 → Variante 2

Si migration nécessaire plus tard :

1. **Créer ENUM types**
2. **Alter table** : `ALTER TABLE contracts ALTER COLUMN status TYPE contract_status USING status::contract_status;`
3. **Ajouter colonnes** : `deleted_at`, `deleted_by_id` (nullable)
4. **Créer tables** : `obligation_reminders`, `contract_status_transitions`
5. **Migrer données** : Script de migration des reminder_days
6. **Ajouter contraintes** : Nouvelles contraintes

**Estimation** : 4-6h de travail

