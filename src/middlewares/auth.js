import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.context.me = await req.context.models.User.findByPk(decoded.id);
    } catch (e) {
      return res.status(401).send({ message: 'Sessão inválida ou expirada.' });
    }
  }
  next();
};

export default authMiddleware;