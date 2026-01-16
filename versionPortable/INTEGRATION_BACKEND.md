# Intégration Backend pour l'Application Mobile

Ce document explique comment intégrer l'application mobile Expo avec le backend existant du projet Suivi Pédagogique.

## Installation des Dépendances Requises

L'application mobile a besoin de certaines dépendances supplémentaires pour fonctionner avec le backend:

```bash
# Se rendre dans le répertoire de l'application mobile
cd ../versionPortable

# Installer les dépendances nécessaires
npx expo install @react-native-async-storage/async-storage
```

## Configuration de l'Adresse du Backend

Par défaut, l'application mobile tente de se connecter au backend à l'adresse `http://192.168.1.100:5000/api`. Vous devez modifier cette adresse dans `services/api.js` pour correspondre à l'adresse IP de votre machine exécutant le backend:

```javascript
const BACKEND_URL = __DEV__ 
  ? 'http://VOTRE_ADRESSE_IP:5000/api'  // Remplacez avec votre IP locale
  : 'http://your-production-url.com/api'; // URL de production
```

Pour trouver votre adresse IP locale :
- Sur Windows : Ouvrir l'invite de commandes et taper `ipconfig`
- Sur Mac/Linux : Ouvrir le terminal et taper `ifconfig`

## Services Disponibles

Plusieurs services sont disponibles pour interagir avec le backend :

### AuthService
- `login(email, password)` - Authentification
- `logout()` - Déconnexion
- `getCurrentUser()` - Obtenir les données de l'utilisateur courant
- `isAuthenticated()` - Vérifier si l'utilisateur est authentifié

### EmployeService
- `getEmployes()` - Obtenir la liste des employés
- `getRoles()` - Obtenir les rôles
- `createEmploye(data)` - Créer un employé
- `updateEmploye(id, data)` - Mettre à jour un employé
- `toggleStatus(id, is_active)` - Changer le statut d'un employé
- `deleteEmploye(id)` - Supprimer un employé

### CoursService
- `getTypeCours()` - Obtenir les types de cours
- `getCategories()` - Obtenir les catégories
- `getNiveaux()` - Obtenir les niveaux
- `getSessions()` - Obtenir les sessions
- `getSessionCours()` - Obtenir les sessions de cours
- `getCreneaux()` - Obtenir les créneaux horaires
- Et les méthodes de création pour chaque entité

### InscriptionService
- `getInscriptions()` - Obtenir les inscriptions
- `getInscriptionById(id)` - Obtenir une inscription par ID
- `createInscription(data)` - Créer une inscription
- `updateInscription(id, data)` - Mettre à jour une inscription
- `deleteInscription(id)` - Supprimer une inscription
- `getInscriptionsBySession(sessionId)` - Obtenir les inscriptions par session
- `getInscriptionsByTypeCours(typeCoursId)` - Obtenir les inscriptions par type de cours

## Utilisation dans les Composants

Exemple d'utilisation dans un composant React :

```jsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getEmployes } from '../services/employeService';

const EmployeListScreen = () => {
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployes = async () => {
      try {
        const data = await getEmployes();
        setEmployes(data);
      } catch (error) {
        console.error('Erreur lors du chargement des employés:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployes();
  }, []);

  if (loading) {
    return <Text>Chargement...</Text>;
  }

  return (
    <View>
      {employes.map(employe => (
        <Text key={employe.id}>{employe.nom} {employe.prenom}</Text>
      ))}
    </View>
  );
};

export default EmployeListScreen;
```

## Points Importants

1. **Sécurité**: L'application mobile utilise le même système d'authentification JWT que le frontend web.
2. **Gestion des erreurs**: Tous les services gèrent les erreurs de manière cohérente.
3. **Compatibilité**: Les services mobiles sont conçus pour fonctionner avec les mêmes endpoints que le frontend web.
4. **Stockage local**: Les tokens d'authentification sont stockés localement à l'aide d'AsyncStorage.

## Dépannage

Si vous rencontrez des problèmes de connexion :
1. Vérifiez que le backend est en cours d'exécution sur le port 5000
2. Vérifiez que l'adresse IP dans le fichier `services/api.js` est correcte
3. Vérifiez que le pare-feu ne bloque pas les connexions entrantes
4. Assurez-vous que le module `@react-native-async-storage/async-storage` est correctement installé