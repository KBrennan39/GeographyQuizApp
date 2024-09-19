const express = require("express");
const cors = require("cors");
const axios = require("axios");
//const mongoose = require('mongoose');
//const scoresRouter = require('./routes/scores');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); 



app.get("/getQuestion", async (req, res) =>{
    // const { difficulty } = req.query.toString();

    // const validDifficulties = ['easy', 'medium', 'hard'];
    // if (!validDifficulties.includes(difficulty)) {
    //     return res.status(400).json({ error: "Invalid difficulty level" });
    // }
    try{

        const response = await axios.get('https://opentdb.com/api.php?amount=10&category=22&type=multiple')
        res.json(response.data);
        console.log(response);
    }
    catch (error){
        console.error("Error making API request:", error.message || error);

        // If the error has a response property, log more details
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Headers:", error.response.headers);
            console.error("Response Data:", error.response.data);
        } else if (error.request) {
            console.error("Request Data:", error.request);
        }
        res.status(500).json({ error: "An error occurred while getting question" });
    }
})

app.listen(port, () => {
    console.log("server is running on port 3001");
});


