import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../config/db.js';

dotenv.config();

// Convertir le rôle employe en service pour la redirection
const roleToService = (role) => {
  if (!role) return null;
  const r = String(role).toLowerCase().trim();
  if (['admin', 'rh', 'ressources humaines'].some(k => r.includes(k))) return 'rh';
  if (['pedagogie', 'pédagogie', 'coordination', 'coordinateur'].some(k => r.includes(k))) return 'pedagogie';
  if (['professeur', 'professeurs'].some(k => r.includes(k))) return 'professeurs';
  if (r.includes('accueil')) return 'accueil';
  return null;
};

// Connexion unifiée : employe d'abord, puis apprenant si non trouvé
export const login = async (req, res) => {
  try {
    const { email, telephone, tel, mot_passe } = req.body;
    const identifiant = email?.trim() || telephone?.trim() || tel?.trim();

    if (!identifiant || !mot_passe) {
      return res.status(400).json({ message: "Email ou téléphone et mot de passe requis" });
    }

    // 1. Chercher dans employe (email ou tel)
    const employeResult = await pool.query(
      `SELECT * FROM employe 
       WHERE (email = $1 OR tel = $1) AND is_active = true`,
      [identifiant]
    );

    if (employeResult.rows.length > 0) {
      const employe = employeResult.rows[0];
      const isValid = await bcrypt.compare(mot_passe, employe.mot_passe);
      if (!isValid) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      const service = roleToService(employe.role) || 'rh';
      const token = jwt.sign(
        { id: employe.id, email: employe.email, service },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.status(200).json({
        message: "Connexion réussie",
        token,
        employe: {
          id: employe.id,
          nom: employe.nom,
          prenom: employe.prenom,
          email: employe.email,
          tel: employe.tel,
          role: employe.role,
          service
        }
      });
    }

    // 2. Chercher dans apprenant (email ou tel)
    const apprenantResult = await pool.query(
      `SELECT * FROM apprenant 
       WHERE (email = $1 OR tel = $1) AND statut = 'actif'`,
      [identifiant]
    );

    if (apprenantResult.rows.length > 0) {
      const apprenant = apprenantResult.rows[0];
      // Pour les apprenants : mot de passe par défaut = 123456
      if (mot_passe !== '123456') {
        return res.status(401).json({ message: "Mot de passe incorrect. Mot de passe apprenant par défaut: 123456" });
      }

      const token = jwt.sign(
        { id: apprenant.id, email: apprenant.email, service: 'apprenants' },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.status(200).json({
        message: "Connexion réussie",
        token,
        student: {
          id: apprenant.id,
          nom: apprenant.nom,
          prenom: apprenant.prenom,
          email: apprenant.email,
          tel: apprenant.tel,
          service: "apprenants",
          niveau_scolaire: apprenant.niveau_scolaire,
          etablissement: apprenant.etablissement
        }
      });
    }

    return res.status(404).json({ message: "Utilisateur non trouvé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Garder loginStudent pour compatibilité (redirige vers login)
export const loginStudent = login;
