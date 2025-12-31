# ADR 0004 : ORM / Query Builder

**Statut** : ✅ Accepté  
**Date** : 2024-01-XX  
**Décideurs** : Lead Dev  
**Contexte** : Choix de l'outil d'accès aux données (ORM ou Query Builder) pour PostgreSQL

## Décision

Choisir **Prisma** comme ORM pour l'accès aux données PostgreSQL.

## Alternatives considérées

### Alternative 1 : TypeORM

**Avantages** :
- ✅ Plus de features (relations complexes, migrations avancées)
- ✅ Décorateurs TypeScript (style NestJS)
- ✅ Support multi-databases

**Inconvénients** :
- ❌ Types moins sûrs (inférence limitée)
- ❌ Plus verbeux (decorators partout)
- ❌ Migrations moins intuitives
- ❌ DX moins bonne (moins de tooling)

**Verdict** : Rejeté, trop verbeux pour nos besoins simples

---

### Alternative 2 : Knex.js (Query Builder)

**Avantages** :
- ✅ Léger, rapide
- ✅ Contrôle total sur requêtes SQL
- ✅ Pas de "magie" ORM

**Inconvénients** :
- ❌ Pas d'ORM (pas de relations automatiques)
- ❌ Plus de code boilerplate
- ❌ Pas de type-safety automatique
- ❌ Migration manuelles plus longues

**Verdict** : Rejeté, trop de code à écrire manuellement

---

### Alternative 3 : Sequelize

**Avantages** :
- ✅ Mature, largement utilisé
- ✅ Support multi-databases

**Inconvénients** :
- ❌ Déclin (moins maintenu)
- ❌ Types TypeScript limités
- ❌ API verbeuse
- ❌ DX moyenne

**Verdict** : Rejeté, en déclin

---

### Alternative 4 : Prisma (Choisi) ✅

**Avantages** :
- ✅ **Type-safety end-to-end** : Génération automatique de types TypeScript depuis schéma
- ✅ **Migrations simples** : `prisma migrate dev` (génération + application)
- ✅ **Excellent DX** : Prisma Studio (UI graphique), introspection, auto-complétion
- ✅ **Query builder intuitif** : API fluide et lisible
- ✅ **Performance** : Requêtes optimisées, connexions poolées
- ✅ **Validation schéma** : Erreurs détectées à la génération

**Inconvénients** :
- ⚠️ Courbe d'apprentissage si nouvelle équipe
- ⚠️ Moins flexible que Knex pour requêtes très complexes
- ⚠️ Vendor lock-in (mais export possible)

**Exemple d'utilisation** :
```typescript
// Type-safe, auto-complétion complète
const contract = await prisma.contract.findUnique({
  where: { id: 1 },
  include: { obligations: true }
});

// TypeScript sait que contract.obligations existe
```

## Conséquences

### Positives
- ✅ Développement rapide (moins de code à écrire)
- ✅ Moins de bugs (types détectés à la compilation)
- ✅ Refactoring sûr (TypeScript guide les changements)
- ✅ Onboarding facilité (code auto-généré = documentation)

### Négatives
- ⚠️ Apprentissage initial (mais bien documenté)
- ⚠️ Moins de contrôle fine (rarement problématique)

## Migration future

Si besoin de requêtes très complexes (analytics, aggregations lourdes), on peut :
1. Utiliser `prisma.$queryRaw` pour SQL brut
2. Créer des vues PostgreSQL et les exposer via Prisma
3. Intégrer Knex.js en complément (cas rare)

## Implémentation

- Schéma dans `backend/prisma/schema.prisma`
- Client généré : `prisma generate`
- Migrations : `prisma migrate dev`
- Studio : `prisma studio` (dev uniquement)

---

