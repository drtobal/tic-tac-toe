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

export const checkBoardFull = (board: Board, size: number): boolean => {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y] !== null) {
                return false;
            }
        }
    }
    return true;
}

export const checkWin = (board: Board, size: number, column: number, row: number, turn: Turn): boolean => {
    // check col
    for (let x = 0; x < size; x++) {
        if (board[column][x] != turn) break;
        if (x === size - 1) return true;
    }

    // check row
    for (let x = 0; x < size; x++) {
        if (board[x][row] !== turn) break;
        if (x === size - 1) return true;
    }

    // check diagonal
    if (column === row) { // addind mark in diagonal
        for (let x = 0; x < size; x++) {
            if (board[x][x] !== turn) break;
            if (x === size - 1) return true;
        }
    }

    // check anti diagonal
    if (column + row === size - 1) {
        for (let x = 0; x < size; x++) {
            if (board[x][size - 1 - x] !== turn) break;
            if (x === size - 1) return true;
        }
    }

    /**
        //check draw
        if(moveCount == (Math.pow(n, 2) - 1)){
            //report draw
        }
     */

    return false;
}
