import { 
  createBrowserRouter,
  Navigate
} from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import DashboardPedagogique from '../pages/Dashboard/DashboardPedagogique';
import DashboardAccueil from '../pages/Dashboard/DashboardAccueil';
import DashboardPedagogiqueAttribution from '../pages/Dashboard/DashboardPedagogiqueAttribution';
import Role from '../components/GestionRoles/Role';
import Employe from '../components/GestionEmployes/Employe';
import DashboardRessourcesHumaines from '../pages/Dashboard/DashboardRessourcesHumaines';
import Professeur from '../components/GestionProfesseurs/Professeur';
import GestionCours from '../pages/Cours/GestionCours';
import GestionInscription from '../components/GestionInscription/GestionInscription';
import Planning from '../components/GestionCours/Planning';
import DashboardProfesseur from '../pages/Dashboard/DashboardProfesseur';
import DashboardApprenant from '../pages/Dashboard/DashboardApprenant';
import Organisation from '../components/GestionCours/Organisation';
import Profile from '../components/Layout/Profile';
import Sessions from '../pages/Sessions';
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
        element: <DashboardAccueil />,
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
        element: <DashboardAccueil />,
      },
      {
        path: "cours",
        element: (
          <ProtectedRoute allowedServices={['professeurs']}>
            <GestionCours />
          </ProtectedRoute>
        ),
      },
      {
        path: "planning",
        element: (
          <ProtectedRoute allowedServices={['professeurs']}>
            <Planning />
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