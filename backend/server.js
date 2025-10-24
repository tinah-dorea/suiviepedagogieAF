import express from "express";
import pool from "./src/config/db.js";

const app = express();
app.use(express.json());

// Exemple route pour tester la connexion
app.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Connexion réussie ✅", time: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(5000, () => console.log("🚀 Serveur lancé sur le port 5000"));
