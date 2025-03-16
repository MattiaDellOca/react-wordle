import "./Line.css";
import { WORD_LENGTH } from "./constants.ts";

export type LineProps = {
    solution: string;
    guess: string | null;
    finalized: boolean;
};

function Line({ solution, guess, finalized }: LineProps) {
    const row = [];

    const getCellName = (i: number): string => {
        let className = "cell";
        if (guess == null || guess[i] === undefined || !finalized) return className;

        if (solution[i] === guess[i]) {
            className += " correct";
        } else if (solution.includes(guess[i])) {
            className += " almost";
        } else {
            className += " nope";
        }
        return className;
    };

    for (let i = 0; i < WORD_LENGTH; i++) {
        const className = getCellName(i);

        row.push(<div className={className}>{guess ? (guess[i] ?? "") : ""}</div>);
    }

    return <div className={"line"}>{row}</div>;
}

export default Line;
