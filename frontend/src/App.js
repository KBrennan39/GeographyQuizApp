import React, { useState, useEffect } from "react";
import './style.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0)
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [questionsAnswered, updateQuestionsAnswered] = useState(0);
  const [answers, setAnswers] = useState([]);

  // const [difficulty, setDifficulty] = useState(null); // New state for difficulty
  // const [isDifficultySelected, setIsDifficultySelected] = useState(false); // New state to toggle between pages


  const getQuestions = async () => {
    console.log("Entering getQuestions function");
    //if (!difficulty) return;
    try {
      const response = await fetch("http://localhost:3001/getQuestion");

      console.log("response: "+response);
      const data = await response.json();
      console.log("data:" + data.results)

      if (Array.isArray(data.results)) {
        console.log("data:" + data.results)
        setQuestions(data.results);
        setCurrentQuestionIndex(0);
        setShowPlayAgain(false);
      } else {
        console.error("Unexpected API response structure:", data);
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
    setIsCorrect(answer === questions[currentQuestionIndex].correct_answer);
    updateQuestionsAnswered(questionsAnswered + 1);
    if (answer === questions[currentQuestionIndex].correct_answer){
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
  const question = questions[currentQuestionIndex];
  //setAnswers([...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5));


  return (
    <div className="App">
      <h1>Quiz App</h1>
      {/* <h2>{clean(question.question)}</h2>  */}
      {/* {score === 0 ? <h3> zero </h3>:<h3> not zero</h3>} */}
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
          <p>{isCorrect ? "Correct!" : "Incorrect. The correct answer was "+question.correct_answer}</p>

        </div>
      )}
      <h2>
        {score} / {questionsAnswered} Correct
      </h2>

    </div>
  );
}

export default App;
