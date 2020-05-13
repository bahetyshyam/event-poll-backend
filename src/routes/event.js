import express from "express";
const router = express.Router();

import mongoose from "mongoose";
import models from "../models";
import isLoggedIn from "../middleware/isLoggedIn";


//Events GET API to extract events from groups that a user is in
router.get('/', isLoggedIn, async (req, res) => {
    const userId = req.user._id;

    try {
        const groups = await models.group.find({members: userId});
        const group_ids = groups.map(g => g._id);

        const result = await models.event.find({group: group_ids});

        return res.status(200).send({
            success: true,
            events: result
        })
    }
    catch (err) {
        return res.status(401).send({
            success: false, message: "User Not Found", error: err
        });
    }
})

export default router;