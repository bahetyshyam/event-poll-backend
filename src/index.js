import "dotenv/config";
import cors from "cors";
import express from "express";
import connectDb from "./services/connectDb";
import routes from "./services/routes";
import passport from "passport";

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.use(passport.initialize());

routes(app);

connectDb()
  .then(async () => {
    console.log("Connceted to db");

    //Run server once the db is connected.
    app.listen(port, () => console.log("App running on port 3000"));
  })
  .catch((e) => {
    console.log("Error Connecting to the db. Can't start server");
    console.log(e);
  });
