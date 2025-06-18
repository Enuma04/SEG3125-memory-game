import { useEffect, useState } from "react";
import "./game.css";

const buttonColours = ["red", "blue", "green", "yellow"];

export default function Game() {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(0);
  const [gamePattern, setGamePattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [clickIndex, setClickIndex] = useState(0);

  useEffect(() => {
    if (userPattern.length === 0) return;

    const lastClick = userPattern[clickIndex - 1];
    const expected = gamePattern[clickIndex - 1];

    if (lastClick !== expected) {
      triggerGameOver();
    } else if (
      userPattern.length === gamePattern.length &&
      userPattern.length > 0
    ) {
      setTimeout(() => {
        nextSequence();
      }, 1000);
    }
  }, [userPattern]);

  const startGame = () => {
    if (!started) {
      setStarted(true);
      nextSequence();
    }
  };

  const nextSequence = () => {
    const randomColour =
      buttonColours[Math.floor(Math.random() * buttonColours.length)];
    setGamePattern((prev) => [...prev, randomColour]);
    setUserPattern([]);
    setClickIndex(0);
    setLevel((prev) => prev + 1);
    
  };

  const handleClick = (colour) => {
    setUserPattern((prev) => [...prev, colour]);
    setClickIndex((prev) => prev + 1);
    flashButton(colour);
    playSound(colour);
  };

  const playSound = (name) => {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.play();
  };

  const flashButton = (colour) => {
    const button = document.getElementById(colour);
    if (button) {
      button.classList.add("pressed");
      setTimeout(() => button.classList.remove("pressed"), 100);
    }
  };

  const triggerGameOver = () => {
    playSound("wrong");
    document.body.classList.add("game-over");
    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 200);
    setStarted(false);
    setLevel(0);
    setGamePattern([]);
    setUserPattern([]);
    setClickIndex(0);
  };

  useEffect(() => {
    if (gamePattern.length > 0) {
      const latestColour = gamePattern[gamePattern.length - 1];
      setTimeout(() => {
        flashButton(latestColour);
        playSound(latestColour);
      }, 500); // slight delay to ensure DOM is ready
    }
  }, [gamePattern]);

  return (
    <div className="container">
      <h1 id="level-title">
        {started ? `Level ${level}` : "Memory Game"}
      </h1>
      {!started && (
        <button className="start-button" onClick={startGame}>
          Start
        </button>
      )}
      <div className="row">
        {buttonColours.map((color) => (
          <div
            key={color}
            id={color}
            className={`btn ${color} ${!started ? "disabled" : ""}`}
            onClick={() => {
              if (started) handleClick(color);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
