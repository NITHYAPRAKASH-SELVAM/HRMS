const jwt = require('jsonwebtoken');

const authorization = (req, res, next) => {
  const token = req.header('Auth-Token');
  console.log('🛡️ Received token:', token);

  if (!token) {
    console.warn('❌ No token provided');
    return res.status(401).send({ message: 'Access denied. No token.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log('✅ Token verified. User:', verified);
    next();
  } catch (error) {
    console.error('❌ Invalid token:', error.message);
    res.status(400).send({ message: 'Invalid token.' });
  }
};

module.exports = authorization;
