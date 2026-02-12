const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const { User, Blog } = require("../models");
const { tokenExtractor } = require("../util/middleware");

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!password || password.length < 3) {
    return res.status(400).json({ error: "Password is missing or too short" });
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ username, name, passwordHash });
    return res.status(201).json({
      id: user.id,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
});

usersRouter.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

usersRouter.put("/:username", tokenExtractor, async (req, res) => {
  const newUsername = req.body.username;

  if (!newUsername) {
    return res.status(400).json({ error: "new username missing" });
  }

  const user = await User.findOne({
    where: { username: req.params.username },
  });

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  if (req.decodedToken.id !== user.id) {
    return res.status(401).json({ error: "not allowed" });
  }

  user.username = newUsername;
  await user.save();

  return res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});
module.exports = usersRouter;
