import { pool } from '../config/db.js';

// GET: Statistiques pédagogiques
export const getStatistiquesPedagogiques = async (req, res) => {
  try {
    // Total des apprenants (distincts)
    const totalEtudiantsResult = await pool.query(
      'SELECT COUNT(DISTINCT id_apprenant)::int as count FROM inscription'
    );
    const totalEtudiants = totalEtudiantsResult.rows[0]?.count || 0;

    // Nombre d'apprenants en cours (inscriptions actives)
    const totalApprenantsCoursResult = await pool.query(`
      SELECT COUNT(DISTINCT i.id_apprenant)::int as count 
      FROM inscription i
      JOIN session s ON i.id_session = s.id
      WHERE s.date_debut <= CURRENT_DATE AND s.date_fin >= CURRENT_DATE
      AND i.etat_inscription IN ('inscription', 'réinscription', 'actif')
    `);
    const totalApprenantsCours = totalApprenantsCoursResult.rows[0]?.count || 0;

    // Nombre d'apprenants DALF (ceux qui ont validation_examen = true)
    const totalApprenantsDALFResult = await pool.query(`
      SELECT COUNT(DISTINCT id_apprenant)::int as count 
      FROM inscription 
      WHERE validation_examen = true
    `);
    const totalApprenantsDALF = totalApprenantsDALFResult.rows[0]?.count || 0;

    // Total des professeurs/employés avec role 'professeur' ou 'Professeur'
    const totalEnseignantsResult = await pool.query(
      "SELECT COUNT(*)::int as count FROM employe WHERE LOWER(role) LIKE '%professeur%'"
    );
    const totalEnseignants = totalEnseignantsResult.rows[0]?.count || 0;

    res.status(200).json({
      totalEtudiants,
      totalApprenantsCours,
      totalApprenantsDALF,
      totalEnseignants
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

    // Mes groupes assignés
    const mesCoursResult = await pool.query(`
      SELECT COUNT(*)::int as count
      FROM groupe g
      WHERE g.id_professeur = $1
    `, [userId]);
    const mesCours = mesCoursResult.rows[0]?.count || 0;

    // Mes étudiants (nombre d'inscriptions dans mes groupes)
    const mesEtudiantsResult = await pool.query(`
      SELECT COUNT(DISTINCT i.id)::int as count
      FROM inscription i
      JOIN groupe g ON i.id_groupe = g.id
      WHERE g.id_professeur = $1
    `, [userId]);
    const mesEtudiants = mesEtudiantsResult.rows[0]?.count || 0;

    // Taux de présence moyen
    const tauxPresenceResult = await pool.query(`
      SELECT 
        CASE 
          WHEN COUNT(p.id) = 0 THEN 0
          ELSE ROUND(
            (SUM(CASE WHEN p.est_present = true THEN 1 ELSE 0 END)::numeric * 100.0) / COUNT(p.id), 
            2
          )
        END as taux_presence
      FROM presence p
      JOIN groupe g ON p.id_groupe = g.id
      WHERE g.id_professeur = $1
    `, [userId]);
    
    const tauxPresence = parseFloat(tauxPresenceResult.rows[0]?.taux_presence || 0);

    res.status(200).json({
      mesCours,
      mesEtudiants,
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

// GET: Statistiques admin (adaptées au schéma actuel)
export const getStatistiquesAdmin = async (req, res) => {
  try {
    const totalInscriptionsResult = await pool.query('SELECT COUNT(*)::int AS count FROM inscription');
    const sessionsAVenirResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM session
       WHERE date_debut >= CURRENT_DATE`
    );

    const tauxReussiteResult = await pool.query(
      `SELECT
         CASE
           WHEN COUNT(*) FILTER (WHERE validation_examen IS NOT NULL) = 0 THEN 0
           ELSE ROUND(
             (
               COUNT(*) FILTER (
                 WHERE validation_examen = true
                    OR (validation_examen IS NULL AND note IS NOT NULL AND note >= 10)
               )::numeric
               /
               COUNT(*) FILTER (
                 WHERE validation_examen IS NOT NULL
                    OR note IS NOT NULL
               )::numeric
             ) * 100, 2
           )
         END AS taux
       FROM inscription`
    );

    const dayMap = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const today = dayMap[new Date().getDay()];

    const coursDuJourResult = await pool.query(
      `SELECT COUNT(DISTINCT c.id)::int AS count
       FROM creneau c
       INNER JOIN groupe g ON g.id_creneau = c.id
       INNER JOIN inscription i ON i.id_groupe = g.id
       INNER JOIN session s ON s.id = i.id_session
       WHERE c.jour_semaine @> ARRAY[$1]::varchar[]
         AND s.date_debut <= CURRENT_DATE
         AND s.date_fin >= CURRENT_DATE`,
      [today]
    );

    res.status(200).json({
      totalInscriptions: totalInscriptionsResult.rows[0]?.count || 0,
      sessionsAVenir: sessionsAVenirResult.rows[0]?.count || 0,
      tauxReussite: Number(tauxReussiteResult.rows[0]?.taux || 0),
      coursDuJour: coursDuJourResult.rows[0]?.count || 0
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques admin:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques admin',
      error: error.message
    });
  }
};