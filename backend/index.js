const express = require("express");
const cors = require("cors");
const axios = require("axios");


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); 



app.get("/getQuestion", async (req, res) =>{

    const desiredCategory = "geography";
    const desiredQuestionCount = 10;
    let geographyQuestions = [];
    try{
        while (geographyQuestions.length < desiredQuestionCount) {
            const response = await axios.get('https://the-trivia-api.com/v2/questions');
            for (const question of response.data) {
                console.log("Question Category:", question.category);
                
                if (question.category && question.category.toLowerCase() === desiredCategory.toLowerCase()) {
                    geographyQuestions.push(question);
                }
                if (geographyQuestions.length >= desiredQuestionCount) {
                    break;
                }
            }
        }

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
        res.status(500).json({ error: "An error occurred while getting question" });
    }
})

app.listen(port, () => {
    console.log("server is running on port 3001");
});


