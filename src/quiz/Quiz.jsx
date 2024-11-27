import React, { useState, useEffect } from "react";
import { questions } from "../questions"; // Import your questions array
import "./quiz.scss";
import video1 from "../videos/0.2point.mp4";
import video2 from "../videos/5point.mp4";
import video3 from "../videos/10point.mp4";
import video4 from "../videos/15point.mp4";
import video5 from "../videos/20point.mp4";

// Utility function to shuffle an array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const Quiz = () => {
  const [questionSet, setQuestionSet] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [fiftyUsed, setFiftyUsed] = useState(false); // Track if 50/50 lifeline is used
  const [showAudiencePoll, setShowAudiencePoll] = useState(false); // Track if audience poll is shown
  const [audienceUsed, setAudienceUsed] = useState(false); // Track if "Ask the Audience" is used
  const [visibleAnswers, setVisibleAnswers] = useState([1, 2, 3, 4]); // Track visible answers for 50/50
  const [score, setScore] = useState(0); // Track the score

  // Function to initialize the quiz with 10 random questions
  const initializeQuiz = () => {
    const shuffledQuestions = shuffleArray([...questions]); // Shuffle and clone the array
    setQuestionSet(shuffledQuestions.slice(0, 23)); // 
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsQuizCompleted(false);
    setFiftyUsed(false); // Reset 50/50 lifeline usage
    setShowAudiencePoll(false); // Reset audience poll visibility
    setAudienceUsed(false); // Reset "Ask the Audience" usage
    setVisibleAnswers([1, 2, 3, 4]); // Reset visible answers for 50/50
    setScore(0); // Reset score to 0
  };

  useEffect(() => {
    initializeQuiz(); // Initialize quiz when component mounts
  }, []);

  const currentQuestion = questionSet[currentQuestionIndex];

  const handleAnswerClick = (answerNumber) => {
    if (isAnswered) return;
    setSelectedAnswer(answerNumber);
    setIsAnswered(true);

    // Award point if the answer is correct
    if (answerNumber === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questionSet.length) {
      setSelectedAnswer(null);
      setIsAnswered(false);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setShowAudiencePoll(false); // Hide audience poll for the next question
      setVisibleAnswers([1, 2, 3, 4]); // Reset visible answers for the next question
    } else {
      setIsQuizCompleted(true); // Mark the quiz as completed
    }
  };

  const handleRestartQuiz = () => {
    initializeQuiz(); // Restart the quiz with a new set of random questions
  };

  // 50/50 Lifeline: Hide all but two answers based on the question's `fifty` array
  const handleFiftyFifty = () => {
    if (fiftyUsed || isAnswered) return;
    setVisibleAnswers(currentQuestion.fifty); // Keep only the two allowed answers visible
    setFiftyUsed(true); // Mark 50/50 as used
  };

  // Function to show the audience poll and disable the button
  const handleShowAudiencePoll = () => {
    setShowAudiencePoll(true);
    setAudienceUsed(true); // Mark audience lifeline as used
  };

  const getAnswerClass = (answerNumber) => {
    if (!isAnswered) return "answer-button";
    if (answerNumber === currentQuestion.correct) {
      return "answer-button correct";
    }
    if (
      answerNumber === selectedAnswer &&
      answerNumber !== currentQuestion.correct
    ) {
      return "answer-button incorrect";
    }
    return "answer-button";
  };

  const isAnswerHidden = (answerNumber) =>
    !visibleAnswers.includes(answerNumber);

  // Get the appropriate video based on the score
  const getVideoForScore = () => {
    if (score >= 0 && score <= 4) {
      return (
        <div className="video">
          <video src={video1} width="100%" height="100%" controls></video>
        </div>
      );
    } else if (score >= 5 && score <= 9) {
      return (
        <div className="video">
          <video src={video2} width="100%" height="100%" controls></video>
        </div>
      );
    } else if (score >= 10 && score <= 14) {
      return (
        <div className="video">
          <video src={video3} width="100%" height="100%" controls></video>
        </div>
      );
    } else if (score >= 15 && score <= 19) {
      return (
        <div className="video">
          <video src={video4} width="100%" height="100%" controls></video>
        </div>
      );
    } else if (score === 20) {
      return (
        <div className="video">
          <video src={video5} width="100%" height="100%" controls></video>
        </div>
      );
    }
  };

  return (
    <div className="quiz-container">
      {/* Display score in the top-right corner */}
      <div className="score-container">
        <p> Hashiv : {score}</p>
      </div>

      {isQuizCompleted ? (
        <div className="quiz-end">
          <h2>Shnorhavorum em! .</h2>
          <p>Your Score: {score} / 20</p>

          {/* Show the video based on the score */}
          {getVideoForScore()}

          <button className="restart-button" onClick={handleRestartQuiz}>
            Mi hatel 
          </button>
        </div>
      ) : (
        currentQuestion && (
          <>
            <div className="quiz-content">
              <div>
                <img
                  src={currentQuestion.questionImg}
                  alt="Question"
                  className="question-image"
                />
                <h2>
                  {currentQuestion.question}
                </h2>
                <div className="answers">
                  <button
                    className={getAnswerClass(1)}
                    onClick={() => handleAnswerClick(1)}
                    disabled={isAnswered || isAnswerHidden(1)}
                  >
                    A: {currentQuestion.answer1}
                  </button>
                  <button
                    className={getAnswerClass(2)}
                    onClick={() => handleAnswerClick(2)}
                    disabled={isAnswered || isAnswerHidden(2)}
                  >
                    B: {currentQuestion.answer2}
                  </button>
                  <button
                    className={getAnswerClass(3)}
                    onClick={() => handleAnswerClick(3)}
                    disabled={isAnswered || isAnswerHidden(3)}
                  >
                    C: {currentQuestion.answer3}
                  </button>
                  <button
                    className={getAnswerClass(4)}
                    onClick={() => handleAnswerClick(4)}
                    disabled={isAnswered || isAnswerHidden(4)}
                  >
                    D: {currentQuestion.answer4}
                  </button>
                </div>
                {isAnswered && (
                  <button className="next-button" onClick={handleNextQuestion}>
                    Myus Kargin Harc@
                  </button>
                )}
              </div>

              {/* Audience Poll Graph */}
              {showAudiencePoll && (
                <div className="audience-poll-container">
                  <h3>Audience Poll</h3>
                  <div className="bar-container">
                    <div
                      className="bar"
                      style={{ height: `${currentQuestion.audience[0]}%` }}
                    >
                      A: {currentQuestion.audience[0]}%
                    </div>
                  </div>
                  <div className="bar-container">
                    <div
                      className="bar"
                      style={{ height: `${currentQuestion.audience[1]}%` }}
                    >
                      B: {currentQuestion.audience[1]}%
                    </div>
                  </div>
                  <div className="bar-container">
                    <div
                      className="bar"
                      style={{ height: `${currentQuestion.audience[2]}%` }}
                    >
                      C: {currentQuestion.audience[2]}%
                    </div>
                  </div>
                  <div className="bar-container">
                    <div
                      className="bar"
                      style={{ height: `${currentQuestion.audience[3]}%` }}
                    >
                      D: {currentQuestion.audience[3]}%
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lifeline Buttons */}
            <div className="lifeline-buttons">
              {!audienceUsed && !isAnswered && (
                <button
                  className="audience-button"
                  onClick={handleShowAudiencePoll}
                >
                  Zali Ognutyun
                </button>
              )}
              {!fiftyUsed && !isAnswered && (
                <button className="fifty-button" onClick={handleFiftyFifty}>
                  50/50 Fizruk lic
                </button>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default Quiz;
