const normalizeText = (value = '') => {
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const SERVICE_CONFIG = {
  rh: {
    route: '/dashboard',
    aliases: ['ressources humaines', 'ressources humaine', 'rh'],
  },
  pedagogie: {
    route: '/dashboard-pedagogique',
    aliases: ['pédagogie', 'pedagogie'],
  },
  accueil: {
    route: '/dashboard-accueil',
    aliases: ['accueil'],
  },
};

const aliasMap = Object.entries(SERVICE_CONFIG).reduce((acc, [key, config]) => {
  config.aliases.forEach((alias) => {
    acc[normalizeText(alias)] = key;
  });
  return acc;
}, {});

export const matchServiceKey = (value) => {
  const normalized = normalizeText(value);
  return aliasMap[normalized] || null;
};

export const getServiceRoute = (value) => {
  const serviceKey = matchServiceKey(value);
  return serviceKey ? SERVICE_CONFIG[serviceKey].route : null;
};

export const isServiceAllowed = (value, allowedKeys = []) => {
  if (!allowedKeys || allowedKeys.length === 0) {
    return true;
  }

  const serviceKey = matchServiceKey(value);
  return serviceKey ? allowedKeys.includes(serviceKey) : false;
};

export const getPostAuthRedirectPath = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return '/login';
  }

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return getServiceRoute(user.service) || '/login';
  } catch (error) {
    console.error('Erreur lors de la lecture du user depuis le localStorage', error);
    return '/login';
  }
};

export { SERVICE_CONFIG };

