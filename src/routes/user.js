import express from "express";
import models from "../models";
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

//addition of user endpoint comes here.



export default router;