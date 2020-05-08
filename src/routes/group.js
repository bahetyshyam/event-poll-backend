import express from "express";
const router = express.Router();


//get api goes here
router.get('/', (req, res) => {
    res.send("hello world")
})

//post api goes here



export default router;