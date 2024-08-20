const express = require("express");
const session = require("express-session");
require("./auth");
const passport = require("passport");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session({ resave: false, saveUninitialized: true }));

app.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Auth with google</a>");
});

app.get("/auth/google", (req, res) => {
  passport.authenticate("google", { scope: ["email", "profile"] })(req, res);
});

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failed",
    successRedirect: "/protected",
  })
);

app.get("/protected", isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}....${JSON.stringify(req.user)}`);
});

app.get("/auth/failed", (req, res) => {
  res.send("failed auth");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("logged out");
  //   res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
