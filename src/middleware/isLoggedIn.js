import jwt from "jsonwebtoken";

export default function isLoggedIn(req, res, next) {
  let token = req.get("Authorization");
  if (!token) {
    return res
      .status(401)
      .send({ success: false, message: "You need to be logged in." });
  }

  //The token comes in the format 'Bearer token', hence we split it
  token = token.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res
      .status(400)
      .send({ success: false, message: "Invalid auth credentials." });
  }
}
