# ADR 0005 : Authentification (JWT vs Session)

**Statut** : ✅ Accepté  
**Date** : 2024-01-XX  
**Décideurs** : Lead Dev  
**Contexte** : Choix du mécanisme d'authentification pour API REST

## Décision

Choisir **JWT (JSON Web Tokens)** avec **access token (15min)** + **refresh token (7j)**.

## Alternatives considérées

### Alternative 1 : Sessions (Cookie-based)

**Architecture** :
- Session stockée en DB (ou Redis)
- Cookie httpOnly avec session ID
- Serveur vérifie session à chaque requête

**Avantages** :
- ✅ Révocation immédiate possible (supprimer session)
- ✅ Contrôle côté serveur (déconnexion forcée)
- ✅ Pas de token à gérer côté client

**Inconvénients** :
- ❌ **Stockage serveur** : DB ou Redis nécessaire (complexité)
- ❌ **Non stateless** : Serveur doit garder état
- ❌ **Scalabilité** : Partage sessions entre instances (Redis requis)
- ❌ **CORS** : Cookies nécessitent configuration stricte
- ❌ **Mobile/SPA** : Moins adapté (cookies moins fiables)

**Verdict** : Rejeté, nécessite Redis/session store, moins scalable

---

### Alternative 2 : OAuth 2.0 / OpenID Connect

**Avantages** :
- ✅ Standard industrie (Google, GitHub, etc.)
- ✅ SSO possible
- ✅ Délégation authentification (provider externe)

**Inconvénients** :
- ❌ **Complexité** : Setup OAuth provider, flows complexes
- ❌ **Overkill V1** : Pas de besoin SSO pour outil interne
- ❌ **Dépendance externe** : Provider OAuth requis
- ❌ **Temps setup** : Plus long à implémenter

**Verdict** : Rejeté, trop complexe pour V1 (peut être ajouté plus tard)

---

### Alternative 3 : JWT (Choisi) ✅

**Architecture** :
- **Access token** : JWT signé, expire 15min, contient user ID + role
- **Refresh token** : JWT signé, expire 7j, stocké en DB (pour révoquer)
- Client stocke tokens (localStorage ou cookie httpOnly)
- Client envoie access token dans header `Authorization: Bearer <token>`
- Si access token expiré, utiliser refresh token pour en obtenir un nouveau

**Avantages** :
- ✅ **Stateless** : Pas de stockage serveur (sauf refresh tokens révoqués)
- ✅ **Scalable** : Pas besoin de partager état entre instances
- ✅ **Mobile/SPA friendly** : Tokens fonctionnent partout
- ✅ **Standard** : JWT largement supporté
- ✅ **Performance** : Pas de DB lookup à chaque requête (vérification signature)

**Inconvénients** :
- ⚠️ **Révocation limitée** : Access token valide jusqu'à expiration (mais 15min court)
- ⚠️ **Taille** : Tokens plus gros que session ID (mais négligeable)
- ⚠️ **Refresh token DB** : Nécessite table pour révoquer (acceptable)

**Stratégie de révocabilité** :
- Refresh tokens stockés en DB avec flag `revoked`
- Access tokens non révocables (mais expirent rapidement : 15min)
- En cas de compromission : révoquer refresh token → access token expire dans 15min max

**Exemple de flow** :
```
1. POST /api/auth/login → { accessToken, refreshToken }
2. Client stocke tokens
3. Requêtes API : Header Authorization: Bearer <accessToken>
4. Si accessToken expiré → POST /api/auth/refresh avec refreshToken
5. Nouveau accessToken généré
```

## Conséquences

### Positives
- ✅ API stateless = facilement scalable
- ✅ Pas de Redis/session store nécessaire
- ✅ Compatible mobile/web/SPA
- ✅ Performance (pas de DB lookup par requête)

### Négatives
- ⚠️ Révocation access token limitée (mais expiration courte limite le risque)
- ⚠️ Refresh token en DB (mais table simple)

## Migration future

Si besoin de révocation immédiate, on peut :
1. Réduire expiration access token (5min au lieu de 15min)
2. Blacklist tokens révoqués (table simple + TTL)
3. Passer à sessions + Redis (si vraiment nécessaire)

## Implémentation

- **Bibliothèque** : `jsonwebtoken`
- **Access token** : Expire 15min, contient `{ userId, role }`
- **Refresh token** : Expire 7j, stocké en DB (table `refresh_tokens`)
- **Stockage client** : localStorage (ou cookie httpOnly si XSS préoccupation)
- **Middleware** : `requireAuth()` vérifie signature + expiration

---

