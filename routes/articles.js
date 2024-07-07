const express = require("express");
const Article = require("../models/articleSchema");
const router = express.Router();

router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
  let article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

router.get("/:slug", async (req, res) => {
  let article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article });
});

router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;

    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        article.slug += "-" + Date.now(); // Append timestamp to make the slug unique
        try {
          article = await article.save();
          res.redirect(`/articles/${article.slug}`);
        } catch (error) {
          console.log(error);
          res.render(`articles/${path}`, { article: article }); // Corrected closing backtick and object passing
        }
      } else {
        console.log(error);
        res.render(`articles/${path}`, { article: article }); // Corrected closing backtick and object passing
      }
    }
  };
}

module.exports = router;
