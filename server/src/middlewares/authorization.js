const jwt = require('jsonwebtoken');

const authorization = (req, res, next) => {
  // Try to get token from 'Authorization' header (Bearer token) or 'Auth-Token'
  let token;

  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7); // Remove 'Bearer ' prefix
  } else {
    token = req.header('Auth-Token');
  }

  console.log('🛡️ Received token:', token || 'No token found');

  if (!token) {
    console.warn('❌ No token provided');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log('✅ Token verified. User:', verified);
    next();
  } catch (error) {
    console.error('❌ Invalid token:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authorization;
