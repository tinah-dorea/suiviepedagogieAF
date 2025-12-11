import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../config/db.js';

dotenv.config();

export const login = async (req, res) => {
  try {
    console.log(req.body)
    const { email, mot_passe } = req.body;

    if (!email || !mot_passe) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    console.log('Email reçu:', email);
    const result = await pool.query('SELECT * FROM employe WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const employe = result.rows[0];
    console.log('Données employé trouvées:', employe);

    // Comparaison du mot de passe
    const isValid = await bcrypt.compare(mot_passe, employe.mot_passe);
    if (!isValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Conversion des IDs en nombres
    const userId = parseInt(employe.id);
    const roleId = parseInt(employe.id_role);

    if (isNaN(userId) || isNaN(roleId)) {
      return res.status(500).json({ message: "Erreur lors de la récupération des données utilisateur" });
    }

    // Génération du token avec les IDs numériques
    const token = jwt.sign(
      { 
        id: userId, 
        email: employe.email, 
        role: roleId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    const responseData = {
      message: "Connexion réussie",
      token,
      employe: {
        id: userId,
        nom: employe.nom,
        prenom: employe.prenom,
        email: employe.email,
        role: roleId,
        service: employe.service
      }
    };
    
    console.log('Données envoyées au client:', responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
