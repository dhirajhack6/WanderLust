const express = require("express");
const app = express();

const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized : true,
}

app.use(session(sessionOptions));
app.use(flash());


app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  req.flash("success", "User have been registered successfully");

  res.redirect("/hello");
  
});

app.get("/hello", (req, res) => {
  res.locals.successMag = req.flash("success");
    res.locals.errMag = req.flash("error");

 
  res.render("page.ejs", { name: req.session.name, msg: req.flash("success") });
});









// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test", (req, res) => {
//   res.send("test successful!");
// });

// app.use(cookieParser("secretecode"));

// app.get("/getsignedcookie", (req, res) => {
//   res.cookie("made-in", "India", { signed: true });
//   res.send("signed cookie sent");
// });

// app.get("/verify", (req, res) => {
//   const value = req.signedCookies["made-in"];

//   if (value === undefined) {
//     res.send("Cookies not found");

//   } else if (value === null) {
//     res.send("Cookie tempered");
//   } else {
//     res.send("Cookie valid");
//   }
// })

// app.get("/greet", (req, res) => {
//   let { name = "anonymous" } = req.cookies;
//   res.send(`Hi , ${name}`)

// })

// //Cookies route
// app.get("/getcookies", (req, res) => {
//   res.cookie("greet", "hello");
//   res.cookie("madeIn", "namaste");
//   res.send("sent you some cookies!");
// });

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   console.log(req.cookies);
//   res.send("Hi, I am root!");
// });

// app.use("/users", users);
// app.use("/posts", posts);

// //Posts
// //Index

app.listen(3000, () => {
  console.log("Server is listening to 3000");
});
