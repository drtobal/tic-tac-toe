import { BOARD_SIZE } from "@/constants";
import { addMarkAt, generateBoard, toggleMove } from "@/methods";
import { Board, Turn } from "@/types";
import { useState } from "react";
import Position from './position';

export default function Board() {
    const [board, setBoard] = useState<Board>(generateBoard(BOARD_SIZE));

    const [turn, setTurn] = useState<Turn>(0);

    const play = (column: number, row: number): void => {
        const result = addMarkAt(board, column, row, turn);
        if (result.moved) {
            setTurn(toggleMove(turn));
            setBoard([...result.board]);
        }
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
        </div>
    );
}
