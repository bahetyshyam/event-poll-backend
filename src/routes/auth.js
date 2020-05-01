import express from "express";
import passport from "passport";
var FacebookStrategy = require("passport-facebook").Strategy;
const router = express.Router();
import model from "../models";

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      const newUser = new model.user({
        name: profile.displayName,
      });
      const savedUser = await newUser.save();
      console.log(savedUser);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/failure" }),
  function (req, res) {
    res.redirect("/");
  }
);

router.get("/failure", (req, res) => {
  res.send("failure of auth");
});

router.get("/", (req, res) => {
  res.send("Hello World");
});

export default router;
