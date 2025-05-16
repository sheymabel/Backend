const admin = require('./../config/firebase');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).send({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;  // Attach the decoded user info to the request
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
};
