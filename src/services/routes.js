import bodyParser from "body-parser";
import auth from "../routes/auth";
import users from "../routes/user";
import group from "../routes/group";
import event from "../routes/event";
import search from '../routes/search';

export default function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req, res) => res.send("Hello World"));
  app.use("/api/auth", auth);
  app.use("/api/user", users);
  app.use("/api/group", group);
  app.use("/api/event", event);
  app.use("/api/search", search);

  app.all("*", (req, res) => {
    res.status(404).send({ success: false, message: "Endpoint not found." });
  });
}
