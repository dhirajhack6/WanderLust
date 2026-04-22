const express = require("express");
const Router = express.Router()






// Index
Router.get("/", (req, res) => {
  res.send("Get for posts");
});

// Show

Router.get("/:id", (req, res) => {
  res.send("GET for post id");
});

//POST

Router.post("/", (req, res) => {
  res.send("POST for users");
});

//Delete

Router.delete("/:id", (req, res) => {
  res.send("DELETE for post id");
});

module.exports = Router;