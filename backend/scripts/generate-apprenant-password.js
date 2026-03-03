// Script pour générer le hash bcrypt du mot de passe par défaut des apprenants
// Exécuter avec: node scripts/generate-apprenant-password.js

import bcrypt from 'bcrypt';

const DEFAULT_PASSWORD = '12345678';
const SALT_ROUNDS = 10;

async function generatePasswordHash() {
  try {
    const hash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    console.log('=== Hash bcrypt pour mot de passe apprenant ===\n');
    console.log(`Mot de passe: ${DEFAULT_PASSWORD}`);
    console.log(`Hash généré: ${hash}\n`);
    console.log('=== Instructions ===');
    console.log('1. Copiez le hash généré ci-dessus');
    console.log('2. Exécutez la commande SQL suivante dans votre base de données:\n');
    console.log(`UPDATE public.apprenant SET mot_passe = '${hash}' WHERE mot_passe IS NULL;`);
    console.log('\n3. Pour mettre à jour le script de migration, remplacez la ligne UPDATE dans migration_auth.sql');
  } catch (error) {
    console.error('Erreur lors de la génération du hash:', error);
  }
}

generatePasswordHash();
