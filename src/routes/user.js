import express from "express";
import models from "../models";
import mongoose from "mongoose";
import isLoggedIn from "../middleware/isLoggedIn";
// import { async } from "regenerator-runtime";
const router = express.Router();

//Endpoint to get all the users of a particular group
router.get("/:groupId", isLoggedIn, async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const result = await models.group.findById(groupId).populate("members");
    return res.status(200).send({
      success: true,
      members: result.members,
      admins: result.admins,
    });
  } catch (err) {
    return res.status(401).send({
      success: false,
      message: "Group Not Found",
      error: err,
    });
  }
});

//Endpoint to add a user as a member in a group
router.post("/:groupId", isLoggedIn, async (req, res) => {
  const groupId = req.params.groupId;
  //Obtain the user id of the user which is searched
  const user_id = mongoose.Types.ObjectId(req.body._id);

  //try catch block to check if the member already exists in the particular group, if not, it returns a null object and
  //moves the control over to the next try catch block
  try {
    const memberExists = await models.group.findOne({
      _id: groupId,
      members: user_id,
    });
    if (memberExists) {
      return res.status(400).send({
        success: false,
        message: "Member already exists",
      });
    }
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: "Invalid group id or member id",
      error: err,
    });
  }

  //try catch block to update the member in that group, if the group does not exist, it returns a null object
  try {
    const result = await models.group.findByIdAndUpdate(groupId, {
      $push: {
        members: user_id,
      },
    });

    //checks if it returns a null object.
    if (result) {
      return res.status(200).send({ success: true, group: result });
    } else {
      return res.status(401).send({
        success: false,
        message: "Group Not Found",
      });
    }
  } catch (err) {
    return res.status(401).send({
      success: false,
      message: "Group Not Found",
      error: err,
    });
  }
});

router.patch("/:groupId/updateAdmin", isLoggedIn, async (req, res) => {
  const currentUserId = req.user._id;
  let updateBody;
  if (req.body.type === "add") {
    updateBody = {
      $push: {
        admins: req.body.userId,
      },
    };
  }
  if (req.body.type === "remove") {
    updateBody = {
      $pull: {
        admins: req.body.userId,
      },
    };
  }
  try {
    const updatedGroup = await models.group.findOneAndUpdate(
      {
        _id: req.params.groupId,
        admins: currentUserId,
      },
      updateBody,
      {
        new: true,
      }
    );
    if (updatedGroup === null) {
      res.status(401).json({
        success: false,
        message: "Unautorized access, you are not an admmin if this group",
      });
    }
    res.json({
      success: true,
      updatedGroup,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
});

// router.get("search/:searchTerm", async (req, res) => {
//   let searchTerm = req.params.searchTerm;

//   try {
//     const result = User.find({name: {$regex: "/" + searchTerm + "/", $options: "i"}})
//     return res.status(200).send({
//       success: true,
//       users: result,
//     });
//   } catch(err) {
//     return res.status(401).send({
//       success: false,
//       message: "No users found",
//       error: err,
//     });
//   }
// })

export default router;
