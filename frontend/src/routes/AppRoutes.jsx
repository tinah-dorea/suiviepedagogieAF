import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import DashboardPedagogique from '../pages/Dashboard/DashboardPedagogique';
import DashboardAccueil from '../pages/Dashboard/DashboardAccueil';
import Role from '../components/GestionRoles/Role';
import Employe from '../components/GestionEmployes/Employe';
import DashboardRessourcesHumaines from '../pages/Dashboard/DashboardRessourcesHumaines';
import Professeur from '../components/GestionProfesseurs/Professeur';
import DashboardPedagogiqueAccueil from '../pages/Dashboard/DashboardPedagogiqueAccueil';
import GestionCours from '../pages/Cours/GestionCours';
import GestionInscription from '../components/GestionInscription/GestionInscription';
import { isServiceAllowed, getServiceRoute, getPostAuthRedirectPath } from '../utils/auth';

// Composant de protection des routes
const ProtectedRoute = ({ children, allowedServices = [] }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('token');
  console.log('ProtectedRoute: isAuthenticated', isAuthenticated);
  console.log('ProtectedRoute: user.service', user.service);
  
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to /login');
    return <Navigate to="/login" />;
  }

  if (!isServiceAllowed(user.service, allowedServices)) {
    const fallback = getServiceRoute(user.service) || '/login';
    console.log(`ProtectedRoute: No access, redirecting to ${fallback}`);
    return <Navigate to={fallback} replace />;
  }
  console.log('ProtectedRoute: Access granted, rendering children');
  return children;
};

const HomeRedirect = () => {
  const destination = getPostAuthRedirectPath();
  console.log('HomeRedirect: navigating to', destination);
  return <Navigate to={destination} replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'dashboard',
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
            path: 'roles',
            element: <Role />,
          },
          {
            path: 'utilisateurs',
            element: <Employe />,
          },
        ],
      },
      {
        path: 'dashboard-pedagogique',
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
            path: 'professeurs',
            element: <Professeur />,
          },
          {
            path: 'cours',
            element: <GestionCours />,
          },
          {
            path: 'inscriptions',
            element: <GestionInscription />,
          },
        ],
      },
      {
        path: 'dashboard-accueil',
        element: (
          <ProtectedRoute allowedServices={['accueil']}>
            <DashboardAccueil />
          </ProtectedRoute>
        ),
      },
      {
        index: true,
        element: <HomeRedirect />,
      },
      {
        path: '*',
        element: <HomeRedirect />,
      },
    ],
  },
]);

export default router;
