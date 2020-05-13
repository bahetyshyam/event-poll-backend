import express from "express";
import models from "../models";
import mongoose from "mongoose";
import User from "../models/User";
const router = express.Router();

//Endpoint to get all the users of a particular group
router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

    try {
        const result = await models.group.findById(groupId, 'members').populate('members');
        return res.status(200).send({
            success: true,
            members: result.members
        })
    }
    catch (err) {
        return res.status(401).send({
            success: false, message: "Group Not Found", error: err
        });
    }
});

//Endpoint to add a user as a member in a group
router.post('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    //Obtain the user id of the user which is searched
    const user_id = mongoose.Types.ObjectId(req.body._id);
  
  
    //try catch block to check if the member already exists in the particular group, if not, it returns a null object and 
    //moves the control over to the next try catch block
    try {
        const memberExists = await models.group.findOne({ _id: groupId, members: user_id });
        if (memberExists) {
            return res.status(400).send({
                success: false,
                message: "Member already exists"
            });
        }
    }
    catch (err) {
        return res.status(400).send({
            success: false,
            message: "Invalid group id or member id",
            error: err
        });
    }


    //try catch block to update the member in that group, if the group does not exist, it returns a null object
    try {
        const result = await models.group.findByIdAndUpdate(groupId,
            {
                $push: {
                    "members": user_id
                }
            });

        //checks if it returns a null object.
        if (result) {
            return res.status(200).send({ success: true, group: result });
        }
        else {
            return res.status(401).send({
                success: false, message: "Group Not Found"
            });
        }

    }
    catch (err) {
        return res.status(401).send({
            success: false, message: "Group Not Found", error: err
        });
    }
});


export default router;