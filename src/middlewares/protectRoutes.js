const protectRoutes = (req, res, next) => {
  const publicRoutes = ['/session', '/session/refresh', '/users'];
  
  // Whitelist: POST /session, POST /session/refresh, POST /users
  if (req.method === 'POST' && publicRoutes.includes(req.path)) {
    return next();
  }

  // GET /session exige login
  if (req.method === 'GET' && req.path === '/session') {
    if (!req.context.me) return res.status(401).send({ message: 'Unauthorized' });
    return next();
  }

  // Bloqueio de Escrita (POST, PUT, DELETE) exige login
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    if (!req.context.me) return res.status(401).send({ message: 'Unauthorized' });
  }

  next();
};

export default protectRoutes;