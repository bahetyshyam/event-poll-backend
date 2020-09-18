import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import models from "../models";
import isLoggedIn from "../middleware/isLoggedIn";

//Events GET API to extract events from groups that a user is in
router.get("/", isLoggedIn, async (req, res) => {
  const userId = req.user._id;

  try {
    const groups = await models.group.find({ members: userId });
    const group_ids = groups.map((g) => g._id);

    const result = await models.event.aggregate([
      { $match: { group: { $in: group_ids } } },
      { $sort: { schedule: -1 } },
      {
        $lookup: {
          from: "responses",
          localField: "_id",
          foreignField: "event",
          as: "responses",
        },
      },
      {
        $lookup: {
          from: "groups",
          localField: "group",
          foreignField: "_id",
          as: "group",
        },
      },
    ]);

    // const result = await models.event
    //   .find({ group: group_ids })
    //   .populate("group");

    return res.status(200).send({
      success: true,
      events: result,
    });
  } catch (err) {
    return res.status(401).send({
      success: false,
      message: "User Not Found",
      error: err,
    });
  }
});

//Events get API to a single event information
router.get("/:eventId", isLoggedIn, async (req, res) => {
  try {
    const event = await models.event.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(req.params.eventId) },
      },
      {
        $lookup: {
          from: "responses",
          localField: "_id",
          foreignField: "event",
          as: "responses",
        },
      },
      {
        $unwind: {
          path: "$responses",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "responses.user",
          foreignField: "_id",
          as: "responses.user",
        },
      },
      {
        $group: {
          _id: "$_id",
          responses: { $push: "$responses" },
          name: { $first: "$name" },
          schedule: { $first: "$schedule" },
          location: { $first: "$location" },
          description: { $first: "$description" },
          createdBy: { $first: "$createdBy" },
          group: { $first: "$group" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
    ]);

    res.send({
      success: true,
      event: event,
    });
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "No such event found",
      error: error,
    });
  }
});

//Format to send the data to this api
// {
// 	"name" : "Event 3",
// 	"schedule" : "2020-05-16T11:02:14+00:00",
// 	"latitude" : 12.972442,
// 	"longitude" : 77.580643,
// 	"locationName" : "Bengaluru, India",
// 	"description" : "This is a test event",
// 	"group" : "5eb5764614fac40cd4187e57"
// }
router.post("/", isLoggedIn, async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user._id);

  let schedule = new Date(req.body.schedule);

  const newEvent = new models.event({
    name: req.body.name,
    schedule: schedule,
    location: {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      locationName: req.body.locationName,
    },
    description: req.body.description,
    createdBy: userId,
    group: mongoose.Types.ObjectId(req.body.group),
  });

  try {
    const savedEvent = await newEvent.save();
    res.json({ success: true, event: savedEvent });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
});

//Update the reponse of a particular user for a particular
router.patch("/:eventId/:groupId/:response", isLoggedIn, async (req, res) => {
  try {
    const response = await models.response.updateOne(
      {
        event: req.params.eventId,
        user: req.user._id,
        group: req.params.groupId,
      },
      {
        $set: {
          response: req.params.response,
        },
      },
      { upsert: true }
    );
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Invalid Input",
      error: error,
    });
  }
  res.send({
    success: true,
    message: "Response Updated",
  });
});

router.delete("/:eventId", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  try {
    const event = await models.event.findById(
      mongoose.Types.ObjectId(req.params.eventId)
    );
    if (userId.toString() === event.createdBy.toString()) {
      const deletedResponses = await models.response.deleteMany({
        event: req.params.eventId,
      });
      const deletedEvent = await models.event.deleteOne({
        _id: req.params.eventId,
      });

      res.json({
        success: true,
        deletedResponses,
        deletedEvent,
      });
    } else {
      res.status(401).json({
        success: false,
        message:
          "You have to be the creator of this event to delete the event.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An Error Occured",
      error: error,
    });
  }
});

export default router;
