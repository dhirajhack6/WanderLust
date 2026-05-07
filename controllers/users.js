



const User = require("../models/user");
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcomme to Wanderlust!");
    res.redirect("/listings");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.logOut = (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.flash("success", "You are logged Out");
    res.redirect("/listings");
  });
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to Wanderlust!");
  let redirect = res.locals.redirectUrl || "/listings";

  res.redirect(redirect);
};

module.exports.logout = (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.flash("success", "You are logged Out");
    res.redirect("/listings");
  });
};