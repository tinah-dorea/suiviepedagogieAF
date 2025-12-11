import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import employeRoutes from './src/routes/employeRoutes.js';
import typeServiceRoutes from './src/routes/typeServiceRoutes.js';
import typeCoursRoutes from './src/routes/typeCoursRoutes.js';
import niveauRoutes from './src/routes/niveauRoutes.js';
import categorieRoutes from './src/routes/categorieRoutes.js';
import horaireRoutes from './src/routes/horaireRoutes.js';
import sessionRoutes from './src/routes/sessionRoutes.js';
import inscriptionRoutes from './src/routes/inscriptionRoutes.js';
import examenRoutes from './src/routes/examenRoutes.js';
import salleRoutes from './src/routes/salleRoutes.js';
import roleRoutes from './src/routes/roleRoutes.js';
import { authenticateToken } from './src/middlewares/authMiddleware.js';

const app = express();

// Configuration CORS plus détaillée
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Autoriser les deux ports
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // Cache les résultats de preflight pendant 24 heures
}));

// Parser pour JSON avec limite de taille
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employes', employeRoutes);
app.use('/api/type-services', typeServiceRoutes);
app.use('/api/type-cours', typeCoursRoutes);
app.use('/api/niveaux', niveauRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/horaires', horaireRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/inscriptions', inscriptionRoutes);
app.use('/api/examens', examenRoutes);
app.use('/api/salles', salleRoutes);
app.use('/api/roles', roleRoutes);

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ 
    message: "La ressource demandée n'existe pas",
    path: req.path
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Une erreur inattendue s'est produite",
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;
