import { useEffect, useState } from "react";
import "./game.css";

const buttonColours = ["red", "blue", "green", "yellow"];

export default function Game() {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(0);
  const [gamePattern, setGamePattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [clickIndex, setClickIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [theme, setTheme] = useState("retro");
  const [showFullSequence, setShowFullSequence] = useState(true);

  const handleDifficultyChange = (e) => {
    setDifficulty(parseInt(e.target.value));
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };


  useEffect(() => {
    document.body.className = theme;
    document.body.style.fontFamily =
      theme === "neon" ? "'Orbitron', sans-serif" : "'Press Start 2P', cursive";
  }, [theme]);


  const playSequence = (sequence) => {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      flashButton(color);
      playSound(color);
    }, index * 600); 
  });
};

  const startGame = () => {
    if (!started) {
      setLevel(0);
      setStarted(true);
      nextSequence();
    }
  };

  const nextSequence = () => {
    const newSequence = [];
    for (let i = 0; i < difficulty; i++) {
      const randomColour =
        buttonColours[Math.floor(Math.random() * buttonColours.length)];
      newSequence.push(randomColour);
    }

    const updated = [...gamePattern, ...newSequence];
    setGamePattern(updated);
    setUserPattern([]);
    setClickIndex(0);
    setLevel((prev) => prev + 1);

    setTimeout(() => {
      const sequenceToPlay = showFullSequence ? updated : newSequence;
      playSequence(sequenceToPlay);
    }, 500);
  };

  const handleClick = (colour) => {
    const updatedUserPattern = [...userPattern, colour];
    setUserPattern(updatedUserPattern);
    setClickIndex((prev) => prev + 1);
    flashButton(colour);
    playSound(colour);

    const index = updatedUserPattern.length - 1;
    if (colour !== gamePattern[index]) {
      triggerGameOver();
    } else if (updatedUserPattern.length === gamePattern.length) {
      setTimeout(() => {
        nextSequence();
      }, 1000);
    }
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
      setIsGameOver(true);  // Show popup
    }, 200);
    setStarted(false);
    setGamePattern([]);
    setUserPattern([]);
    setClickIndex(0);
  };



  return (
    <div className={`container ${theme}`}>
      <h1 id="level-title">
        {started ? `Level ${level}` : "Memory Game"}
      </h1>
      {!started && (
        <div className="config-group">
          <select value={difficulty} onChange={handleDifficultyChange}>
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
            <option value={4}>Insane</option>
          </select>
          <button className="start-button" onClick={startGame}>
            Start
          </button>
          <select value={theme} onChange={handleThemeChange} >
            <option value="retro">Retro</option>
            <option value="neon">Neon</option>
          </select>
          <label style={{ fontSize: "0.9rem" }}>
            <input
              type="checkbox"
              checked={showFullSequence}
              onChange={(e) => setShowFullSequence(e.target.checked)}
              style={{ marginRight: "0.5em" }}
            />
            Show full sequence each round
          </label>
        </div>
      )}
      <div className="row">
        {buttonColours.map((color) => (
          <div
            key={color}
            id={color}
            className={`btn ${color} ${!started || isGameOver ? "disabled" : ""}`}
            onClick={() => {
              if (started) handleClick(color);
            }}
          ></div>
        ))}
      </div>
      {isGameOver && (
        <div className="popup-overlay">
          <div className="popup">
            <h2 style={{color: "#011F3F"}}>Game Over</h2>
            <p style={{color: "#011F3F"}}>You reached Level {level}</p>
            <button style={{fontFamily: "'Press Start 2P', cursive"}} onClick={() => {
              setIsGameOver(false);
              setStarted(false);
            }}>
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
