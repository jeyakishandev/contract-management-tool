# Workflow Git Professionnel

## 🌳 Structure des Branches

### Branches Principales

1. **`main`** (ou `master`)
   - ✅ **Rôle** : Code stable, déployable en production
   - ✅ **Protection** : Ne jamais commiter directement dessus
   - ✅ **Merge** : Uniquement depuis `dev` (via PR)

2. **`dev`** (ou `develop`)
   - ✅ **Rôle** : Branche de développement principal
   - ✅ **Protection** : Ne jamais commiter directement dessus (sauf exceptions)
   - ✅ **Merge** : Toutes les features sont mergées ici
   - ✅ **État** : Toujours fonctionnel, peut avoir des bugs mineurs

3. **Branches Feature** (`feat/TX-nom`, `chore/TX-nom`, `fix/TX-nom`)
   - ✅ **Rôle** : Un ticket = une branche
   - ✅ **Source** : Créée depuis `dev`
   - ✅ **Destination** : Mergée dans `dev` via PR
   - ✅ **Durée de vie** : Supprimée après merge

---

## 🔄 Workflow Complet

```
main (production)
  ↑
  │ Merge depuis dev (release)
  │
dev (développement)
  ↑
  │ Merge via PR
  │
feat/T2-docker-compose
feat/T3-prisma
chore/T4-ci-cd
...
```

### Exemple Concret

1. **Créer branche depuis `dev`** :
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/T3-prisma
   ```

2. **Développer** : Commits sur `feat/T3-prisma`

3. **Push et créer PR** :
   ```bash
   git push -u origin feat/T3-prisma
   # Créer PR : dev ← feat/T3-prisma
   ```

4. **Merge dans `dev`** : Via PR sur GitHub

5. **Plus tard, release** :
   ```bash
   # Quand dev est stable, merger dans main
   git checkout main
   git merge dev  # ou via PR
   git tag v1.0.0
   ```

---

## 📋 Commandes Utiles

### Setup Initial (une seule fois)

```bash
# Créer branche dev depuis main
git checkout main
git checkout -b dev
git push -u origin dev
```

### Workflow Quotidien

```bash
# 1. Récupérer dernières versions
git checkout dev
git pull origin dev

# 2. Créer branche feature
git checkout -b feat/T5-user-model

# 3. Développer et commiter
git add .
git commit -m "feat(T5): add user model"

# 4. Push
git push -u origin feat/T5-user-model

# 5. Créer PR sur GitHub : dev ← feat/T5-user-model

# 6. Après merge, nettoyer
git checkout dev
git pull origin dev
git branch -d feat/T5-user-model
```

---

## ⚠️ Règles Importantes

1. **Jamais de commits directs sur `main`** ❌
2. **Jamais de commits directs sur `dev`** (sauf hotfix) ❌
3. **Un ticket = une branche** ✅
4. **Toujours créer branche depuis `dev`** ✅
5. **Toujours merger via PR** ✅
6. **Supprimer branche après merge** ✅

---

## 🔀 Cas Spéciaux

### Hotfix (bug critique en production)

```bash
# Créer depuis main
git checkout main
git checkout -b hotfix/critical-bug

# Fixer le bug
git commit -m "fix: critical security issue"

# Merger dans main ET dev
git checkout main
git merge hotfix/critical-bug

git checkout dev
git merge hotfix/critical-bug
```

### Release (déployer dev vers main)

```bash
# Créer branche release
git checkout dev
git checkout -b release/v1.0.0

# Tests, corrections dernières minutes
git commit -m "chore: bump version to 1.0.0"

# Merger dans main
git checkout main
git merge release/v1.0.0
git tag v1.0.0

# Merger dans dev (pour garder synchronisé)
git checkout dev
git merge release/v1.0.0
```

---

## ✅ Avantages de ce Workflow

1. **`main` toujours stable** : Code production prêt
2. **`dev` pour intégration** : Tests ensemble de toutes les features
3. **Isolation** : Chaque ticket isolé sur sa branche
4. **Traçabilité** : PR avec historique clair
5. **Rollback facile** : Si problème, rollback `dev` sans affecter `main`

---

## 📊 État Actuel vs État Cible

### État Actuel (Initialisation)
- ✅ `main` : Code initialisé
- ❌ `dev` : N'existe pas encore
- ✅ Features : Directement mergées dans `main`

### État Cible (Professionnel)
- ✅ `main` : Production stable
- ✅ `dev` : Développement actif
- ✅ Features : Mergées dans `dev`, puis `dev` → `main` pour release

---

## 🚀 Migration (Recommandé Maintenant)

Pour un projet portfolio, on peut :
- **Option A** : Continuer avec `main` uniquement (plus simple, OK pour portfolio solo)
- **Option B** : Créer `dev` maintenant (plus professionnel, démontre connaissance workflow)

**Recommandation** : **Option B** - Créer `dev` maintenant pour avoir un workflow professionnel dès le début.

