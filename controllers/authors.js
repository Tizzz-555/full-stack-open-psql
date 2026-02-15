// returns the number of blogs for each author and the total number of likes
const authorsRouter = require("express").Router();
const { Blog } = require("../models");
const { sequelize } = require("../util/db");

authorsRouter.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("id")), "n_blogs"],
      [sequelize.fn("SUM", sequelize.col("likes")), "n_likes"],
    ],
    group: ["author"],
    raw: true,
  });
  res.json(authors);
});

module.exports = authorsRouter;
