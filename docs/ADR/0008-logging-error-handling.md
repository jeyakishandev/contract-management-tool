# ADR 0008 : Logging & Error Handling

**Statut** : ✅ Accepté  
**Date** : 2024-01-XX  
**Décideurs** : Lead Dev  
**Contexte** : Stratégie de logging et gestion d'erreurs pour production

## Décision

**Logging** : Winston (structuré) + Morgan (HTTP)  
**Error Handling** : Classes d'erreurs custom + Middleware global

## Logging

### Alternative 1 : console.log uniquement

**Inconvénients** :
- ❌ Pas structuré (difficile à parser)
- ❌ Pas de niveaux (info/warn/error)
- ❌ Pas de transport (fichier, service externe)

**Verdict** : Rejeté, inadapté production

---

### Alternative 2 : Winston (Choisi) ✅

**Avantages** :
- ✅ **Structuré** : Logs JSON (parsing facile)
- ✅ **Niveaux** : error, warn, info, debug
- ✅ **Transports** : Console (dev), File (prod), service externe (future)
- ✅ **Format** : JSON en prod, pretty en dev
- ✅ **Performance** : Async logging

**Configuration** :
```typescript
// Dev : Pretty console
logger.info('User logged in', { userId: 1 });

// Prod : JSON structuré
{"level":"info","message":"User logged in","userId":1,"timestamp":"2024-01-20T10:30:00Z"}
```

**Morgan (HTTP logging)** :
- Logs toutes requêtes HTTP
- Format combinable : `combined`, `dev`, `tiny`
- Intégré Express middleware

## Error Handling

### Stratégie : Classes d'erreurs custom + Middleware

**Classes d'erreurs** :
```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

class UnauthorizedError extends AppError {
  constructor() {
    super(401, 'Unauthorized');
  }
}

class ForbiddenError extends AppError {
  constructor() {
    super(403, 'Forbidden');
  }
}
```

**Middleware global** :
```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log erreur
  logger.error(err.message, {
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Erreur opérationnelle (attendue) : retourner message
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  // Erreur inattendue : ne pas exposer détails
  res.status(500).json({
    error: 'Internal server error'
  });
});
```

## Conséquences

### Positives
- ✅ Logs structurés (parsing/monitoring facile)
- ✅ Erreurs typées et cohérentes
- ✅ Sécurité (pas de stack trace exposée en prod)
- ✅ Debugging facilité (contexte dans logs)

### Négatives
- ⚠️ Abstraction supplémentaire (mais bénéfique)

## Implémentation

### Structure
```
backend/
├── src/
│   ├── utils/
│   │   ├── logger.ts (Winston config)
│   │   └── errors.ts (Classes erreurs)
│   └── middleware/
│       └── error.middleware.ts (Handler global)
```

### Niveaux de log
- **error** : Erreurs critiques (500, exceptions)
- **warn** : Avertissements (validation, permissions)
- **info** : Informations (login, création ressource)
- **debug** : Détails (dev uniquement)

### Production
- Logs en fichiers : `logs/app.log`, `logs/error.log`
- Rotation : Winston-daily-rotate-file
- Monitoring : Intégration Sentry/DataDog possible (future)

---

