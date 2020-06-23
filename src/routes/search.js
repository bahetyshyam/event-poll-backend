import express from "express";
import models from "../models";
const router = express.Router();

router.get("/:searchTerm", async (req, res) => {
    let searchTerm = req.params.searchTerm;
  
    try {
      const result = await models.user.find({name: {$regex: searchTerm, $options: "i"}})
      return res.status(200).send({
        success: true,
        users: result,
      });
    } catch(err) {
      return res.status(401).send({
        success: false,
        message: "No users found",
        error: err,
      });
    }
  })
  
  export default router;
