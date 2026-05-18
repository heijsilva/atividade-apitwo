import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const getSession = async (req, res) => {
  const user = await req.context.models.User.findByPk(req.context.me.id);
  return res.send(user);
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await req.context.models.User.findByLogin(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ message: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });

  const refreshToken = await req.context.models.RefreshToken.create({
    token: uuidv4(),
    userId: user.id,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
  });

  return res.send({ token, refreshToken: refreshToken.token });
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  await req.context.models.RefreshToken.destroy({ where: { token: refreshToken } });
  return res.send({ message: 'Logout efetuado com sucesso.' });
};

const refresh = async (req, res) => {
  const { refreshToken: tokenStr } = req.body;
  const oldRefreshToken = await req.context.models.RefreshToken.findOne({
    where: { token: tokenStr },
  });

  if (!oldRefreshToken || oldRefreshToken.expiryDate < new Date()) {
    return res.status(403).send({ message: 'Refresh token inválido ou expirado.' });
  }

  const user = await req.context.models.User.findByPk(oldRefreshToken.userId);
  const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });

  const newRefreshTokenStr = uuidv4();
  await oldRefreshToken.update({ token: newRefreshTokenStr }); // Requisito: manter a mesma expiração

  return res.send({ token: newToken, refreshToken: newRefreshTokenStr });
};

export default { getSession, login, logout, refresh };