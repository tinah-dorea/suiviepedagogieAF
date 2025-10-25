import express from 'express';
import cors from 'cors';
import typeServiceRoutes from './routes/typeService.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

import typeServiceRoutes from "./src/routes/typeService.routes.js";
app.use("/api/type-services", typeServiceRoutes);

// Routes
app.use('/api/type-services', typeServiceRoutes);

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

export default app;