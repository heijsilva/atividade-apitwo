import 'dotenv/config';
import express from 'express';
import models, { sequelize } from '../src/models';
import authMiddleware from '../src/middlewares/auth';
import protectRoutes from '../src/middlewares/protectRoutes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Adicionando modelos ao contexto
app.use((req, res, next) => {
  req.context = { models };
  next();
});

// A ordem aqui é CRÍTICA
app.use(authMiddleware);
app.use(protectRoutes);

// Rotas (exemplo)
// app.use('/session', routes.session);
// ... resto das suas rotas

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }
  app.listen(process.env.PORT || 3000, () =>
    console.log(`App ouvindo na porta ${process.env.PORT || 3000}!`),
  );
});

// ATUALIZAÇÃO ITEM 4: Seeders com senha segura
const createUsersWithMessages = async () => {
  const bcrypt = require('bcryptjs');
  const hashedUser1 = await bcrypt.hash('admin123', 10);
  
  await models.User.create(
    {
      username: 'rwieruch',
      password: hashedUser1,
      messages: [{ text: 'Publicado no Vercel!' }],
    },
    { include: [models.Message] },
  );
  // adicione o ddavids aqui também...
};