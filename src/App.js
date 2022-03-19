import React from "react";
import "./App.css";
import finalQ from "./data/finalQuestions.json";
import starters from "./data/pmd2TDStarters.json";
import questions from "./data/pmd2TDQuestions.json";
import descriptions from "./data/pmd2Descriptions.json";
import useGesture from "./useGesture";

const questionList = questions
  .concat(finalQ)
  .filter((q) => q.answers.length <= 3)
  .slice(-30);

const directions = ["←", "→", "↑", "↓"];

const isMobile = navigator?.userAgentData?.mobile ?? false;

const initialPoints = {
  Docile: 0,
  Hardy: 0,
  Jolly: 0,
  Impish: 0,
  Quirky: 0,
  Relaxed: 0,
  Brave: 0,
  Lonely: 0,
  Timid: 0,
  Naive: 0,
  Sassy: 0,
  Hasty: 0,
  Calm: 0,
  Quiet: 0,
  Rash: 0,
  Bold: 0,
};

function getDominantTrait(points) {
  var highestVal = 0;
  var highestTrait;

  for (const [key, value] of Object.entries(points)) {
    if (highestVal < value) {
      highestVal = value;
      highestTrait = key;
    }
  }
  return highestTrait;
}

function getPokemon(trait, gender) {
  return starters[trait][gender];
}

function App() {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [points, setPoints] = React.useState(initialPoints);
  const [gender, setGender] = React.useState();
  const [start, setStart] = React.useState(true);

  const progess = (questionIndex / questionList.length) * 100;

  const { oldGesture, newGesture, reset } = useGesture();

  const question = React.useMemo(
    () => questionList[questionIndex],
    [questionIndex]
  );

  const doAnswer = React.useCallback((answer) => {
    if (!answer) {
      return;
    }

    console.log("answering:", answer.textValue);
    navigator.vibrate(100);

    if (answer.points !== undefined) {
      setPoints((oldPoints) => {
        return {
          Docile: oldPoints.Docile + (answer.points.Docile ?? 0),
          Hardy: oldPoints.Hardy + (answer.points.Hardy ?? 0),
          Jolly: oldPoints.Jolly + (answer.points.Jolly ?? 0),
          Impish: oldPoints.Impish + (answer.points.Impish ?? 0),
          Quirky: oldPoints.Quirky + (answer.points.Quirky ?? 0),
          Relaxed: oldPoints.Relaxed + (answer.points.Relaxed ?? 0),
          Brave: oldPoints.Brave + (answer.points.Brave ?? 0),
          Lonely: oldPoints.Lonely + (answer.points.Lonely ?? 0),
          Timid: oldPoints.Timid + (answer.points.Timid ?? 0),
          Naive: oldPoints.Naive + (answer.points.Naive ?? 0),
          Sassy: oldPoints.Sassy + (answer.points.Sassy ?? 0),
          Hasty: oldPoints.Hasty + (answer.points.Hasty ?? 0),
          Calm: oldPoints.Calm + (answer.points.Calm ?? 0),
          Quiet: oldPoints.Quiet + (answer.points.Quiet ?? 0),
          Rash: oldPoints.Rash + (answer.points.Rash ?? 0),
          Bold: oldPoints.Bold + (answer.points.Bold ?? 0),
        };
      });
    } else {
      var genderAns = answer.textValue;
      if (genderAns === "Neither") {
        var rng = Math.floor(Math.random() * 2);
        if (rng === 0) {
          genderAns = "Female";
        } else {
          genderAns = "Male";
        }
      }
      setGender(genderAns);
    }
    setQuestionIndex((oldIndex) => oldIndex + 1);
  }, []);

  React.useEffect(() => {
    console.log(oldGesture, newGesture);
    if (oldGesture === newGesture) {
      return;
    }
    if (oldGesture === "reset" || newGesture === "reset") {
      return;
    }
    if (!question?.answers) {
      return;
    }
    if (newGesture === "left") {
      reset();
      doAnswer(question.answers[0]);
    }
    if (newGesture === "right") {
      reset();
      doAnswer(question.answers[1]);
    }
    if (newGesture === "up") {
      reset();
      doAnswer(question.answers[2]);
    }
    if (newGesture === "down") {
      reset();
      doAnswer(question.answers[3]);
    }
  }, [question, oldGesture, newGesture, doAnswer, reset]);

  React.useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.play();
    return () => audio.pause();
  }, [start]);

  if (start) {
    return (
      <div className="start">
        <img className="logo" src="/logo.png" />
        <button className="start-button" onClick={() => setStart(false)}>
          start
        </button>
      </div>
    );
  }

  if (questionIndex === questionList.length) {
    return (
      <>
        <div className="end-screen">
          <h2 className="reveal-text">It's time to reveal your true form!</h2>
          <img
            className="pokemon"
            alt="pokemon"
            src={
              getPokemon(getDominantTrait(points), gender) +
              "-big.png"
            }
          />
          <div className="trait-text">
            {Object.entries(descriptions[getDominantTrait(points)]).map(
              ([trait, value]) => (
                <p>
                  {value.replace(
                    /%s/,
                    getPokemon(getDominantTrait(points), gender)
                  )}
                </p>
              )
            )}
          </div>
          <button className="retry-button" onClick={() => window.location.href=window.location.href}>Retry</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${progess}%` }}></div>
      </div>
      <div className="answers">
        {question.answers.map((answer, index) => {
          const direction = directions[index % 4];

          return (
            <button id={index} className="answer" onClick={() => doAnswer(answer)}>
              {isMobile && (
                <>
                  <span>{direction}</span>
                  <br />
                </>
              )}
              <span>{answer.textValue}</span>
            </button>
          );
        })}
      </div>
      <div className="question">
        <h2>{question.textValue}</h2>
      </div>
    </>
  );
}

export default App;
