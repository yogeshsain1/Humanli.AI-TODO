const admin = require('../config/firebase');

const authenticateUser = async (req, res, next) => {
  try {
    // Ensure Firebase Admin is initialized
    if (!admin.apps || admin.apps.length === 0) {
      return res.status(503).json({
        error: 'Firebase Admin not configured',
        message: 'Server auth is not configured. Set Firebase Admin credentials before using authenticated routes.'
      });
    }

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Add user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticateUser };
