import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import employeRoutes from './src/routes/employeRoutes.js';
import typeServiceRoutes from './src/routes/typeServiceRoutes.js';
import typeCoursRoutes from './src/routes/typeCoursRoutes.js';
import categorieRoutes from './src/routes/categorieRoutes.js';
import niveauRoutes from './src/routes/niveauRoutes.js';
import horaireRoutes from './src/routes/horaireRoutes.js';
import sessionRoutes from './src/routes/sessionRoutes.js';
import inscriptionRoutes from './src/routes/inscriptionRoutes.js';
import examenRoutes from './src/routes/examenRoutes.js';
import salleRoutes from './src/routes/salleRoutes.js';
import affectationSalleRoutes from './src/routes/affectationSalleRoutes.js';
import statistiqueRoutes from './src/routes/statistiqueRoutes.js';
import testNiveauRoutes from './src/routes/testNiveauRoutes.js';
import presenceRoutes from './src/routes/presenceRoutes.js';
import groupeRoutes from './src/routes/groupeRoutes.js';
import creneauRoutes from './src/routes/creneauRoutes.js';
import professeurRoutes from './src/routes/professeurRoutes.js';
import aProposRoutes from './src/routes/aProposRoutes.js';
import joursFeriesRoutes from './src/routes/joursFeriesRoutes.js';
import consultationRoutes from './src/routes/consultationRoutes.js';
import motivationRoutes from './src/routes/motivationRoutes.js';
import apprenantRoutes from './src/routes/apprenantRoutes.js';
import roleRoutes from './src/routes/roleRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employes', employeRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/type-services', typeServiceRoutes);
app.use('/api/type-cours', typeCoursRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/niveaux', niveauRoutes);
app.use('/api/horaires', horaireRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/inscriptions', inscriptionRoutes);
app.use('/api/examens', examenRoutes);
app.use('/api/salles', salleRoutes);
app.use('/api/affectation-salles', affectationSalleRoutes);
app.use('/api/statistiques', statistiqueRoutes);
app.use('/api/test-niveaux', testNiveauRoutes);
app.use('/api/presences', presenceRoutes);
app.use('/api/groupes', groupeRoutes);
app.use('/api/creneaux', creneauRoutes);
app.use('/api/professeurs', professeurRoutes);
app.use('/api/a-propos', aProposRoutes);
app.use('/api/jours-feries', joursFeriesRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/motivations', motivationRoutes);
app.use('/api/apprenants', apprenantRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});