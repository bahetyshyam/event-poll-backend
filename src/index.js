import "core-js/stable";
import "regenerator-runtime/runtime";

import "dotenv/config";
import cors from "cors";
import express from "express";
import connectDb from "./services/connectDb";
import prod from "./services/prod";
import routes from "./services/routes";
import passport from "passport";

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.use(passport.initialize());

if (process.env.NODE_ENV === "production") prod(app);
routes(app);

connectDb()
  .then(async () => {
    console.log("Connected to db");

    //Run server once the db is connected.
    app.listen(port, () => console.log(`App running on port ${port}`));
  })
  .catch((e) => {
    console.log("Error Connecting to the db. Can't start server");
    console.log(e);
  });
