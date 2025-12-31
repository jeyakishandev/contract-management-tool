# ADR 0007 : Jobs Planifiés (Cron vs Queue)

**Statut** : ✅ Accepté  
**Date** : 2024-01-XX  
**Décideurs** : Lead Dev  
**Contexte** : Choix du mécanisme pour jobs planifiés (notifications quotidiennes)

## Décision

**V1** : **node-cron** (simple, intégré)  
**Future** : Migration vers **Bull + Redis** si volumétrie augmente

## Alternatives considérées

### Alternative 1 : Queue System (Bull + Redis)

**Architecture** :
- Jobs dans queue Redis
- Workers traitent jobs
- Retry automatique, priorité, délai

**Avantages** :
- ✅ **Robuste** : Retry automatique si échec
- ✅ **Scalable** : Plusieurs workers parallèles
- ✅ **Monitoring** : Dashboard Bull Board
- ✅ **Fiabilité** : Jobs pas perdus (persistés Redis)

**Inconvénients** :
- ❌ **Complexité** : Redis à gérer (infrastructure)
- ❌ **Overkill V1** : Notifications simples, pas besoin queue
- ❌ **Setup** : Redis server requis
- ❌ **Coût** : Redis en prod (ou self-hosted)

**Verdict** : Rejeté pour V1, trop complexe. Reconsidérer si > 1000 notifications/jour

---

### Alternative 2 : External Scheduler (Cron OS, GitHub Actions)

**Avantages** :
- ✅ Pas de code dans app
- ✅ Séparation préoccupations

**Inconvénients** :
- ❌ **Couplage infra** : Dépend de système externe
- ❌ **Déploiement** : Configuration séparée
- ❌ **Debugging** : Plus difficile

**Verdict** : Rejeté, moins flexible

---

### Alternative 3 : node-cron (Choisi) ✅

**Architecture** :
- Job déclaré dans code
- Tourne dans même processus Node.js
- Expression cron classique

**Avantages** :
- ✅ **Simple** : Aucune infrastructure supplémentaire
- ✅ **Intégré** : Dans code, facile à tester
- ✅ **Léger** : Pas de dépendance lourde
- ✅ **Suffisant V1** : Notifications quotidiennes = 1 job simple

**Inconvénients** :
- ⚠️ **Pas de retry** : Si job échoue, attend prochaine exécution (mais acceptable pour V1)
- ⚠️ **Pas de scaling** : Un seul processus (mais suffisant pour V1)
- ⚠️ **Pas de monitoring** : Logs manuels (Winston)

**Exemple** :
```typescript
import cron from 'node-cron';

// Tourne tous les jours à 9h
cron.schedule('0 9 * * *', async () => {
  logger.info('Starting notification job...');
  try {
    await notificationService.generateNotifications();
    logger.info('Notification job completed');
  } catch (error) {
    logger.error('Notification job failed', error);
  }
});
```

## Conséquences

### Positives
- ✅ Setup rapide (pas de Redis)
- ✅ Code simple à comprendre
- ✅ Suffisant pour V1

### Négatives
- ⚠️ Pas de retry automatique (mais acceptable)
- ⚠️ Monitoring limité (logs Winston)

## Stratégie de migration

**Indicateurs pour migrer vers Bull + Redis** :
- ⚠️ > 1000 notifications/jour
- ⚠️ Besoin de retry automatique
- ⚠️ Jobs longs (> 30s)
- ⚠️ Besoin de priorité jobs

**Migration** :
1. Installer Bull + Redis
2. Créer queues
3. Migrer jobs node-cron → Bull jobs
4. Code métier inchangé (service identique)

## Implémentation

### Structure
```
backend/
├── src/
│   ├── jobs/
│   │   └── notification.job.ts
│   └── services/
│       └── notification.service.ts (logique métier)
```

### Configuration
- Expression cron : `0 9 * * *` (9h quotidien)
- Logs : Winston pour traçabilité
- Error handling : Try/catch avec logs

---

