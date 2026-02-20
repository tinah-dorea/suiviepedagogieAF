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
// Suppression de la ligne pour sessionCoursRoutes car la table n'existe plus
import groupeRoutes from './src/routes/groupeRoutes.js';
import creneauRoutes from './src/routes/creneauRoutes.js';
import affectationSalleRoutes from './src/routes/affectationSalleRoutes.js';
import presenceRoutes from './src/routes/presenceRoutes.js';
import testNiveauRoutes from './src/routes/testNiveauRoutes.js';
import motivationRoutes from './src/routes/motivationRoutes.js';
import { authenticateToken } from './src/middlewares/authMiddleware.js';
import statistiqueRoutes from './src/routes/statistiqueRoutes.js'; // Importer la route des statistiques
import professeurRoutes from './src/routes/professeurRoutes.js'; // Importer la route des professeurs
import aProposRoutes from './src/routes/aProposRoutes.js'; // Importer la route des informations à propos
import joursFeriesRoutes from './src/routes/joursFeriesRoutes.js'; // Importer la route des jours fériés
import consultationRoutes from './src/routes/consultationRoutes.js'; // Consultation publique des cours

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
// Suppression de la route /api/session-cours car la table n'existe plus
app.use('/api/groupes', groupeRoutes);
app.use('/api/creneaux', creneauRoutes);
app.use('/api/affectation-salles', affectationSalleRoutes);
app.use('/api/presences', presenceRoutes);
app.use('/api/test-niveaux', testNiveauRoutes);
app.use('/api/motivations', motivationRoutes);
app.use('/api/statistiques', statistiqueRoutes); // Ajouter la route des statistiques
app.use('/api/professeurs', professeurRoutes); // Ajouter la route des professeurs
app.use('/api/a-propos', aProposRoutes); // Ajouter la route des informations à propos
app.use('/api/jours-feries', joursFeriesRoutes); // Ajouter la route des jours fériés
app.use('/api/consultation', consultationRoutes); // Consultation publique des cours

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