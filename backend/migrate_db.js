import { pool } from './src/config/db.js';

async function migrateDatabase() {
  try {
    console.log('Démarrage de la migration de la base de données...');

    // Vérifier si la table horaire_cours existe bien
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'horaire_cours'
      ) AS table_exists;
    `;
    
    const tableExists = await pool.query(checkTableQuery);
    if (!tableExists.rows[0].table_exists) {
      console.error('ERREUR: La table horaire_cours n\'existe pas dans la base de données');
      console.log('La base de données ne correspond pas à la structure attendue.');
      return;
    }

    // Vérifier si la table session_cours existe encore
    const checkOldTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'session_cours'
      ) AS table_exists;
    `;
    
    const oldTableExists = await pool.query(checkOldTableQuery);
    if (oldTableExists.rows[0].table_exists) {
      console.log('ATTENTION: La table session_cours existe toujours mais n\'est plus utilisée.');
      console.log('Vous devriez envisager de la supprimer manuellement si vous êtes sûr de ne plus en avoir besoin.');
    }

    // Vérifier si les colonnes attendues existent dans la table creneau
    const checkCreneauColumns = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'creneau' 
      AND column_name IN ('id_horaire_cours', 'id_session_cours');
    `;
    
    const creneauCols = await pool.query(checkCreneauColumns);
    const colNames = creneauCols.rows.map(row => row.column_name);
    
    if (colNames.includes('id_session_cours') && !colNames.includes('id_horaire_cours')) {
      console.error('ERREUR: La colonne id_session_cours existe mais id_horaire_cours n\'existe pas dans la table creneau');
      console.log('La structure de la base de données ne correspond pas à celle attendue par le code.');
      return;
    } else if (colNames.includes('id_session_cours') && colNames.includes('id_horaire_cours')) {
      console.log('INFO: Les deux colonnes id_session_cours et id_horaire_cours existent dans la table creneau');
      console.log('Vous devriez envisager de supprimer la colonne id_session_cours si vous êtes sûr de ne plus en avoir besoin.');
    } else if (!colNames.includes('id_horaire_cours')) {
      console.error('ERREUR: La colonne id_horaire_cours n\'existe pas dans la table creneau');
      console.log('La structure de la base de données ne correspond pas à celle attendue par le code.');
      return;
    }

    // Vérifier si la colonne duree_cours existe dans la table session
    const checkDureeCoursCol = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'session' 
      AND column_name = 'duree_cours';
    `;
    
    const dureeCoursCol = await pool.query(checkDureeCoursCol);
    if (dureeCoursCol.rows.length === 0) {
      console.log('INFO: La colonne duree_cours n\'existe pas dans la table session, nous allons la créer...');
      
      const addDureeCoursCol = `
        ALTER TABLE session 
        ADD COLUMN duree_cours INTEGER DEFAULT 0;
      `;
      
      await pool.query(addDureeCoursCol);
      console.log('Colonne duree_cours ajoutée à la table session avec succès.');
    } else {
      console.log('INFO: La colonne duree_cours existe déjà dans la table session.');
    }

    // Vérifier si la colonne id_niveau est un array dans la table horaire_cours
    const checkIdNiveauArray = `
      SELECT data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'horaire_cours' 
      AND column_name = 'id_niveau';
    `;
    
    const idNiveauInfo = await pool.query(checkIdNiveauArray);
    if (idNiveauInfo.rows.length > 0) {
      if (idNiveauInfo.rows[0].data_type !== 'ARRAY' && idNiveauInfo.rows[0].udt_name !== '_int4') {
        console.log('ATTENTION: La colonne id_niveau dans la table horaire_cours n\'est pas un tableau comme prévu.');
        console.log('Selon la structure de la base de données, elle devrait être de type integer[].');
      } else {
        console.log('INFO: La colonne id_niveau dans la table horaire_cours est bien un tableau comme prévu.');
      }
    }

    console.log('Migration de la base de données terminée avec succès!');
    console.log('Assurez-vous que votre backend est aligné avec la structure actuelle de la base de données.');

  } catch (error) {
    console.error('Erreur lors de la migration de la base de données:', error);
  } finally {
    await pool.end();
  }
}

// Exécuter la migration
migrateDatabase();