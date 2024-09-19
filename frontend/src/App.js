import React, { useState, useEffect } from "react";
import './style.css';
const axios = require("axios");

function App() {
  const [questions, setQuestions] = useState(undefined);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(undefined);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0)
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [questionsAnswered, updateQuestionsAnswered] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // const [difficulty, setDifficulty] = useState(null); // New state for difficulty
  // const [isDifficultySelected, setIsDifficultySelected] = useState(false); // New state to toggle between pages


  const getQuestions = async () => {
    console.log("Entering getQuestions function");
    //if (!difficulty) return;
    try {
      //console.log("difficulty:" + difficulty);
      const response = await fetch("http://localhost:3001/getQuestion?");
      const data = await response.json();
      console.log("response: "+JSON.stringify(data[0]));
      //const data = await response.json();
      //console.log("data:" + data.results)

      if (Array.isArray(data)) {
        //console.log("data:" + data.results)
        setQuestions(data);
        setCurrentQuestionIndex(0);
        setShowPlayAgain(false);
      } else {
        console.error("Unexpected API response structure:");
      } 
      
    } catch (error) {
      console.error("Error fetching questions:", error);
    } 
    console.log("Finishing getQuestions function");
    console.log(questions);

  };
  useEffect(() => {
    getQuestions();
    console.log("1. Fetched questions")
  }, []);
  useEffect(() => {
    if (questions){
      setCurrentQuestion(questions[currentQuestionIndex])
      const question = questions[currentQuestionIndex];
      console.log("current question: "+question);
      setAnswers([...question.incorrectAnswers, question.correctAnswer].sort(() => Math.random() - 0.5));
    }
  }, [currentQuestionIndex])
  useEffect(() => {
    console.log("answers:" + answers);
  }, [answers]);

  // useEffect(() => {
  //   if (isDifficultySelected) {
  //     getQuestions();
  //   }
  // }, [isDifficultySelected, difficulty]);

  // useEffect(() => {
  //   if (questions.length==0) {
  //     setQuestions(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
  //   }
  // }, [questions]);

  // const handleDifficultySelection = (selectedDifficulty) => {
  //   setDifficulty(selectedDifficulty);
  //   setIsDifficultySelected(true);
  // };

  // if (!isDifficultySelected) {
  //   return (
  //     <div className="difficulty-selection">
  //       <h1>Select Difficulty</h1>
  //       <button onClick={() => handleDifficultySelection('easy')}>Easy</button>
  //       <button onClick={() => handleDifficultySelection('medium')}>Medium</button>
  //       <button onClick={() => handleDifficultySelection('hard')}>Hard</button>
  //     </div>
  //   );
  // }




  const handleAnswerClick = (answer) => {
    setUserAnswer(answer);
    setIsCorrect(answer === questions[currentQuestionIndex].correctAnswer);
    updateQuestionsAnswered(questionsAnswered + 1);
    if (answer === questions[currentQuestionIndex].correctAnswer){
      setScore(score+1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setUserAnswer(null);
      setIsCorrect(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions have been answered

      setHighScores(prevScores => [...prevScores, score]);
      setShowPlayAgain(true);
      setScore(0);
      setUserAnswer(null);
      updateQuestionsAnswered(0);
    }
  };

  const printHighScores = () => {
    return (
      <ul>
        {highScores.map((score, index) => (
          <li key={index}>{score}</li>
        ))}
      </ul>

    );
  }


  const playAgain = () => {
    //setIsDifficultySelected(false);
    getQuestions();
  };

  if (showPlayAgain) {
    return (
      <div className="high-scores">
        <h1>Quiz App</h1>
        <h3>High Scores:</h3>
        
        {printHighScores()}
        
        <p>You've answered all the questions. Do you want to play again?</p>
        <button onClick={playAgain}>Play Again</button>
      </div>
    );
  }
  function clean(input){
    const regex = /[^a-zA-Z\s]/g;
    const cleanedString = input.toString().replace(regex, '');
    return cleanedString.replace(/quot/gi, '');
  }


  return (
    <div className="App">
      <h1>Quiz App</h1>
      { <h2>{currentQuestion ? currentQuestion.question.text : ""}</h2>  }
      <div>

        {answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(answer)}
            disabled={userAnswer !== null} 
          >
            {answer}
          </button>
        ))}
  
      </div>
      <div>
        <button
          onClick={nextQuestion}
          disabled={userAnswer === null} 
        >
          Next
        </button>
      </div>
      {userAnswer && (
        <div>
          <p>You selected: {userAnswer}</p>
          <p>{isCorrect ? "Correct!" : "Incorrect. The correct answer was "+currentQuestion.correctAnswer}</p>

        </div>
      )}
      <h2>
        {score} / {questionsAnswered} Correct
      </h2>

    </div>
  );
}

export default App;
