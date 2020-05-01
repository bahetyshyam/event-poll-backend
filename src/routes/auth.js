import express from "express";
import passport from "passport";
var FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const router = express.Router();
const User = require("../models/User");
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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile._json);
      const user = new model.user({
        email: profile._json.email,
        name: profile._json.name,
      });
      const savedUser = user.save();
      done(null, profile);
    }
  )
);

router.get("/", (req, res) => {
  res.send("Hello World");
});

export default router;
