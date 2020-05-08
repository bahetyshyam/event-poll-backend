import express from "express";
import isLoggedIn from "../middleware/isLoggedIn";
const router = express.Router();
import mongoose from 'mongoose';
import models from '../models';


//post api goes here
//send data in this format 
// {
// 	"name" : "Group 3",
// 	"members" : ["5eb07f71909d9a1df8195574","5eb07f7d909d9a1df8195575", "5eb07f8d909d9a1df8195576"]
// }

router.post('/', isLoggedIn, async (req, res) => {
    const groupName = req.body.name;
    const userId = mongoose.Types.ObjectId(req.user._id);

    const newGroup = new models.group({
        name: groupName,
        createdBy: userId,
        admins: [userId],
        members: req.body.members
    });

    try {
        const savedGroup = await newGroup.save();
        res.json({ success: true, group: savedGroup })
    }
    catch (err) {
        res.status(400).json({ success: false, error: err })
    }

})



export default router;