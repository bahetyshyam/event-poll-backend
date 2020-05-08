import express from "express";
import mongoose from "mongoose";
import models from "../models";
const router = express.Router();


//get api goes here
router.get('/:userId', async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.params.userId);
    
    try {
        const result = await models.group.find({members: userId}, 'name');
        console.log(result);
        return res.status(200).send({
            success: true,
            name: result
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