import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import employeRoutes from './src/routes/employeRoutes.js';
// import roleRoutes from './src/routes/roleRoutes.js'; // Table role supprimée
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
// Suppression de la ligne pour sessionCoursRoutes car la table n'existe plus
import statistiqueRoutes from './src/routes/statistiqueRoutes.js';
import testNiveauRoutes from './src/routes/testNiveauRoutes.js';
import presenceRoutes from './src/routes/presenceRoutes.js';
import groupeRoutes from './src/routes/groupeRoutes.js';
import creneauRoutes from './src/routes/creneauRoutes.js';  // Ajout de la route creneau
import professeurRoutes from './src/routes/professeurRoutes.js'; // Importer la route des professeurs
import aProposRoutes from './src/routes/aProposRoutes.js'; // Importer la route des informations à propos
import joursFeriesRoutes from './src/routes/joursFeriesRoutes.js'; // Importer la route des jours fériés
import consultationRoutes from './src/routes/consultationRoutes.js'; // Consultation publique des cours

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employes', employeRoutes);
// app.use('/api/roles', roleRoutes); // Table role supprimée
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
// Suppression de la route /api/session-cours car la table n'existe plus
app.use('/api/statistiques', statistiqueRoutes);
app.use('/api/test-niveaux', testNiveauRoutes);
app.use('/api/presences', presenceRoutes);
app.use('/api/groupes', groupeRoutes);
app.use('/api/creneaux', creneauRoutes); // Ajout de la route creneau
app.use('/api/professeurs', professeurRoutes); // Ajouter la route des professeurs
app.use('/api/a-propos', aProposRoutes); // Ajouter la route des informations à propos
app.use('/api/jours-feries', joursFeriesRoutes); // Ajouter la route des jours fériés
app.use('/api/consultation', consultationRoutes); // Consultation publique des cours

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});