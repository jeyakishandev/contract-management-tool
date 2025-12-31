# ADR 0006 : Upload de Fichiers

**Statut** : ✅ Accepté  
**Date** : 2024-01-XX  
**Décideurs** : Lead Dev  
**Contexte** : Stratégie de stockage des fichiers PDF des contrats (dev + prod)

## Décision

**Développement** : Stockage local (filesystem)  
**Production** : Abstraction avec interface → migration vers S3 possible

## Alternatives considérées

### Alternative 1 : Stockage cloud uniquement (S3, Cloudinary)

**Avantages** :
- ✅ Scalable dès le début
- ✅ Pas de gestion fichiers serveur
- ✅ CDN intégré (Cloudinary)

**Inconvénients** :
- ❌ **Dépendance externe** : Nécessite compte cloud en dev
- ❌ **Coût** : Même pour dev/test
- ❌ **Complexité setup** : Credentials, configuration
- ❌ **Vitesse dev** : Plus lent (upload réseau)

**Verdict** : Rejeté, trop complexe pour dev local

---

### Alternative 2 : Stockage DB (PostgreSQL BYTEA)

**Avantages** :
- ✅ Tout centralisé (DB)
- ✅ Transactions atomiques
- ✅ Backup automatique avec DB

**Inconvénients** :
- ❌ **Performance** : DB lente pour gros fichiers
- ❌ **Taille DB** : DB gonfle rapidement
- ❌ **Limite** : PostgreSQL a limite pratique (~1GB par ligne)
- ❌ **Restauration** : Backup DB très lourd

**Verdict** : Rejeté, mauvaises performances pour fichiers

---

### Alternative 3 : Abstraction avec Storage Interface (Choisi) ✅

**Architecture** :
- **Interface TypeScript** : `StorageService` avec méthodes `upload()`, `download()`, `delete()`
- **Implémentation Local** : Stockage filesystem (dev)
- **Implémentation S3** : AWS S3 (prod, future)
- **Migration transparente** : Changer implémentation sans modifier code métier

**Avantages** :
- ✅ **Simple en dev** : Pas de dépendance externe
- ✅ **Flexible** : Migration vers S3 sans refactoring
- ✅ **Testable** : Mock interface facilement
- ✅ **Performance dev** : Filesystem local = rapide

**Inconvénients** :
- ⚠️ Abstraction supplémentaire (mais bénéfique long terme)

**Exemple d'interface** :
```typescript
interface StorageService {
  upload(file: Buffer, path: string): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  getUrl(path: string): Promise<string>;
}

// Implémentation Local
class LocalStorageService implements StorageService {
  async upload(file: Buffer, path: string) {
    await fs.writeFile(`./uploads/${path}`, file);
    return path;
  }
}

// Implémentation S3 (future)
class S3StorageService implements StorageService {
  async upload(file: Buffer, path: string) {
    await s3.putObject({ Bucket, Key: path, Body: file });
    return path;
  }
}
```

## Conséquences

### Positives
- ✅ Développement simple (pas de S3 en dev)
- ✅ Migration prod facile (changer implémentation)
- ✅ Tests simples (mock interface)
- ✅ Code métier découplé du stockage

### Négatives
- ⚠️ Abstraction supplémentaire (mais bénéfique)

## Implémentation

### Structure fichiers
```
backend/
├── src/
│   ├── services/
│   │   └── storage/
│   │       ├── storage.service.ts (interface)
│   │       ├── local-storage.service.ts (impl dev)
│   │       └── s3-storage.service.ts (impl prod, future)
│   └── uploads/ (dev uniquement, gitignored)
│       └── contracts/
│           └── 2024/
│               └── contract-1.pdf
```

### Variables d'environnement
```env
# Dev
STORAGE_TYPE=local
UPLOAD_DIR=./uploads

# Prod
STORAGE_TYPE=s3
S3_BUCKET=contracts-pdf
AWS_REGION=eu-west-1
```

### Validation
- Type : PDF uniquement
- Taille : Max 10MB
- Nom fichier : Généré (UUID) pour éviter collisions

## Migration future

Migration vers S3 :
1. Créer `S3StorageService` implémentant interface
2. Changer `STORAGE_TYPE=s3` en prod
3. Migrer fichiers existants (script one-time)
4. Code métier inchangé ✅

---

