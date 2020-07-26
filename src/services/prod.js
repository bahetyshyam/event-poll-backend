import compression from "compression";
import helmet from "helmet";
import logger from "morgan";

export default function (app) {
  app.use(logger("common"));
  app.use(helmet());
  app.use(compression());
}
