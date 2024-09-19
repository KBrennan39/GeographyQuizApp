const express = require("express");
const cors = require("cors");
const axios = require("axios");
//const mongoose = require('mongoose');
const scoresRouter = require('./routes/scores');

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

        const response = {"response_code":0,"results":[{"type":"multiple","difficulty":"medium","category":"Geography","question":"On which continent is the country of Angola located?","correct_answer":"Africa","incorrect_answers":["South America","Europe","Asia"]},{"type":"multiple","difficulty":"hard","category":"Geography","question":"Which of these is NOT a province in China?","correct_answer":"Yangtze","incorrect_answers":["Fujian","Sichuan","Guangdong"]},{"type":"multiple","difficulty":"medium","category":"Geography","question":"The historical city Timbuktu is located in which West African country?","correct_answer":"Mali","incorrect_answers":["Senegal","Niger","Burkina Faso"]},{"type":"multiple","difficulty":"easy","category":"Geography","question":"Which of the following Japanese islands is the biggest?","correct_answer":"Honshu","incorrect_answers":["Hokkaido","Shikoku","Kyushu"]},{"type":"multiple","difficulty":"hard","category":"Geography","question":"Which of these cities has a 4&deg; East longitude. ","correct_answer":"Amsterdam","incorrect_answers":["Rio de Janero","Toronto","Hong Kong"]},{"type":"multiple","difficulty":"easy","category":"Geography","question":"Which of these is NOT an Australian state or territory?","correct_answer":"Alberta","incorrect_answers":["New South Wales","Victoria","Queensland"]},{"type":"multiple","difficulty":"medium","category":"Geography","question":"What is the busiest port in Europe?","correct_answer":"Port of Rotterdam","incorrect_answers":["Port of Antwerp","Port of Hamburg","Port of Amsterdam"]},{"type":"multiple","difficulty":"hard","category":"Geography","question":"What is the name of the Canadian national anthem?","correct_answer":"O Canada","incorrect_answers":["O Red Maple","Leaf-Spangled Banner","March of the Puck Drop"]},{"type":"multiple","difficulty":"easy","category":"Geography","question":"What state is the largest state of the United States of America?","correct_answer":"Alaska","incorrect_answers":["California","Texas","Washington"]},{"type":"multiple","difficulty":"medium","category":"Geography","question":"The World Health Organization headquarters is located in which European country?","correct_answer":"Switzerland","incorrect_answers":["United Kingdom","France","Belgium"]}]};
        
        res.json(response);
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


