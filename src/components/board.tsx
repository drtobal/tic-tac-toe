import { BOARD_SIZE } from "@/constants";
import { addMarkAt, checkBoardFull, checkWin, cpuPlay, generateBoard, toggleTurn } from "@/methods";
import { Board, PositionType, Turn } from "@/types";
import { useState } from "react";
import Position from './position';

const USER_PLAYER = 0;

const START_PLAYER = 0;

export default function Board() {
    const [board, setBoard] = useState<Board>(generateBoard(BOARD_SIZE));

    const [turn, setTurn] = useState<Turn>(START_PLAYER);

    const [isBoardFull, setIsBoardFull] = useState<boolean>(false);

    const [winner, setWinner] = useState<PositionType>(null);

    const playCpu = (turn: Turn): null => {
        if (isBoardFull || turn === USER_PLAYER) return null;

        const cpu = cpuPlay(board, turn, BOARD_SIZE);
        setBoard([...cpu.board]);
        setIsBoardFull(checkBoardFull(cpu.board, BOARD_SIZE));
        setTurn(toggleTurn(turn));

        console.log(cpu);

        if (cpu.winner) {
            setWinner(turn);
        }

        return null;
    }

    const play = (column: number, row: number): null => {
        if (isBoardFull) return null;

        const result = addMarkAt(board, column, row, turn);
        if (result.moved) {
            setBoard([...result.board]);
            setIsBoardFull(checkBoardFull(result.board, BOARD_SIZE));
            const newTurn = toggleTurn(turn);
            setTurn(newTurn);

            if (checkWin(result.board, BOARD_SIZE, column, row, turn)) {
                setWinner(turn);
            }

            setTimeout(() => playCpu(newTurn), 50);
        }

        return null;
    };

    return (
        <div className="board-container">
            <div className="board-container__background-column">
                {[...Array(BOARD_SIZE - 1)].map((n, i) => <div key={i} className="board-container__column-separator"></div>)}
            </div>
            <div className="board-container__background-row">
                {[...Array(BOARD_SIZE - 1)].map((n, i) => <div key={i} className="board-container__row-separator"></div>)}
            </div>

            <div className="board">
                {board.map((column, x) => <div className="board__column" key={x}>
                    {column.map((row, y) => <div onClick={() => play(x, y)} key={y}>
                        <Position value={row} />
                    </div>)}
                </div>)}
            </div>

            <p>Winner: {winner}</p>
        </div>
    );
}
