import express from "express";
import dotenv from "dotenv";
require("dotenv/config");
const router = express.Router();

const User = require('../models/User');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

dotenv.config();
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

router.get("/", (req, res) => {
  res.send("Hello World");
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
  (accessToken, refreshToken, profile, done) => {
    console.log(profile._json)
     const user = new User({email: profile._json.email, name: profile._json.name});
     const savedUser = user.save();
     done(null, profile);
}
));

export default router;
