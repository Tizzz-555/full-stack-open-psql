const readinglistsRouter = require("express").Router();
const { ReadingList, User } = require("../models");
const { tokenExtractor } = require("../util/middleware");

readinglistsRouter.post("/", async (req, res) => {
  const { blogId, userId } = req.body;
  const [readingList] = await ReadingList.findOrCreate({
    where: { userId, blogId },
    defaults: { userId, blogId },
  });
  res.status(201).json(readingList);
});

readinglistsRouter.put("/:id", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const readingList = await ReadingList.findByPk(req.params.id);
  if (readingList.userId !== user.id) {
    return res.status(401).json({ error: "not allowed" });
  }
  readingList.read = req.body.read;
  await readingList.save();
  res.status(201).json(readingList);
});
module.exports = readinglistsRouter;
