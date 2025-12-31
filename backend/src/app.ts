import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Route de santé (health check)
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Contract Management API is running' });
});

// Route de test
app.get('/api/test', (_req: Request, res: Response) => {
  res.json({ message: 'Backend API is working!' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});

export default app;



