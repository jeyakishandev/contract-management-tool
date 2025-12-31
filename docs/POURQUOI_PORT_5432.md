# Pourquoi le port 5432 ne fonctionne pas ?

## 🔍 Diagnostic

### Problème : Port déjà utilisé

Le port **5432** est déjà occupé par un autre conteneur Docker :

```
evently-db-1: 0.0.0.0:5432->5432/tcp  ← DÉJÀ UTILISÉ
```

## 📊 État Actuel des Conteneurs PostgreSQL

| Conteneur | Image | Port (Hôte) | Port (Container) | Statut |
|-----------|-------|-------------|------------------|--------|
| `evently-db-1` | postgres | **5432** | 5432 | ✅ Actif |
| `devboard-db` | postgres:16-alpine | - | 5432 | ✅ Actif (pas mappé) |
| `contract_postgres` | postgres:15-alpine | **5433** | 5432 | ✅ Actif |

---

## 💡 Explication Technique

### Comment fonctionne le mapping de ports Docker ?

```
docker-compose.yml:
ports:
  - '5432:5432'
       ↑     ↑
       |     └─ Port INTERNE du conteneur (toujours 5432 pour PostgreSQL)
       └─────── Port EXTERNE sur votre machine (doit être unique)
```

**Règle** : **Un seul processus peut écouter sur un port externe à la fois.**

### Pourquoi le conflit ?

1. **Conteneur `evently-db-1`** écoute déjà sur `0.0.0.0:5432`
2. Quand Docker essaie de démarrer `contract_postgres` sur le port 5432 :
   ```
   Error: Bind for 0.0.0.0:5432 failed: port is already allocated
   ```
3. Docker refuse car le port est déjà pris

---

## ✅ Solutions Possibles

### Solution 1 : Changer le port externe (✅ FAIT)

**Avantage** : Aucun impact sur les autres projets

```yaml
ports:
  - '5433:5432'  # Port externe 5433, interne toujours 5432
```

**Résultat** :
- Conteneur PostgreSQL utilise toujours le port 5432 en interne
- Accessible depuis votre machine sur le port **5433**
- Pas de conflit avec `evently-db-1`

**Utilisation** :
```bash
# Connexion depuis l'hôte
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/contract_db"
```

---

### Solution 2 : Arrêter le conteneur conflictuel (⚠️ NON RECOMMANDÉ)

```bash
# Arrêter le conteneur qui utilise le port 5432
docker stop evently-db-1

# Maintenant notre conteneur peut utiliser 5432
docker compose up -d postgres
```

**Problème** : 
- ❌ Arrête un autre projet (peut casser quelque chose)
- ❌ Nécessite de se souvenir de le relancer
- ❌ Pas une solution durable

---

### Solution 3 : Utiliser un réseau Docker isolé (⚠️ COMPLEXE)

```yaml
networks:
  contract_network:
    driver: bridge
    internal: true  # Réseau isolé
```

**Problème** :
- ❌ Plus complexe
- ❌ Limite l'accès depuis l'hôte
- ❌ Pas nécessaire pour notre cas

---

## 🎯 Solution Retenue : Port 5433

### Pourquoi c'est la meilleure solution ?

1. ✅ **Pas de conflit** : Chaque projet a son propre port
2. ✅ **Pas d'impact** : N'affecte pas les autres projets
3. ✅ **Standard** : Pratique courante en développement
4. ✅ **Simple** : Juste changer le port dans `DATABASE_URL`

### Comment ça fonctionne ?

```
Machine locale:
├── Port 5432 → evently-db-1 (autre projet)
└── Port 5433 → contract_postgres (notre projet) ✅

À l'intérieur du conteneur contract_postgres:
└── Port 5432 → PostgreSQL (standard, toujours 5432)
```

---

## 🔧 Impact sur le Projet

### Fichiers modifiés

1. **`docker-compose.yml`** :
   ```yaml
   ports:
     - '5433:5432'  # Port externe 5433
   ```

2. **`.env` (backend)** :
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/contract_db"
   ```

3. **`GUIDE_DEMARRAGE.md`** : Documentation mise à jour

### Aucun impact sur le code applicatif

- ✅ Prisma utilise `DATABASE_URL` (pas de hardcode)
- ✅ Le code ne connaît pas le numéro de port
- ✅ Facile à changer si besoin

---

## 📝 Notes Importantes

### En Production

En production, chaque service a généralement son propre serveur ou son propre port, donc pas de conflit. Le port 5432 est généralement utilisé directement.

### En Développement

C'est **normal** d'avoir plusieurs conteneurs PostgreSQL sur la même machine :
- Projet A → Port 5432
- Projet B → Port 5433
- Projet C → Port 5434
- etc.

---

## ✅ Conclusion

**Le port 5432 ne fonctionne pas car il est déjà utilisé par `evently-db-1`.**

**Solution** : Utiliser le port 5433 (ou n'importe quel autre port disponible).

**Résultat** : Tout fonctionne parfaitement ! ✅

