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

    const desiredCategory = "geography";
    const desiredQuestionCount = 1;
    let geographyQuestions = [];
    console.log("hi");
    try{




        while (geographyQuestions.length < desiredQuestionCount) {
            //print("hi");
            const response = await axios.get('https://the-trivia-api.com/v2/questions');
            for (const question of response.data) {
                // Log the category for each question
                console.log("Question Category:", question.category);
                
                // Check if the category matches and add to the list
                if (question.category && question.category.toLowerCase() === desiredCategory.toLowerCase()) {
                    geographyQuestions.push(question);
                    //print(question);
                }

                // Break the loop if we have enough questions
                if (geographyQuestions.length >= desiredQuestionCount) {
                    break;
                }
            }
        }

        // If we have more than the desired number of questions, slice the array
        geographyQuestions = geographyQuestions.slice(0, desiredQuestionCount);
        geographyQuestions.sort((a, b) => {
            const difficultyOrder = {
                'easy': 1,
                'medium': 2,
                'hard': 3
            };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
        res.json(geographyQuestions);
        console.log(geographyQuestions);
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


