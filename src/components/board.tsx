import { BOARD_SIZE } from "@/constants";
import { generateBoard } from "@/methods";
import { useState } from "react";
import Position from './position';

export default function Board() {
    const [board, setBoard] = useState(generateBoard(BOARD_SIZE));

    return (
        <div className="board">
            {board.map((column, x) => <div className="row" key={x}>
                {column.map((row, y) => <Position key={y} value={row} />)}
            </div>)}
        </div>
    );
}