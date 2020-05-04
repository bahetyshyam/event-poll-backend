import express from "express";
const router = express.Router();
import models from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import isLoggedIn from "../middleware/isLoggedIn";

// import passport from "passport";
// var FacebookStrategy = require("passport-facebook").Strategy;
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

//Test api for if the user is logged in middleware
router.get("/", isLoggedIn, (req, res) => {
	res.send(req.user);
});

//Endpoint to register a new user
router.post("/register", async (req, res) => {
	const { error } = models.user.validateUser(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const emailExist = await models.user.findOne({ email: req.body.email });
	if (emailExist) {
		return res.status(400).send("User already exists");
	}

	//Hashing the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	const newUser = new models.user({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});

	try {
		const savedUser = await newUser.save();
		res.json({ success: true, user: savedUser });
	} catch (err) {
		res.status(400).send(err);
	}
});


//Endpoint to login a new user.
router.post("/login", async (req, res) => {
	const user = await models.user.findOne({ email: req.body.email });
	if (!user) {
		return res.status(401).send({ success: false, message: "User not found." });
	}

	const isValidPassword = await bcrypt.compare(
		req.body.password,
		user.password
	);

	if (!isValidPassword) {
		return res
			.status(401)
			.send({ success: false, message: "Invalid password." });
	} else {
		console.log("passwords are same");
	}

	//Assign Token
	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
	res.send({ auth: true, token });
});


// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       console.log(profile);
//       const newUser = new model.user({
//         name: profile.displayName,
//       });
//       const savedUser = await newUser.save();
//       console.log(savedUser);
//     }
//   )
// );

// router.get("/facebook", passport.authenticate("facebook"));

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/failure" }),
//   function (req, res) {
//     res.redirect("/");
//   }
// );

// router.get("/failure", (req, res) => {
//   res.send("failure of auth");
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       console.log(profile._json);
//       const user = new model.user({
//         email: profile._json.email,
//         name: profile._json.name,
//       });
//       const savedUser = user.save();
//       done(null, profile);
//     }
//   )
// );

// router.get('google',
// 	passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] }));

// router.get('google/callback',
// 	passport.authenticate('google', { successRedirect: "/", failureRedirect: '/login' }));


// router.get("/", (req, res) => {
// 	res.send("Success");
// });

export default router;
