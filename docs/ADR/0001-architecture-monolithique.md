# ADR 0001 : Architecture Monolithique Modulaire

**Statut** : ✅ Accepté  
**Date** : 2024-01-XX  
**Décideurs** : Lead Dev  
**Contexte** : Choix de l'architecture générale pour le projet "Contract & Obligation Management Tool"

## Contexte

Le projet doit être un outil interne pour PME, avec un périmètre fonctionnel clair (V1) mais évolutif. Les contraintes sont :
- Budget limité
- Équipe réduite (1-3 devs)
- Time-to-market rapide
- Maintenabilité à long terme
- Pas de sur-architecture

## Décision

Choisir une **architecture monolithique modulaire** avec séparation claire des couches :
- Frontend (Next.js) + Backend (Express) + Database (PostgreSQL)
- Communication via REST API
- Pas de microservices, pas de message broker (Kafka, RabbitMQ)

## Alternatives considérées

### Alternative 1 : Microservices
- ❌ **Pourquoi rejeté** : Complexité opérationnelle (déploiement, monitoring, réseau), sur-ingénierie pour un outil interne PME
- ✅ **Avantages** : Scalabilité indépendante, isolation des erreurs
- ❌ **Inconvénients** : Overhead de communication, debugging complexe, infrastructure lourde

### Alternative 2 : Serverless (AWS Lambda, Vercel Functions)
- ❌ **Pourquoi rejeté** : Cold starts, complexité des jobs planifiés, coûts variables, vendor lock-in
- ✅ **Avantages** : Scalabilité automatique, pas de gestion serveur
- ❌ **Inconvénients** : Durée max d'exécution, gestion état difficile, jobs cron complexes

### Alternative 3 : Monolithique avec queue (Bull + Redis)
- ⚠️ **Pourquoi pas maintenant** : Complexité supplémentaire (Redis à gérer), pas nécessaire pour V1
- ✅ **Avantages** : Traitement asynchrone robuste
- ❌ **Inconvénients** : Infrastructure supplémentaire, overkill pour notifications simples

## Conséquences

### Positives
- ✅ Développement rapide et simple
- ✅ Débogage facilité (tout dans le même repo)
- ✅ Déploiement simple (1 container ou 1 serveur)
- ✅ Tests d'intégration plus faciles
- ✅ Communication inter-modules directe (pas de réseau)

### Négatives
- ⚠️ Scalabilité verticale uniquement (mais suffisant pour PME)
- ⚠️ Si un module plante, tout plante (mais erreurs bien gérées)
- ⚠️ Refactoring vers microservices plus tard si besoin (acceptable, on crossera ce pont si nécessaire)

## Implémentation

- Backend : Express.js avec modules séparés (routes, services, repositories)
- Frontend : Next.js avec App Router
- Communication : REST API JSON
- Jobs : node-cron (jobs planifiés simples) → migration vers queue si volumétrie augmente

## Notes

Si le projet grossit (1000+ utilisateurs simultanés, milliers de contrats), on pourra évoluer vers :
- Monolithique modulaire avec queue (Bull + Redis) pour les jobs
- Puis microservices seulement si vraiment nécessaire (très peu probable pour un outil interne PME)

