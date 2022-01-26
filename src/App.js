import React from "react";
import "./App.css";
import finalQ from "./data/finalQuestions.json";
import starters from "./data/pmd2TDStarters.json";
import questions from "./data/pmd2TDQuestions.json";
import descriptions from "./data/pmd2Descriptions.json";

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

  React.useEffect(() => {
     const audio = new Audio('/music.mp3');
     audio.loop = true;
     audio.play();
  }, [])

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
      setGender(answer.textValue);
    }
    setQuestionIndex(questionIndex + 1);
  }

  if (questionIndex == questionList.length) {
    return (
      <div>
        <div>It's time to reveal your true form!</div>
        <div>
          {Object.entries(points).map(([trait, value]) => (
            <p>
              {trait}: {value}
            </p>
          ))}
          <p>Gender: {gender}</p>
        </div>
        <div>
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
    );
  }



  return (
    <div>

      <h2>{question.textValue}</h2>
      <div>
        {question.answers.map((answer) => (
          <button onClick={() => doAnswer(answer)}>{answer.textValue}</button>
        ))}
      </div>
      <div>
        {Object.entries(points).map(([trait, value]) => (
          <p>
            {trait}: {value}
          </p>
        ))}
        <p>Gender: {gender}</p>
      </div>
    </div>
  );
}

export default App;
