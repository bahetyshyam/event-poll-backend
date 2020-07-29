import express from "express";
import mongoose, { model } from "mongoose";
import models from "../models";
import isLoggedIn from "../middleware/isLoggedIn";
const router = express.Router();

//get api goes here
router.get("/", isLoggedIn, async (req, res) => {
  const userId = req.user._id;

  try {
    const result = await models.group.find({ members: userId });
    return res.status(200).send({
      success: true,
      groups: result,
    });
  } catch (err) {
    return res.status(401).send({
      success: false,
      message: "Groups Not Found",
      error: err,
    });
  }
});

//post api goes here
//send data in this format
// {
// 	"name" : "Group 3",
// 	"members" : ["5eb07f71909d9a1df8195574","5eb07f7d909d9a1df8195575", "5eb07f8d909d9a1df8195576"]
// }

router.post("/", isLoggedIn, async (req, res) => {
  const groupName = req.body.name;
  const userId = mongoose.Types.ObjectId(req.user._id);

  const newGroup = new models.group({
    name: groupName,
    createdBy: userId,
    admins: [userId],
    members: req.body.members,
  });

  try {
    const savedGroup = await newGroup.save();
    res.json({ success: true, group: savedGroup });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
});

router.delete("/:groupId", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  try {
    const deletedGroup = await models.group.deleteOne({
      _id: req.params.groupId,
      admins: userId,
    });
    if (deletedGroup.n === 0) {
      res.status(401).json({
        success: false,
        message: "Unautorized access, you are not an admmin if this group",
      });
    } else {
      //Block to delete the events and repsonses of the events present in the group
      const deletedEvents = await models.event.deleteMany({
        group: req.params.groupId,
      });
      const deletedResponses = await models.response.deleteMany({
        group: req.params.groupId,
      });
      res.json({
        success: true,
        deletedGroup,
        deletedEvents,
        deletedResponses,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
});

export default router;
