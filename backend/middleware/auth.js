/**
 * Middleware to check if the user is authenticated (session exists)
 */
const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Please login to access this resource' });
  }
};

/**
 * Middleware to check if the user has the 'admin' role
 */
const isAdmin = (req, res, next) => {
  if (req.session && req.session.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

module.exports = {
  isLoggedIn,
  isAdmin
};
