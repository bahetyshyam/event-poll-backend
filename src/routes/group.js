import express from "express";
import mongoose from "mongoose";
import models from "../models";
import isLoggedIn from "../middleware/isLoggedIn";
const router = express.Router();


//get api goes here
router.get('/', isLoggedIn, async (req, res) => {
    const userId = req.user._id;

    try {
        const result = await models.group.find({members: userId});
        return res.status(200).send({
            success: true,
            groups: result
        })
    }
    catch (err) {
        return res.status(401).send({
            success: false, message: "User Not Found", error: err
        });
    }
})

//post api goes here



export default router;