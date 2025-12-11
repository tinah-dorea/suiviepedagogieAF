import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur en ligne sur le port ${PORT}`));
