const blogsRouter = require("express").Router();
const { Blog, User } = require("../models");
const { tokenExtractor } = require("../util/middleware");
const { Op } = require("sequelize");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

blogsRouter.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    const search = req.query.search.trim();
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { author: { [Op.iLike]: `%${search}%` } },
    ];
  }
  const blogs = await Blog.findAll({
    order: [["likes", "DESC"]],
    attributes: { exclude: ["userId"] },
    //show users
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
  });
  res.json(blogs);
});

blogsRouter.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.build({ ...req.body, date: new Date() });
  blog.userId = user.id;
  await blog.save();
  res.status(201).json(blog);
});

blogsRouter.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
  if (!req.blog) return res.status(404).end();

  const user = await User.findByPk(req.decodedToken.id);
  if (req.blog.userId !== user.id) {
    return res.status(401).json({ error: "not allowed" });
  }

  await req.blog.destroy();
  return res.status(200).json(req.blog);
});

blogsRouter.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = blogsRouter;
