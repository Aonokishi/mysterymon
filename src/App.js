import React from "react";
import "./App.css";
import finalQ from "./data/finalQuestions.json";
import starters from "./data/pmd2TDStarters.json";
import questions from "./data/pmd2TDQuestions.json";
import descriptions from "./data/pmd2Descriptions.json";
import lodash from "lodash";

const questionList = questions.concat(finalQ);

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
  const question = questionList[questionIndex];
  const [start, setStart] = React.useState(true);

  React.useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      alert("no sensor");
      return;
    }

    const handle = (event) => {
      var leftOrRight = event.gamma;
      var upOrDown = event.beta;
      var threshold = 40;
      
      if(Math.abs(leftOrRight) > Math.abs(upOrDown)){
        if (Math.abs(leftOrRight) < threshold){
          return;
        }

        if( leftOrRight > 0){
          console.log("Right")
        } else{
          console.log("Left")
        }
      } else {
        if(Math.abs(upOrDown) < threshold){
          return;
        }
        
        if(upOrDown > 0){
          console.log("Down")
        } else{
          console.log("UP")
        }
      }

    };

    const throttled = lodash.throttle(handle, 1000)

    window.addEventListener("deviceorientation", throttled, true);

    return () => window.removeEventListener("deviceorientation", throttled);
    
  }, []);

  React.useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.play();
  }, [start]);

  function doAnswer(answer) {
    if (answer.points !== undefined) {
      const newPoints = {
        Docile: points.Docile + (answer.points.Docile ?? 0),
        Hardy: points.Hardy + (answer.points.Hardy ?? 0),
        Jolly: points.Jolly + (answer.points.Jolly ?? 0),
        Impish: points.Impish + (answer.points.Impish ?? 0),
        Quirky: points.Quirky + (answer.points.Quirky ?? 0),
        Relaxed: points.Relaxed + (answer.points.Relaxed ?? 0),
        Brave: points.Brave + (answer.points.Brave ?? 0),
        Lonely: points.Lonely + (answer.points.Lonely ?? 0),
        Timid: points.Timid + (answer.points.Timid ?? 0),
        Naive: points.Naive + (answer.points.Naive ?? 0),
        Sassy: points.Sassy + (answer.points.Sassy ?? 0),
        Hasty: points.Hasty + (answer.points.Hasty ?? 0),
        Calm: points.Calm + (answer.points.Calm ?? 0),
        Quiet: points.Quiet + (answer.points.Quiet ?? 0),
        Rash: points.Rash + (answer.points.Rash ?? 0),
        Bold: points.Bold + (answer.points.Bold ?? 0),
      };
      setPoints(newPoints);
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
    setQuestionIndex(questionIndex + 1);
  }

  if (start) {
    return (
      <div>
        <button onClick={() => setStart(false)}>start</button>
      </div>
    );
  }

  if (questionIndex === questionList.length) {
    return (
      <div className="wrapper">
        <div className="end-screen">
          <h2>It's time to reveal your true form!</h2>
          <img
            alt="pokemon"
            src={
              "/images/" +
              getPokemon(getDominantTrait(points), gender) +
              "-big.png"
            }
          ></img>
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
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="answers">
        {question.answers.map((answer) => (
          <button className="answer" onClick={() => doAnswer(answer)}>
            {answer.textValue}
          </button>
        ))}
      </div>
      <div className="question">
        <h2>{question.textValue}</h2>
      </div>
    </div>
  );
}

export default App;
