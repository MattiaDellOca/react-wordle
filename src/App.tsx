import "./App.css";
import {useCallback, useEffect, useState} from "react";
import Line from "./Line.tsx";
import {TRIES, WORD_LENGTH} from "./constants.ts";

const API_URL = "https://api.frontendexpert.io/api/fe/wordle-words";

enum GameState {
    LOADING,
    PLAYING,
    WON,
    LOST,
}

function App() {
    const [words, setWords] = useState<string[]>([]);
    const [solution, setSolution] = useState<string | undefined>(undefined);
    const [guesses, setGuesses] = useState<string[]>(Array(TRIES).fill(null));
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [gameState, setGameState] = useState<GameState>(GameState.LOADING);

    useEffect(() => {
        if(gameState !== GameState.LOADING) return;
        let ignore = false;
        const fetchWords = async () => {
            const response = await fetch(API_URL, {
                method: "GET",
            });
            const words = await response.json();
            if (ignore) return;
            setWords(words);
            setSolution(words[Math.floor(Math.random() * words.length)]);
            setGameState(GameState.PLAYING);
        };

        fetchWords();

        return () => {
            ignore = true;
        };
    }, [gameState]);

    const restart = useCallback(() => {
        console.log('restarting...');
        setGameState(GameState.LOADING);
        setGuesses(Array(TRIES).fill(null));
        setCurrentGuess("");
    }, [])

    useEffect(() => {
        const handleType = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                if (gameState > GameState.PLAYING) {
                    restart();
                    return;
                } else if (currentGuess.length < WORD_LENGTH) return;
                else if (!words.includes(currentGuess)) {
                    alert("Please, insert a valid word!");
                    setCurrentGuess("");
                    return;
                }

                const newGuesses = [...guesses];
                const guessIndex = guesses.findIndex((val) => val == null);
                newGuesses[guessIndex] = currentGuess;
                setGuesses(newGuesses);
                setCurrentGuess("");

                if (currentGuess === solution)
                    setGameState(GameState.WON);
                else if (guessIndex === TRIES - 1) setGameState(GameState.LOST);
            } else if (gameState !== GameState.PLAYING) return;
            else if (e.key == "Backspace") {
                setCurrentGuess(currentGuess.slice(0, -1));
            } else if (e.key.match(/^[a-zA-Z]$/) && currentGuess.length < WORD_LENGTH) {
                setCurrentGuess(currentGuess + e.key.toUpperCase());
            }
        };
        window.addEventListener("keydown", handleType);

        return () => {
            window.removeEventListener("keydown", handleType);
        };
    }, [words, gameState, solution, guesses, currentGuess, restart]);

    if (!solution) return <h1>Loading...</h1>;

    return (
        <div className={"card"}>
            <h1>React Wordle 📖</h1>
            <h2>Take a guess!</h2>
            {guesses.map((guess, index) => {
                const guessIndex = guesses.findIndex((val) => val == null);
                const value =
                    guessIndex === index
                        ? currentGuess
                        : guess == null
                            ? guess
                            : guess;
                const finalized = gameState !== GameState.PLAYING || guessIndex > index;
                return (
                    <Line
                        key={index}
                        solution={solution}
                        guess={value}
                        finalized={finalized}
                    />
                );
            })}

            {gameState === GameState.WON && <h2>Congrats, you won the game! 🥳</h2>}
            {gameState === GameState.LOST && (
                <>
                    <h2>Better luck next time! 😔</h2>
                    <p>
                        The solution was <b>{solution}</b>!
                    </p>
                </>
            )}
            {gameState > GameState.PLAYING && <button onClick={restart}>Play again</button>}

        </div>
    );
}

export default App;
