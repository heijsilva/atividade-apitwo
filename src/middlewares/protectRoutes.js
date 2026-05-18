const protectRoutes = (req, res, next) => {
  const publicRoutes = [
    { method: 'POST', path: '/session' },
    { method: 'POST', path: '/session/refresh' },
    { method: 'POST', path: '/users' }
  ];

  const isPublic = publicRoutes.some(
    route => route.method === req.method && req.path === route.path
  );

  // Se for GET (público), exceto /session
  if (req.method === 'GET' && req.path !== '/session') {
    return next();
  }

  // Se não estiver autenticado e não for rota pública da whitelist
  if (!req.context.me && !isPublic) {
    return res.status(401).send({ message: 'Acesso não autorizado.' });
  }

  next();
};

export default protectRoutes;