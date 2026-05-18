const protectRoutes = (req, res, next) => {
  // Normaliza o path (remove a barra final se existir)
  const path = req.path.replace(/\/$/, '') || '/';
  const method = req.method;

  const publicRoutes = ['/session', '/session/refresh', '/users'];
  
  // Whitelist: POST nestas rotas é sempre público
  if (method === 'POST' && publicRoutes.includes(path)) {
    return next();
  }

  // GET em qualquer rota (exceto /session) também é público conforme o enunciado
  if (method === 'GET' && path !== '/session') {
    return next();
  }

  // Se não tem usuário autenticado no context, bloqueia
  if (!req.context.me) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  next();
};

export default protectRoutes;