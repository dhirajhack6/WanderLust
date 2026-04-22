const express = require("express");
const Router = express.Router();

// Index - users

Router.get("/", (req, res) => {
  res.send("Get for users");
});

// Show - Users

Router.get("/users/:id", (req, res) => {
  res.send("GET for user id");
});

//POST - users

Router.post("/users", (req, res) => {
  res.send("Post for users");
});

//Delete -users

Router.delete("/users/:id", (req, res) => { });

module.exports = Router;
