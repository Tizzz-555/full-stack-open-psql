const resetRouter = require("express").Router();
const { Blog, User } = require("../models");

resetRouter.post("/", async (req, res) => {
  await Blog.destroy({ where: {} });
  await User.destroy({ where: {} });
  res.status(204).end();
});

module.exports = resetRouter;
