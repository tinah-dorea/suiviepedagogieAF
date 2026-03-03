import { 
  createBrowserRouter,
  Navigate
} from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import DashboardPedagogique from '../pages/Dashboard/DashboardPedagogique';
import DashboardAccueil from '../pages/Dashboard/DashboardAccueil';
import DashboardPedagogiqueAttribution from '../pages/Dashboard/DashboardPedagogiqueAttribution';
import DashboardPedagogiqueAccueil from '../pages/Dashboard/DashboardPedagogiqueAccueil';
import Role from '../components/GestionRoles/Role';
import Employe from '../components/GestionEmployes/Employe';
import DashboardRessourcesHumaines from '../pages/Dashboard/DashboardRessourcesHumaines';
import Professeur from '../components/GestionProfesseurs/Professeur';
import GestionCours from '../pages/Cours/GestionCours';
import GestionInscription from '../components/GestionInscription/GestionInscription';
import Planning from '../components/GestionCours/Planning';
import Session from '../components/GestionCours/Session';
import Groupe from '../components/GestionCours/Groupe';
import Horaire from '../components/GestionCours/Horaire';
import Creneau from '../components/GestionCours/Creneau';
import TypeCours from '../components/GestionCours/TypeCours';
import TypeService from '../components/GestionCours/TypeService';
import Niveau from '../components/GestionCours/Niveau';
import Categorie from '../components/GestionCours/Categorie';
import Motivation from '../components/GestionCours/Motivation';
import Salle from '../components/GestionCours/Salle';
import AttributionGroupes from '../pages/Dashboard/AttributionGroupes';
import ListeGroupes from '../pages/Dashboard/ListeGroupes';
import DashboardProfesseur from '../pages/Dashboard/DashboardProfesseur';
import DashboardApprenant from '../pages/Dashboard/DashboardApprenant';
import Organisation from '../components/GestionCours/Organisation';
import Profile from '../components/Layout/Profile';
import Sessions from '../pages/Sessions';
import VoirCours from '../pages/Dashboard/VoirCours';
import ConsulterAttributs from '../pages/Dashboard/ConsulterAttributs';
import Presence from '../pages/Dashboard/Presence';
import ConsultationCours from '../pages/ConsultationCours';
import { isServiceAllowed, getServiceRoute } from '../utils/auth';
import HomePage from '../pages/HomePage';

// Composant de protection des routes
const ProtectedRoute = ({ children, allowedServices = [] }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isServiceAllowed(user.service, allowedServices)) {
    const fallback = getServiceRoute(user.service) || '/login';
    return <Navigate to={fallback} replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cours",
    element: <ConsultationCours />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedServices={['rh', 'pedagogie', 'accueil', 'professeurs']}>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedServices={['rh']}>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardRessourcesHumaines />,
      },
      {
        path: "roles",
        element: (
          <ProtectedRoute allowedServices={['rh']}>
            <Role />
          </ProtectedRoute>
        ),
      },
      {
        path: "utilisateurs",
        element: (
          <ProtectedRoute allowedServices={['rh']}>
            <Employe />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard-pedagogique",
    element: (
      <ProtectedRoute allowedServices={['pedagogie']}>
        <DashboardPedagogique />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPedagogiqueAccueil />,
      },
      {
        path: "professeurs",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Professeur />
          </ProtectedRoute>
        ),
      },
      {
        path: "cours",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <GestionCours />
          </ProtectedRoute>
        ),
      },
      {
        path: "type-service",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <TypeService />
          </ProtectedRoute>
        ),
      },
      {
        path: "type-cours",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <TypeCours />
          </ProtectedRoute>
        ),
      },
      {
        path: "niveaux",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Niveau />
          </ProtectedRoute>
        ),
      },
      {
        path: "categorie",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Categorie />
          </ProtectedRoute>
        ),
      },
      {
        path: "motivation",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Motivation />
          </ProtectedRoute>
        ),
      },
      {
        path: "salles",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Salle />
          </ProtectedRoute>
        ),
      },
      {
        path: "planning",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Planning />
          </ProtectedRoute>
        ),
      },
      {
        path: "organisations",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Organisation />
          </ProtectedRoute>
        ),
      },
      {
        path: "horaires",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Horaire />
          </ProtectedRoute>
        ),
      },
      {
        path: "creneaux",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Creneau />
          </ProtectedRoute>
        ),
      },
      {
        path: "attributions",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <DashboardPedagogiqueAttribution />
          </ProtectedRoute>
        ),
      },
      {
        path: "inscriptions",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <GestionInscription />
          </ProtectedRoute>
        ),
      },
      {
        path: "sessions",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Sessions />
          </ProtectedRoute>
        ),
      },
      {
        path: "session",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Session />
          </ProtectedRoute>
        ),
      },
      {
        path: "groupes",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Groupe />
          </ProtectedRoute>
        ),
      },
      {
        path: "attribution-groupes",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <AttributionGroupes />
          </ProtectedRoute>
        ),
      },
      {
        path: "liste-groupes",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <ListeGroupes />
          </ProtectedRoute>
        ),
      },
      {
        path: "horaires",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Horaire />
          </ProtectedRoute>
        ),
      },
      {
        path: "horaires-cours",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Horaire />
          </ProtectedRoute>
        ),
      },
      {
        path: "creneaux",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Creneau />
          </ProtectedRoute>
        ),
      },
      {
        path: "creneaux-cours",
        element: (
          <ProtectedRoute allowedServices={['pedagogie']}>
            <Creneau />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard-professeur",
    element: (
      <ProtectedRoute allowedServices={['professeurs']}>
        <DashboardProfesseur />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedServices={['professeurs']}>
            <DashboardAccueil />
          </ProtectedRoute>
        ),
      },
      {
        path: "voir-cours",
        element: (
          <ProtectedRoute allowedServices={['professeurs']}>
            <VoirCours />
          </ProtectedRoute>
        ),
      },
      {
        path: "consulter-attributs",
        element: (
          <ProtectedRoute allowedServices={['professeurs']}>
            <ConsulterAttributs />
          </ProtectedRoute>
        ),
      },
      {
        path: "presence",
        element: (
          <ProtectedRoute allowedServices={['professeurs']}>
            <Presence />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard-apprenant",
    element: (
      <ProtectedRoute allowedServices={['apprenants']}>
        <DashboardApprenant />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardAccueil />,
      },
      {
        path: "cours",
        element: (
          <ProtectedRoute allowedServices={['apprenants']}>
            <GestionCours />
          </ProtectedRoute>
        ),
      },
      {
        path: "planning",
        element: (
          <ProtectedRoute allowedServices={['apprenants']}>
            <Planning />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard-accueil",
    element: (
      <ProtectedRoute allowedServices={['accueil']}>
        <DashboardAccueil />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardAccueil />,
      },
      {
        path: "inscriptions",
        element: (
          <ProtectedRoute allowedServices={['accueil']}>
            <GestionInscription />
          </ProtectedRoute>
        ),
      },
      {
        path: "cours",
        element: (
          <ProtectedRoute allowedServices={['accueil']}>
            <GestionCours />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;