// Middleware to check if the user is an Admin
exports.checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Admins only' });
    }
    next();
  };
  