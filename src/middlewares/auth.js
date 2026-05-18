import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <TOKEN>

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.context.me = await req.context.models.User.findByPk(decoded.id);
    } catch (e) {
      return res.status(401).send({ message: 'Token inválido ou expirado.' });
    }
  }
  next();
};

export default authMiddleware;