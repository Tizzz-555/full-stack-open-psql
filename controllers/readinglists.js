const readinglistsRouter = require("express").Router();
const { ReadingList } = require("../models");

readinglistsRouter.post("/", async (req, res) => {
  const readingList = await ReadingList.create(req.body);
  await readingList.save();
  res.status(201).json(readingList);
});

module.exports = readinglistsRouter;
