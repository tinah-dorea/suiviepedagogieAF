import { pool } from '../config/db.js';

// GET: Statistiques pédagogiques
export const getStatistiquesPedagogiques = async (req, res) => {
  try {
    // Total des étudiants (inscriptions)
    const totalEtudiantsResult = await pool.query(
      'SELECT COUNT(*) as count FROM inscription'
    );
    const totalEtudiants = parseInt(totalEtudiantsResult.rows[0].count);

    // Apprenants inscrits aux cours (id_type_service = 1)
    const totalApprenantsCoursResult = await pool.query(`
      SELECT COUNT(DISTINCT i.id) as count 
      FROM inscription i
      JOIN creneau c ON i.id_creneau = c.id
      JOIN session_cours sc ON c.id_session_cours = sc.id
      JOIN type_cours tc ON sc.id_type_cours = tc.id
      WHERE tc.id_type_service = 1
    `);
    const totalApprenantsCours = parseInt(totalApprenantsCoursResult.rows[0].count);

    // Apprenants inscrits au DALF (id_type_service = 2)
    const totalApprenantsDALFResult = await pool.query(`
      SELECT COUNT(DISTINCT i.id) as count 
      FROM inscription i
      JOIN creneau c ON i.id_creneau = c.id
      JOIN session_cours sc ON c.id_session_cours = sc.id
      JOIN type_cours tc ON sc.id_type_cours = tc.id
      WHERE tc.id_type_service = 2
    `);
    const totalApprenantsDALF = parseInt(totalApprenantsDALFResult.rows[0].count);

    // Total des enseignants
    const totalEnseignantsResult = await pool.query(
      "SELECT COUNT(*) as count FROM employe WHERE service = 'Professeurs'"
    );
    const totalEnseignants = parseInt(totalEnseignantsResult.rows[0].count);

    // Cours du jour
    const coursDuJourResult = await pool.query(`
      SELECT 
        c.jour_semaine,
        c.heure_debut,
        c.heure_fin,
        tc.nom_type_cours,
        n.nom_niveau,
        g.numero_groupe,
        e.nom,
        e.prenom,
        s.nom_salle
      FROM creneau c
      JOIN session_cours sc ON c.id_session_cours = sc.id
      JOIN type_cours tc ON sc.id_type_cours = tc.id
      JOIN niveau n ON sc.id_niveau = n.id
      JOIN groupe g ON g.id_creneau = c.id
      JOIN employe e ON g.id_employe_prof = e.id
      JOIN affectation_salle as_a ON as_a.id_groupe = g.id
      JOIN salle s ON as_a.id_salle = s.id
      WHERE as_a.date_cours = CURRENT_DATE
      ORDER BY c.heure_debut
    `);
    const coursDuJour = coursDuJourResult.rows;

    res.status(200).json({
      totalEtudiants,
      totalApprenantsCours,
      totalApprenantsDALF,
      totalEnseignants,
      coursDuJour
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques pédagogiques:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des statistiques pédagogiques",
      error: error.message
    });
  }
};

// GET: Statistiques pour les professeurs
export const getStatistiquesProfesseur = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur connecté à partir du token
    const userId = req.user.id;

    // Mes cours (nombre de groupes assignés)
    const mesCoursResult = await pool.query(`
      SELECT COUNT(DISTINCT g.id) as count
      FROM groupe g
      WHERE g.id_employe_prof = $1
    `, [userId]);
    const mesCours = parseInt(mesCoursResult.rows[0].count);

    // Mes étudiants (nombre d'étudiants dans mes groupes)
    const mesEtudiantsResult = await pool.query(`
      SELECT COUNT(DISTINCT i.id) as count
      FROM inscription i
      JOIN creneau c ON i.id_creneau = c.id
      JOIN groupe g ON c.id = g.id_creneau
      WHERE g.id_employe_prof = $1
    `, [userId]);
    const mesEtudiants = parseInt(mesEtudiantsResult.rows[0].count);

    // Mes examens (nombre d'examens liés à mes groupes)
    const mesExamensResult = await pool.query(`
      SELECT COUNT(DISTINCT e.id) as count
      FROM examen e
      JOIN inscription i ON e.id_inscription = i.id
      JOIN creneau c ON i.id_creneau = c.id
      JOIN groupe g ON c.id = g.id_creneau
      WHERE g.id_employe_prof = $1
    `, [userId]);
    const mesExamens = parseInt(mesExamensResult.rows[0].count);

    // Taux de présence moyen - calculating based on the ratio of present records to total records
    const tauxPresenceResult = await pool.query(`
      SELECT 
        CASE 
          WHEN COUNT(p.id) = 0 THEN 0
          ELSE ROUND(
            (SUM(CASE WHEN p.est_present = true THEN 1 ELSE 0 END) * 100.0) / COUNT(p.id), 
            2
          )
        END as taux_presence
      FROM presence p
      JOIN inscription i ON p.id_inscription = i.id
      JOIN creneau c ON i.id_creneau = c.id
      JOIN groupe g ON c.id = g.id_creneau
      WHERE g.id_employe_prof = $1
    `, [userId]);
    
    const tauxPresence = parseFloat(tauxPresenceResult.rows[0].taux_presence) || 0;

    res.status(200).json({
      mesCours,
      mesEtudiants,
      mesExamens,
      tauxPresence: `${tauxPresence}%`
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques professeur:", error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des statistiques professeur",
      error: error.message
    });
  }
};