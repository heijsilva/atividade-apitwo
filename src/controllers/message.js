const getMessages = async (req, res) => {
  const messages = await req.context.models.Message.findAll();
  return res.send(messages);
};

const getMessage = async (req, res) => {
  const message = await req.context.models.Message.findByPk(req.params.messageId);
  return res.send(message);
};

const createMessage = async (req, res) => {
  const message = await req.context.models.Message.create({
    text: req.body.text,
    userId: req.context.me.id,
  });
  return res.send(message);
};

const deleteMessage = async (req, res) => {
  await req.context.models.Message.destroy({ where: { id: req.params.messageId } });
  return res.send(true);
};

export default { getMessages, getMessage, createMessage, deleteMessage };