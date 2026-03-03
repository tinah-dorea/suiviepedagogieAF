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

// Vérifier si un employé est un professeur
const isProfesseur = async (employeId) => {
  const result = await pool.query(
    'SELECT id FROM professeur WHERE id_employe = $1',
    [employeId]
  );
  return result.rows.length > 0;
};

// Obtenir les informations complémentaires d'un professeur
const getProfesseurInfo = async (employeId) => {
  const result = await pool.query(
    'SELECT id, specialite_niveaux FROM professeur WHERE id_employe = $1',
    [employeId]
  );
  return result.rows[0] || null;
};

// Connexion unifiée : employe d'abord, puis apprenant si non trouvé
export const login = async (req, res) => {
  try {
    const { email, telephone, tel, mot_passe } = req.body;
    const identifiant = email?.trim() || telephone?.trim() || tel?.trim();

    console.log('[AUTH] Tentative de connexion avec:', { email, telephone, tel, hasPassword: !!mot_passe });

    if (!identifiant || !mot_passe) {
      return res.status(400).json({ message: "Email ou téléphone et mot de passe requis" });
    }

    // 1. Chercher dans employe (email ou tel)
    const employeResult = await pool.query(
      `SELECT * FROM employe
       WHERE (email = $1 OR tel = $1) AND is_active = true`,
      [identifiant]
    );

    console.log('[AUTH] Resultat recherche employe:', employeResult.rows.length, 'trouvé(s)');

    if (employeResult.rows.length > 0) {
      const employe = employeResult.rows[0];
      console.log('[AUTH] Employé trouvé:', { id: employe.id, email: employe.email, tel: employe.tel, role: employe.role });
      
      const isValid = await bcrypt.compare(mot_passe, employe.mot_passe);
      console.log('[AUTH] Mot de passe valide:', isValid);

      if (!isValid) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Vérifier si c'est un professeur
      const professeurInfo = await isProfesseur(employe.id) ? await getProfesseurInfo(employe.id) : null;
      const baseService = roleToService(employe.role);

      console.log('[AUTH] Professeur info:', professeurInfo, 'Base service:', baseService);

      // Si l'employé est dans la table professeur, forcer le service 'professeurs'
      const service = professeurInfo ? 'professeurs' : (baseService || 'rh');

      const token = jwt.sign(
        {
          id: employe.id,
          email: employe.email,
          service,
          role: employe.role,
          isProfesseur: !!professeurInfo
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      // Construire les données utilisateur
      const userData = {
        id: employe.id,
        nom: employe.nom,
        prenom: employe.prenom,
        email: employe.email,
        tel: employe.tel,
        role: employe.role,
        service,
        isProfesseur: !!professeurInfo
      };

      // Ajouter les infos professeur si applicable
      if (professeurInfo) {
        userData.professeur = professeurInfo;
      }

      console.log('[AUTH] Connexion employé réussie, service:', service);

      return res.status(200).json({
        message: "Connexion réussie",
        token,
        employe: userData,
        user: userData // Alias pour compatibilité frontend
      });
    }

    // 2. Chercher dans apprenant (email ou tel)
    const apprenantResult = await pool.query(
      `SELECT * FROM apprenant
       WHERE (email = $1 OR tel = $1) AND statut = 'actif'`,
      [identifiant]
    );

    console.log('[AUTH] Resultat recherche apprenant:', apprenantResult.rows.length, 'trouvé(s)');

    if (apprenantResult.rows.length > 0) {
      const apprenant = apprenantResult.rows[0];
      console.log('[AUTH] Apprenant trouvé:', { id: apprenant.id, email: apprenant.email, tel: apprenant.tel });
      console.log('[AUTH] Hash mot de passe apprenant:', apprenant.mot_passe);

      // Vérifier le mot de passe hashé
      const isValid = await bcrypt.compare(mot_passe, apprenant.mot_passe);
      console.log('[AUTH] Mot de passe apprenant valide:', isValid);
      
      if (!isValid) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      const token = jwt.sign(
        { id: apprenant.id, email: apprenant.email, service: 'apprenants' },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      const userData = {
        id: apprenant.id,
        nom: apprenant.nom,
        prenom: apprenant.prenom,
        email: apprenant.email,
        tel: apprenant.tel,
        service: "apprenants",
        niveau_scolaire: apprenant.niveau_scolaire,
        etablissement: apprenant.etablissement
      };

      console.log('[AUTH] Connexion apprenant réussie');

      return res.status(200).json({
        message: "Connexion réussie",
        token,
        student: userData,
        user: userData // Alias pour compatibilité frontend
      });
    }

    console.log('[AUTH] Utilisateur non trouvé');
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  } catch (error) {
    console.error("Erreur lors de l'authentification:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Garder loginStudent pour compatibilité (redirige vers login)
export const loginStudent = login;
