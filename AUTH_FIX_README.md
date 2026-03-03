# Correction de l'Authentification - Professeurs et Apprenants

## Problèmes identifiés

1. **Table `apprenant`** : Aucun champ `mot_passe` n'existait dans la table
2. **Authentification des professeurs** : Basée uniquement sur le rôle dans la table `employe`, sans vérification de la table `professeur`
3. **Sécurité** : Mot de passe en clair pour les apprenants (comparaison directe)

## Solution implémentée

### 1. Migration de la base de données

Exécutez le fichier de migration pour ajouter la colonne `mot_passe` à la table `apprenant` :

```bash
psql -U postgres -d suivie_pedagogique_af -f migration_auth.sql
```

Ou manuellement dans pgAdmin :
```sql
-- Ajouter la colonne mot_passe
ALTER TABLE public.apprenant 
ADD COLUMN mot_passe character varying(255);

-- Générer un hash bcrypt pour '12345678' (à faire avec le script Node.js)
-- Voir section "Génération du hash bcrypt" ci-dessous

-- Mettre à jour les apprenants existants
UPDATE public.apprenant 
SET mot_passe = '<HASH_BCRYPT_GENERE>'
WHERE mot_passe IS NULL;

-- Rendre la colonne obligatoire
ALTER TABLE public.apprenant 
ALTER COLUMN mot_passe SET NOT NULL;
```

### 2. Génération du hash bcrypt

Le backend utilise bcrypt pour hacher les mots de passe. Pour générer le hash du mot de passe par défaut des apprenants :

```bash
cd backend
node scripts/generate-apprenant-password.js
```

Cela générera un hash bcrypt que vous pourrez utiliser dans la commande SQL ci-dessus.

### 3. Modifications du backend

**Fichier : `backend/src/controllers/authController.js`**

Changements principaux :
- **Professeurs** : Vérification automatique si un employé est dans la table `professeur` et attribution du service `professeurs`
- **Apprenants** : Authentification par hash bcrypt au lieu d'une comparaison en clair
- **Token JWT** : Ajout des informations `isProfesseur` et `professeur` dans le token

### 4. Modifications du frontend

**Fichier : `frontend/src/pages/Auth/Login.jsx`**

- Mise à jour du texte d'aide pour le mot de passe
- Distinction claire entre les instructions pour professeurs/staff et apprenants

## Comment tester

### Pour les professeurs :

1. Utilisez l'email ou le téléphone d'un employé avec le rôle "Professeurs"
2. Entrez le mot de passe défini dans la table `employe`
3. La redirection doit se faire vers `/dashboard-professeur`

### Pour les apprenants :

1. Utilisez l'email ou le téléphone d'un apprenant
2. Entrez le mot de passe par défaut (ou celui défini par l'administrateur)
3. La redirection doit se faire vers `/dashboard-apprenant`

## Structure des données utilisateur dans le token JWT

### Pour un professeur :
```json
{
  "id": 4,
  "email": "jerrys@gmail.com",
  "service": "professeurs",
  "role": "professeurs",
  "isProfesseur": true,
  "professeur": {
    "id": 1,
    "specialite_niveaux": []
  }
}
```

### Pour un apprenant :
```json
{
  "id": 1,
  "email": "dorea@gmail.com",
  "service": "apprenants",
  "nom": "tinah",
  "prenom": "dorea",
  "niveau_scolaire": "L3",
  "etablissement": "Saint Gabriel"
}
```

## Notes importantes

1. **Sécurité** : Tous les mots de passe sont maintenant hachés avec bcrypt
2. **Professeurs** : Un employé avec un rôle "professeurs" OU une entrée dans la table `professeur` sera redirigé vers le dashboard professeur
3. **Apprenants** : Le mot de passe par défaut peut être changé individuellement dans la table `apprenant`

## Fichiers modifiés

| Fichier | Description |
|---------|-------------|
| `backend/src/controllers/authController.js` | Logique d'authentification unifiée |
| `frontend/src/pages/Auth/Login.jsx` | Interface de connexion |
| `migration_auth.sql` | Script de migration de la base de données |
| `backend/scripts/generate-apprenant-password.js` | Script de génération de hash |

## Prochaines étapes recommandées

1. **Exécuter la migration** sur votre base de données de production
2. **Définir des mots de passe individuels** pour chaque apprenant
3. **Implémenter une fonctionnalité de réinitialisation** de mot de passe
4. **Ajouter un endpoint** pour que les apprenants puissent changer leur mot de passe
