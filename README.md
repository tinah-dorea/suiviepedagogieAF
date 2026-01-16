
# Suivi Pédagogique AF - Documentation Technique Complète

## Table des Matières

1. [Introduction](#introduction)
2. [Structure du projet](#structure-du-projet)
3. [Technologies utilisées](#technologies-utilisées)
4. [Fonctionnalités implémentées](#fonctionnalités-implémentées)
5. [Architecture du backend](#architecture-du-backend)
6. [Architecture du frontend](#architecture-du-frontend)
7. [Base de données](#base-de-données)
8. [Installation et configuration](#installation-et-configuration)
9. [Guide de développement](#guide-de-développement)
10. [API endpoints](#api-endpoints)

## Introduction

L'application "Suivi Pédagogique AF" est une solution complète de gestion pédagogique destinée à gérer les sessions, les inscriptions, les présences, les horaires et les entités pédagogiques (employés, salles, groupes, niveaux, etc.).

Le projet est divisé en trois parties principales :
- Backend : API REST développée avec Node.js/Express
- Frontend : Application React pour l'interface utilisateur
- Version Portable : Application mobile probablement basée sur Expo

## Structure du projet

```
suiviepedagogiqueAF/
├── backend/                 # API serveur Node.js/Express
│   ├── src/
│   │   ├── config/         # Configuration (base de données, etc.)
│   │   ├── controllers/    # Logique métier des contrôleurs
│   │   ├── middlewares/    # Middlewares (authentification, validation)
│   │   ├── routes/         # Définition des routes API
│   │   └── validations/    # Validation des requêtes
│   ├── app.js              # Configuration principale d'Express
│   └── server.js           # Point d'entrée du serveur
├── frontend/               # Application React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Composants React réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── routes/         # Gestion des routes côté client
│   │   ├── services/       # Services d'appel API
│   │   └── context/        # Contexte React (authentification)
│   └── package.json
├── versionPortable/        # Application mobile (probablement Expo)
├── date_base.sql           # Script de création de la base de données
└── insert_data.sql         # Données initiales
```

### Rôles des dossiers principaux

- **backend/** : API REST qui expose les endpoints utilisés par le frontend. Gère l'authentification, la validation, la logique métier et l'accès à la base de données (PostgreSQL).

- **backend/src/config/** : Configuration de l'application (connexion PostgreSQL dans [db.js](file:///f:/suiviepedagogiqueAF/backend/src/config/db.js)).

- **backend/src/controllers/** : Chaque fichier est un contrôleur pour une ressource (ex: [sessionController.js](file:///f:/suiviepedagogiqueAF/backend/src/controllers/sessionController.js), [inscriptionController.js](file:///f:/suiviepedagogiqueAF/backend/src/controllers/inscriptionController.js)) — reçoit la requête, appelle la couche service ou la DB, renvoie une réponse.

- **backend/src/routes/** : Routes Express qui relient les endpoints HTTP aux contrôleurs.

- **backend/src/middlewares/** : Middlewares partagés — authentification ([authMiddleware.js](file:///f:/suiviepedagogiqueAF/backend/src/middlewares/authMiddleware.js)), validation ([validateRequest.js](file:///f:/suiviepedagogiqueAF/backend/src/middlewares/validateRequest.js)).

- **backend/src/validations/** : Schémas et règles de validation (Joi / express-validator).

- **frontend/** : Application React (create-react-app) qui consomme l'API backend via `axios` et affiche l'interface utilisateur. Gère l'authentification, les dashboards et les fonctionnalités métier.

- **versionPortable/** : Code pour version portable (mobile) — composants UI, hooks et services pour API (probablement React Native / Expo).

## Technologies utilisées

### Backend
- **Node.js** (ES modules)
- **Express 5** (framework web)
- **PostgreSQL** (`pg`) pour la base de données
- **JWT** (`jsonwebtoken`) pour l'authentification
- **Bcrypt** pour le hachage des mots de passe
- **Joi** et **express-validator** pour la validation
- **Dotenv** pour la configuration d'environnement
- **Nodemon** en développement

### Frontend
- **React 19** (create-react-app)
- **React Router** pour la navigation
- **Axios** pour les requêtes HTTP
- **TailwindCSS** pour le style
- **React Toastify**, **Heroicons**, **Headless UI** pour l'UI

## Fonctionnalités implémentées

### Authentification
- Système d'authentification basé sur JWT
- Contrôles d'authentification présents (contrôleur [authController.js](file:///f:/suiviepedagogiqueAF/backend/src/controllers/authController.js) et [authMiddleware.js](file:///f:/suiviepedagogiqueAF/backend/src/middlewares/authMiddleware.js))
- Hachage des mots de passe avec bcrypt

### Gestion des entités pédagogiques
- Contrôleurs et routes disponibles pour :
  - [**Employés**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/employeController.js) : Gestion des employés et des rôles
  - [**Sessions**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/sessionController.js) : Gestion des sessions pédagogiques
  - [**Cours**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/sessionCoursController.js) : Types de cours et gestion des cours dans les sessions
  - [**Inscriptions**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/inscriptionController.js) : Gestion des inscriptions des étudiants
  - [**Présences**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/presenceController.js) : Suivi des présences
  - [**Salles**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/salleController.js) : Gestion des salles
  - [**Horaires**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/horaireController.js) : Gestion des horaires
  - [**Niveaux**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/niveauController.js) : Gestion des niveaux pédagogiques
  - [**Groupes**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/groupeController.js) : Gestion des groupes d'étudiants
  - [**Examens**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/examenController.js) : Gestion des examens
  - [**Catégories**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/categorieController.js) : Catégorisation des cours
  - [**Types de cours**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/typeCoursController.js) : Types de cours offerts
  - [**Types de services**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/typeServiceController.js) : Services de l'établissement
  - [**Motivations**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/motivationController.js) : Motivations des inscriptions
  - [**Tests de niveau**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/testNiveauController.js) : Tests de niveau des étudiants
  - [**Rôles**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/roleController.js) : Gestion des rôles des employés
  - [**Affectations de salles**](file:///f:/suiviepedagogiqueAF/backend/src/controllers/affectationSalleController.js) : Attribution des salles aux groupes

### Validation et sécurité
- Validation des requêtes avec Joi et express-validator
- Middleware [validateRequest.js](file:///f:/suiviepedagogiqueAF/backend/src/middlewares/validateRequest.js) pour valider les entrées
- Protection contre les attaques XSS et CSRF via les middlewares Express

### Base de données
- Connexion PostgreSQL via [db.js](file:///f:/suiviepedagogiqueAF/backend/src/config/db.js) utilisant le module `pg` avec pooling de connexions
- Scripts SQL pour la création de la base ([date_base.sql](file:///f:/suiviepedagogiqueAF/date_base.sql)) et les données initiales ([insert_data.sql](file:///f:/suiviepedagogiqueAF/insert_data.sql))

## Architecture du backend

### Principales composantes

#### Serveur principal
- [**server.js**](file:///f:/suiviepedagogiqueAF/backend/server.js) : Point d'entrée de l'application, écoute sur un port défini
- [**app.js**](file:///f:/suiviepedagogiqueAF/backend/app.js) : Configuration d'Express, CORS, middlewares et enregistrement des routes

#### Contrôleurs
Chaque contrôleur implémente les opérations CRUD pour une entité spécifique :
- Utilisent le pool de connexions PostgreSQL pour exécuter les requêtes
- Implémentent la logique métier spécifique à chaque entité
- Gèrent les erreurs et renvoient des réponses appropriées

#### Middlewares
- [**authMiddleware.js**](file:///f:/suiviepedagogiqueAF/backend/src/middlewares/authMiddleware.js) : Vérifie la présence et la validité du token JWT
- [**validateRequest.js**](file:///f:/suiviepedagogiqueAF/backend/src/middlewares/validateRequest.js) : Valide les données de la requête avant traitement

#### Validations
- Chaque entité possède son propre fichier de validation dans [src/validations/](file:///f:/suiviepedagogiqueAF/backend/src/validations)
- Utilisent Joi pour définir les schémas de validation

### Exemple de contrôleur (employeController.js)

```javascript
// POST: Créer un nouvel employé
export const createEmploye = async (req, res) => {
  const { service, nom, prenom, age, adresse, tel, email, mot_passe, id_role } = req.body;

  if (!nom || !prenom || !email || !mot_passe || !id_role) {
    return res.status(400).json({ 
      message: "Tous les champs obligatoires doivent être remplis",
      details: "nom, prenom, email, mot_passe et id_role sont requis"
    });
  }

  try {
    // Vérifier si le rôle existe
    const roleCheck = await pool.query('SELECT id, nom_role FROM role WHERE id = $1', [id_role]);
    if (roleCheck.rows.length === 0) {
      return res.status(400).json({ message: "Le rôle spécifié n'existe pas" });
    }

    // Vérifier si l'email existe déjà
    const emailCheck = await pool.query('SELECT id FROM employe WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(mot_passe, 10);
    const finalService = enforceServiceByRole(service, roleName);

    const result = await pool.query(`
      INSERT INTO employe (
        service, nom, prenom, age, adresse, tel, email, mot_passe, 
        id_role, is_active, date_creation
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, CURRENT_TIMESTAMP)
      RETURNING id, service, nom, prenom, age, adresse, tel, email, 
               id_role, is_active, date_creation
    `, [finalService, nom, prenom, age, adresse, tel, email, hashedPassword, id_role]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la création de l'employé:", error);
    res.status(500).json({ message: "Erreur lors de la création de l'employé" });
  }
};
```

## Architecture du frontend

### Structure des composants

#### Pages principales
- **Login** : Authentification des utilisateurs
- **Dashboard** : Accueil général avec navigation
- **DashboardRessourcesHumaines** : Gestion RH (rôles, employés)
- **DashboardPedagogique** : Gestion pédagogique (cours, inscriptions, planning)
- **DashboardProfesseur** : Interface spécifique pour les enseignants
- **DashboardAccueil** : Interface pour le service accueil

#### Composants réutilisables
- **GestionEmployes/Employe** : Gestion des employés et des rôles
- **GestionCours** : Ensemble de composants pour la gestion des cours
- **GestionInscription** : Gestion des inscriptions
- **GestionProfesseurs** : Interface spécifique pour les professeurs
- **GestionRoles** : Gestion des rôles

### Services d'appel API

Chaque entité dispose de son service dans [src/services/](file:///f:/suiviepedagogiqueAF/frontend/src/services) :
- Utilisent Axios pour les requêtes HTTP
- Ajoutent automatiquement le token JWT aux en-têtes
- Gèrent les erreurs de manière centralisée

### Exemple de service (employeService.js)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ajouter token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getEmployes = () => api.get('/employes');
export const getRoles = () => api.get('/employes/roles');
export const createEmploye = (data) => api.post('/employes', data);
export const updateEmploye = (id, data) => api.put(`/employes/${id}`, data);
export const toggleStatus = (id, is_active) => api.patch(`/employes/${id}/status`, { is_active });
export const deleteEmploye = (id) => api.delete(`/employes/${id}`);
```

### Gestion des routes

L'application utilise React Router avec une protection basée sur les services :
- Seuls les utilisateurs authentifiés peuvent accéder aux pages
- L'accès est restreint selon le service de l'utilisateur (RH, pédagogie, professeurs, accueil)

## Base de données

### Modèle relationnel

L'application utilise une base PostgreSQL avec les tables suivantes :
- **type_service** : Types de services de l'établissement
- **type_cours** : Types de cours offerts
- **niveau** : Niveaux pédagogiques
- **categorie** : Catégories de cours
- **salle** : Salles disponibles
- **motivation** : Motivations des inscriptions
- **role** : Rôles des employés
- **employe** : Informations sur les employés
- **session** : Sessions pédagogiques
- **session_cours** : Instances de cours dans les sessions
- **creneau** : Horaires hebdomadaires des cours
- **inscription** : Inscriptions des étudiants
- **groupe** : Groupes d'étudiants
- **affectation_salle** : Attribution des salles aux groupes
- **presence** : Suivi des présences
- **test_niveau** : Tests de niveau
- **examen** : Gestion des examens

### Relations importantes

- Un employé a un rôle (relation avec la table [role](file:///f:/suiviepedagogiqueAF/backend/src/controllers/roleController.js))
- Une session contient plusieurs cours (via [session_cours](file:///f:/suiviepedagogiqueAF/backend/src/controllers/sessionCoursController.js))
- Un cours a des créneaux horaires (via [creneau](file:///f:/suiviepedagogiqueAF/backend/src/controllers/horaireController.js))
- Les inscriptions se font à des créneaux (via [inscription](file:///f:/suiviepedagogiqueAF/backend/src/controllers/inscriptionController.js))
- Les groupes sont créés à partir des inscriptions (via [groupe](file:///f:/suiviepedagogiqueAF/backend/src/controllers/groupeController.js))
- Les présences sont liées aux inscriptions et aux groupes (via [presence](file:///f:/suiviepedagogiqueAF/backend/src/controllers/presenceController.js))

## Installation et configuration

### Prérequis

- Node.js (version 16 ou supérieure)
- PostgreSQL (serveur de base de données)
- Git

### Étapes d'installation

1. Cloner le dépôt :
```bash
git clone https://github.com/votre-repo/suiviepedagogiqueAF.git
cd suiviepedagogiqueAF
```

2. Configurer la base de données PostgreSQL :
```sql
-- Créer la base de données
CREATE DATABASE suivie_pedagogique_af;

-- Exécuter le script de création
psql -d suivie_pedagogique_af -f date_base.sql

-- Charger les données initiales
psql -d suivie_pedagogique_af -f insert_data.sql
```

3. Configurer les variables d'environnement :
```bash
# Backend/.env
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_NAME=suivie_pedagogique_af
DB_PORT=5432
JWT_SECRET=votre_clé_secrète_jwt
PORT=5000
NODE_ENV=development
```

4. Installer les dépendances du backend :
```bash
cd backend
npm install
```

5. Installer les dépendances du frontend :
```bash
cd ../frontend
npm install
```

6. Démarrer le backend :
```bash
cd ../backend
npm run dev  # ou npm start en production
```

7. Démarrer le frontend :
```bash
cd ../frontend
npm start
```

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| DB_USER | Nom d'utilisateur PostgreSQL | postgres |
| DB_PASSWORD | Mot de passe PostgreSQL | 1234 |
| DB_HOST | Hôte PostgreSQL | localhost |
| DB_NAME | Nom de la base de données | suivie_pedagogique_af |
| DB_PORT | Port PostgreSQL | 5432 |
| JWT_SECRET | Clé secrète pour JWT | - |
| PORT | Port d'écoute du serveur | 5000 |
| NODE_ENV | Environnement (development/production) | development |

## Guide de développement

### Bonnes pratiques

1. **Séparation des responsabilités** : Garder la logique métier dans les contrôleurs et non dans les routes
2. **Validation des entrées** : Toujours valider les données reçues via les middlewares
3. **Gestion des erreurs** : Utiliser des blocs try/catch et retourner des codes HTTP appropriés
4. **Sécurité** : Hacher les mots de passe et valider les tokens JWT
5. **Documentation** : Commenter le code et maintenir cette documentation à jour

### Ajout d'une nouvelle entité

Pour ajouter une nouvelle entité au système, suivez ces étapes :

1. Créer la table dans la base de données (dans [date_base.sql](file:///f:/suiviepedagogiqueAF/date_base.sql))
2. Créer le contrôleur dans [backend/src/controllers/](file:///f:/suiviepedagogiqueAF/backend/src/controllers)
3. Créer les validations dans [backend/src/validations/](file:///f:/suiviepedagogiqueAF/backend/src/validations)
4. Créer les routes dans [backend/src/routes/](file:///f:/suiviepedagogiqueAF/backend/src/routes)
5. Enregistrer les routes dans [backend/app.js](file:///f:/suiviepedagogiqueAF/backend/app.js)
6. Créer le service dans [frontend/src/services/](file:///f:/suiviepedagogiqueAF/frontend/src/services)
7. Créer le composant dans [frontend/src/components/](file:///f:/suiviepedagogiqueAF/frontend/src/components)
8. Ajouter les routes frontend dans [frontend/src/routes/AppRoutes.jsx](file:///f:/suiviepedagogiqueAF/frontend/src/routes/AppRoutes.jsx)

### Tests

Bien que les tests ne soient pas encore implémentés dans le projet, il est recommandé d'ajouter :
- Tests unitaires pour les contrôleurs backend avec Jest
- Tests d'intégration pour les routes API
- Tests de composants React avec React Testing Library
- Tests E2E avec Cypress ou Playwright

## API endpoints

L'API expose les endpoints suivants (tous préfixés avec `/api`) :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | [/auth/login](file:///f:/suiviepedagogiqueAF/backend/src/controllers/authController.js) | Authentification des utilisateurs |
| GET | [/employes](file:///f:/suiviepedagogiqueAF/backend/src/controllers/employeController.js) | Récupérer tous les employés |
| POST | [/employes](file:///f:/suiviepedagogiqueAF/backend/src/controllers/employeController.js) | Créer un nouvel employé |
| PUT | [/employes/:id](file:///f:/suiviepedagogiqueAF/backend/src/controllers/employeController.js) | Mettre à jour un employé |
| PATCH | [/employes/:id/status](file:///f:/suiviepedagogiqueAF/backend/src/controllers/employeController.js) | Changer le statut d'activité d'un employé |
| DELETE | [/employes/:id](file:///f:/suiviepedagogiqueAF/backend/src/controllers/employeController.js) | Supprimer (désactiver) un employé |
| GET | [/employes/roles](file:///f:/suiviepedagogiqueAF/backend/src/controllers/employeController.js) | Récupérer tous les rôles |
| GET | [/sessions](file:///f:/suiviepedagogiqueAF/backend/src/controllers/sessionController.js) | Récupérer toutes les sessions |
| POST | [/sessions](file:///f:/suiviepedagogiqueAF/backend/src/controllers/sessionController.js) | Créer une nouvelle session |
| GET | [/salles](file:///f:/suiviepedagogiqueAF/backend/src/controllers/salleController.js) | Récupérer toutes les salles |
| GET | [/niveaux](file:///f:/suiviepedagogiqueAF/backend/src/controllers/niveauController.js) | Récupérer tous les niveaux |
| GET | [/categories](file:///f:/suiviepedagogiqueAF/backend/src/controllers/categorieController.js) | Récupérer toutes les catégories |
| GET | [/type-cours](file:///f:/suiviepedagogiqueAF/backend/src/controllers/typeCoursController.js) | Récupérer tous les types de cours |
| GET | [/type-services](file:///f:/suiviepedagogiqueAF/backend/src/controllers/typeServiceController.js) | Récupérer tous les types de services |
| GET | [/horaires](file:///f:/suiviepedagogiqueAF/backend/src/controllers/horaireController.js) | Récupérer tous les horaires |
| GET | [/groupes](file:///f:/suiviepedagogiqueAF/backend/src/controllers/groupeController.js) | Récupérer tous les groupes |
| GET | [/inscriptions](file:///f:/suiviepedagogiqueAF/backend/src/controllers/inscriptionController.js) | Récupérer toutes les inscriptions |
| GET | [/presences](file:///f:/suiviepedagogiqueAF/backend/src/controllers/presenceController.js) | Récupérer toutes les présences |
| GET | [/examens](file:///f:/suiviepedagogiqueAF/backend/src/controllers/examenController.js) | Récupérer tous les examens |
| GET | [/test-niveaux](file:///f:/suiviepedagogiqueAF/backend/src/controllers/testNiveauController.js) | Récupérer tous les tests de niveau |
| GET | [/motivations](file:///f:/suiviepedagogiqueAF/backend/src/controllers/motivationController.js) | Récupérer toutes les motivations |
| GET | [/affectation-salles](file:///f:/suiviepedagogiqueAF/backend/src/controllers/affectationSalleController.js) | Récupérer toutes les affectations de salles |
| GET | [/roles](file:///f:/suiviepedagogiqueAF/backend/src/controllers/roleController.js) | Récupérer tous les rôles |
| GET | [/session-cours](file:///f:/suiviepedagogiqueAF/backend/src/controllers/sessionCoursController.js) | Récupérer tous les cours de session |

Tous les endpoints (sauf [/auth/login](file:///f:/suiviepedagogiqueAF/backend/src/controllers/authController.js)) nécessitent un token JWT valide dans l'en-tête `Authorization: Bearer <token>`.