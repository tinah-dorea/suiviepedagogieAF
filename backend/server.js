import express from "express";
import pool from "./src/config/db.js";
import typeServiceRoutes from "./src/routes/typeService.routes.js";
import typeCoursRoutes from './src/routes/typeCours.routes.js';
import niveauRoutes from './src/routes/niveau.routes.js';
import categorieRoutes from "./src/routes/categorie.routes.js";
import roleRoutes from './src/routes/role.routes.js';
import activiteRoutes from './src/routes/activite.routes.js';
import horaireRoutes from './src/routes/horaire.routes.js';
import sessionRoutes from './src/routes/session.routes.js';
import roleActiviteRoutes from './src/routes/roleActivite.routes.js';
import inscriptionRoutes from './src/routes/inscription.routes.js';
import employeRoutes from './src/routes/employe.routes.js';

const app = express();
app.use(express.json());

// ✅ Montage des routes API
app.use("/api/type-services", typeServiceRoutes);
app.use('/api/type-cours', typeCoursRoutes);
app.use('/api/niveaux', niveauRoutes);
app.use("/api/categories", categorieRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/activites', activiteRoutes);
app.use('/api/horaires', horaireRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/role-activites', roleActiviteRoutes);
app.use('/api/inscriptions', inscriptionRoutes);
app.use('/api/employes', employeRoutes);

// Gestion des routes non trouvées (optionnel mais recommandé)
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

app.listen(5000, () => console.log("🚀 Serveur lancé sur le port 5000"));
