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

    const result = await models.event
      .find({ group: group_ids })
      .populate("group");

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
  const userId = mongoose.Types.ObjectId(req.userId);

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

export default router;
