import { BOARD_SIZE } from "./constants";
import { Board, BoardMove, PositionType, Turn } from "./types";

export const generateBoard = (size: number): Board => {
    const board: Board = [];
    for (let x = 0; x < size; x++) {
        const column: PositionType[] = [];
        for (let y = 0; y < size; y++) {
            column.push(null);
        }
        board.push(column);
    }
    return board;
};

export const addMarkAt = (board: Board, column: number, row: number, turn: Turn): BoardMove => {
    if (column < 0 && row < 0 && column >= BOARD_SIZE && row >= BOARD_SIZE) { // invalid coord
        return { board, moved: false };
    }

    const value = board[column][row];
    if (value !== null) { // already has a value
        return { board, moved: false };
    }

    board[column][row] = turn;
    return { board, moved: true };
}

export const toggleMove = (turn: Turn): Turn => turn === 1 ? 0 : 1;
