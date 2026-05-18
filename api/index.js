import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import models, { sequelize } from '../src/models/index.js';
import authMiddleware from '../src/middlewares/auth.js';
import protectRoutes from '../src/middlewares/protectRoutes.js';
import sessionRoutes from '../src/routes/session.js';
import messageRoutes from '../src/routes/message.js';

const app = express();
app.use(express.json());

// Context Middleware
app.use((req, res, next) => {
  req.context = { models };
  next();
});

// Auth Middlewares
app.use(authMiddleware);
app.use(protectRoutes);

// Rotas
app.use('/session', sessionRoutes);
app.use('/messages', messageRoutes);

// Porta
const port = process.env.PORT || 3000;

// Sincronização e Seeders
const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    await createUsersWithMessages();
  }

  app.listen(port, () =>
    console.log(`🚀 Servidor rodando na porta ${port}!`),
  );
});

const createUsersWithMessages = async () => {
  const password = await bcrypt.hash('admin123', 10);
  
  await models.User.create(
    {
      username: 'rwieruch',
      password,
      messages: [{ text: 'Publicado no Vercel!' }],
    },
    { include: [models.Message] },
  );

  await models.User.create(
    {
      username: 'ddavids',
      password,
      messages: [{ text: 'Olá do backend!' }],
    },
    { include: [models.Message] },
  );
};

export default app;