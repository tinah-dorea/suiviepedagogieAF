import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Accès refusé. Token manquant.',
        details: 'Aucun en-tête d\'autorisation fourni' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Accès refusé. Token manquant.',
        details: 'Token non trouvé dans l\'en-tête' 
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET non défini dans les variables d\'environnement');
      return res.status(500).json({ 
        message: 'Erreur de configuration du serveur' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // S'assurer que l'ID est un nombre
    if (decoded.id) {
      decoded.id = Number(decoded.id);
    }
    
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: 'Token invalide',
        details: error.message 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        message: 'Token expiré',
        details: 'Veuillez vous reconnecter' 
      });
    }
    
    res.status(500).json({ 
      message: 'Erreur lors de la vérification du token',
      details: error.message 
    });
  }
};