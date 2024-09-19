import React, { useState, useEffect, useRef } from "react";
import './style.css';
const axios = require("axios");

function App() {
  const [questions, setQuestions] = useState(undefined);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(undefined);
  const [userAnswer, setUserAnswer] = useState(null);
  const [computerAnswer, setComputerAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0)
  const [computerScore, setComputerScore] = useState(0);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [questionsAnswered, updateQuestionsAnswered] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);
  const [gameType, setGameType] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [timerWidth, setTimerWidth] = useState("100%");



  useEffect(() => {
    if (timeLeft > 0 && !userAnswer) {

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTimeLeft = prev - 1;
          setTimerWidth(`${(newTimeLeft / 15) * 100}%`); // Update width immediately
          return newTimeLeft;
        });
      }, 1000);

    } else {
      clearInterval(timerRef.current);
      if (timeLeft === 0) {
        // Treat time running out as an incorrect answer
        
        computerResponse();
        setUserAnswer(null);
        setTimerWidth("0%");
        setIsCorrect(false);
        updateQuestionsAnswered(questionsAnswered + 1);
      }
    }

    return () => clearInterval(timerRef.current); // Cleanup timer on component unmount
  }, [timeLeft, userAnswer]);

  const getQuestions = async () => {
    console.log("Entering getQuestions function");
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/getQuestion`);

      const data = await response.json();
      console.log("response: "+JSON.stringify(data[0]));


      if (Array.isArray(data)) {
        setQuestions(data);
        setCurrentQuestionIndex(0);
        setShowPlayAgain(false);
      } else {
        console.error("Unexpected API response structure:");
      } 
      
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
    console.log("Finishing getQuestions function");
    console.log(questions);

  };
  const renderTimerBar = () => (
    <div className="timer-bar-container">
      <div className="timer-bar" style={{ width: timerWidth }} />
    </div>
  );
  const renderLoadingPage = () => (
    <div className="loading-page">
      <h2>Loading questions...</h2>
    </div>
  );
  useEffect(() => {
    if (gameType) {
      getQuestions();
    }
    console.log("1. Fetched questions")
  }, [gameType]);
  useEffect(() => {
    if (questions && currentQuestionIndex !== undefined){
      setCurrentQuestion(questions[currentQuestionIndex])
      const question = questions[currentQuestionIndex];
      console.log("current question: "+question);
      setAnswers([...question.incorrectAnswers, question.correctAnswer].sort(() => Math.random() - 0.5));
      setTimeLeft(15);
      setUserAnswer(null); // Reset user answer when loading a new question
      setIsCorrect(null);
      setComputerAnswer(null);
      setTimerWidth("100%");
    }
  }, [currentQuestionIndex, questions])
  useEffect(() => {
    console.log("answers:" + answers);
  }, [answers]);





  const handleAnswerClick = (answer) => {
    setUserAnswer(answer);
    setIsCorrect(answer === questions[currentQuestionIndex].correctAnswer);
    updateQuestionsAnswered(questionsAnswered + 1);
    if (answer === questions[currentQuestionIndex].correctAnswer){
      setScore(score+1);
    }
    //const randomIndex = Math.floor(Math.random() * answers.length);
    if (gameType==="Computer Opponent"){
      computerResponse();
    }
  };
  const computerResponse = () => {
    let computerAnswerList = [];
    if (questions[currentQuestionIndex].difficulty==="easy"){
      computerAnswerList = [
        ...answers,
        ...Array(8).fill(questions[currentQuestionIndex].correctAnswer)
      ];
    } else if (questions[currentQuestionIndex.difficulty === "medium"]){
      computerAnswerList = [
        ...answers,
        ...Array(5).fill(questions[currentQuestionIndex].correctAnswer)
      ];
    } else {
      computerAnswerList = [
        ...answers,
        ...Array(2).fill(questions[currentQuestionIndex].correctAnswer)
      ];
    }
    const randomIndex = Math.floor(Math.random() * computerAnswerList.length);
    const randomAnswer = computerAnswerList[randomIndex];
    setComputerAnswer(randomAnswer);

    if (randomAnswer === questions[currentQuestionIndex].correctAnswer) {
      setComputerScore(computerScore + 1);
    }
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setUserAnswer(null);
      setIsCorrect(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(15);
      setTimerWidth("100%");
    } else {
      // All questions have been answered
      setHighScores(prevScores => {
        const updatedScores = [...prevScores, score];
        
        return updatedScores
          .sort((a, b) => b - a) // Sort in descending order
          .slice(0, 3); // Keep only the top 3 scores
      });
      setShowPlayAgain(true);


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
    setGameType(null);
    setShowPlayAgain(false);

    updateQuestionsAnswered(0);
    setCurrentQuestionIndex(0);
    updateQuestionsAnswered(0);
    setScore(0);
    setComputerScore(0);
    setUserAnswer(null);
    setTimeLeft(15);
    setTimerWidth("100%");
    
  };

  if (showPlayAgain) {

    return (
      <div className="high-scores">
        <h1>Results...</h1>
        {gameType === "Computer Opponent" ? (
          <div>
            {score > computerScore ? (
              <div>
                <h3>You won!</h3>
                <p>Your score: <b style={{color: 'green'}}>{score}</b></p>
                <p>Computer's score: <b style={{color: 'red'}}>{computerScore}</b></p>
              </div>
            ) : score < computerScore ? (
              <div>
                <h3>You lost!</h3>
                <p>Your score: <b style={{color: 'red'}}>{score}</b></p>
                <p>Computer's score: <b style={{color: 'green'}}>{computerScore}</b></p>
              </div>
            ) : (
              <div>
                <h3>It's a tie!</h3>
                <p>Your score: {score}</p>
                <p>Computer's score: {computerScore}</p>
              </div>
            )}
          </div>
        ) : (
          <p>Your score: <b style={{color: 'green'}}>{score}</b></p>
        )}
        <h2>High Scores:</h2>
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


  const renderSinglePlayerGame = () => {

    return(
      <div className="App">
        <h2>Single Player Game</h2>
        
        { <h2 className="question">{currentQuestion ? currentQuestion.question.text : ""}</h2>  }
        {renderTimerBar()}
        {<h3>Difficulty: {currentQuestion ? currentQuestion.difficulty : ""} | Time Left: {timeLeft}s</h3>}

        <div>

          {answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(answer)}
              disabled={userAnswer !== null || timeLeft === 0} 
            >
              {answer}
            </button>
          ))}
      
        </div>
        <div>
          <button
            onClick={nextQuestion}
            disabled={userAnswer === null && timeLeft > 0} 
          >
            Next
          </button>
        </div>
        {userAnswer && (
          <div>
            <p>You selected: {isCorrect ? <b style={{ color: 'green'}}>{userAnswer}</b> : <b style={{ color: 'red'}}>{userAnswer}</b>}</p>
            <p>Correct answer: <b style={{ color: 'green'}}>{currentQuestion.correctAnswer}</b></p>
          
          </div>
            
        )}
        {timeLeft === 0 && (
          <div>
            <p>Time's up!</p>
            <p style={{ marginTop: '20px' }}>Correct answer: <b style={{ color: 'green'}}>{currentQuestion.correctAnswer}</b></p>

          </div>
        )}
 
        <h2>User Score: {score>0&&questionsAnswered>0 ? <b style={{ color: 'green'}}>{score}</b> : <b style={{ color: 'red'}}>{score}</b>} <b>/ {questionsAnswered}</b> correct</h2>

        <h3>Time Left: {timeLeft}s</h3>
      </div>
    );
  };
  const renderComputerOpponentGame = () => (
    <div className="App">
      <h2>User vs Computer</h2>
      <h2 className="question">{currentQuestion ? currentQuestion.question.text : ""}</h2>
      {renderTimerBar()}
      {<h3>Difficulty: {currentQuestion ? currentQuestion.difficulty : ""} | Time Left: {timeLeft}s</h3>}
      <div>
        {answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(answer)}
            disabled={userAnswer !== null || timeLeft === 0}
          >
            {answer}
          </button>
        ))}
      </div>
      <div>
        <button
          onClick={nextQuestion}
          disabled={userAnswer === null && timeLeft > 0}
        >
          Next
        </button>
      </div>
      {userAnswer && (
        <div>
          <p>You selected: {isCorrect ? <b style={{ color: 'green'}}>{userAnswer}</b> : <b style={{ color: 'red'}}>{userAnswer}</b>}</p>
          <p>Computer selected: <b>{computerAnswer}</b></p>
          <p>Correct answer: <b style={{ color: 'green'}}>{currentQuestion.correctAnswer}</b></p>
          

        </div>
      )}
      {timeLeft === 0 && (
        <div>
          <p>Time's up!</p>
          <p style={{ marginTop: '20px' }}>Computer selected: <b>{computerAnswer}</b></p>
          <p >Correct answer: <b style={{ color: 'green'}}>{currentQuestion.correctAnswer}</b></p>

        </div>
      )}
      <h2>User Score: {score>0&&questionsAnswered>0 ? <b style={{ color: 'green'}}>{score}</b> : <b style={{ color: 'red'}}>{score}</b>} <b>/ {questionsAnswered}</b> correct</h2>
      <h2>Computer Score: {computerScore>0&&questionsAnswered>0 ? <b style={{ color: 'green'}}>{computerScore}</b> : <b style={{ color: 'red'}}>{computerScore}</b>} <b>/ {questionsAnswered}</b> correct</h2>

      
    </div>
  );
  return (
    <div className="App">
      <h1 style={{ color:'#6cc0ae' }}>Geography Trivia</h1>
      
      
      {loading ? (
      renderLoadingPage()) : !gameType ? (

        <>
          <p style={{ marginBottom: '30px'}}><b>Directions:</b> For each round, you will be given 10 questions which you have 15 seconds each to answer. You can choose to play by yourself or against a computer opponent. The questions get harder as you go, so good luck! Check the leaderboard at the end to see your progress!</p>

          <button onClick={() => setGameType("Single Player")}>Single Player</button>
          <button onClick={() => setGameType("Computer Opponent")}>Play Against Computer</button>
        </>
      ) : (
        <>
          {gameType === "Single Player" ? renderSinglePlayerGame() : renderComputerOpponentGame()}
        </>
      )}
      
    </div>
  );
}

export default App;

