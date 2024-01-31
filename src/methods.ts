import { BOARD_SIZE, TurnList } from "./constants";
import { Board, BoardMove, Coords2D, CPUMove, PositionType, Turn, WinData } from "./types";

export const deepClone = <T>(obj: T, _structuredClone: (d: T) => T = structuredClone): T => {
    if (typeof _structuredClone === 'function') {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}

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

export const addMarkAt = (board: Board, coords: Coords2D, turn: Turn): BoardMove => {
    if (coords.x < 0 && coords.y < 0 && coords.x >= BOARD_SIZE && coords.y >= BOARD_SIZE) { // invalid coord
        return { board, moved: false };
    }

    const value = board[coords.x][coords.y];
    if (value !== null) { // already has a value
        return { board, moved: false };
    }

    board[coords.x][coords.y] = turn;
    return { board, moved: true };
}

export const toggleTurn = (turn: Turn): Turn => turn === 1 ? 0 : 1;

export const checkBoardFull = (board: Board, size: number): boolean => {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y] === null) {
                return false;
            }
        }
    }
    return true;
}

export const checkWin = (board: Board, size: number, coords: Coords2D, turn: Turn): WinData | null => {
    // check col
    for (let x = 0; x < size; x++) {
        if (board[coords.x][x] != turn) break;
        if (x === size - 1) return { type: 'column', coords: { x: coords.x, y: x }, turn };
    }

    // check row
    for (let x = 0; x < size; x++) {
        if (board[x][coords.y] !== turn) break;
        if (x === size - 1) return { type: 'row', coords: { x: x, y: coords.y }, turn };
    }

    // check diagonal
    if (coords.x === coords.y) { // addind mark in diagonal
        for (let x = 0; x < size; x++) {
            if (board[x][x] !== turn) break;
            if (x === size - 1) return { type: 'diagonal', coords: { x: 0, y: 0 }, turn };
        }
    }

    // check anti diagonal
    if (coords.x + coords.y === size - 1) {
        for (let x = 0; x < size; x++) {
            if (board[x][size - 1 - x] !== turn) break;
            if (x === size - 1) return { type: 'reverse-diagonal', coords: { x: 0, y: size }, turn };
        }
    }

    return null;
}

export const cpuPlay = (board: Board, turn: Turn, cpuTurn: Turn, size: number, coords: Coords2D = { x: 0, y: 0 }): CPUMove => {
    const slots = availableSlots(board, size);

    if (checkWin(board, size, coords, toggleTurn(cpuTurn))) return { score: -10, coords };
    if (checkWin(board, size, coords, cpuTurn)) return { score: 10, coords };
    if (slots.length === 0) return { score: 0, coords }; // limit reached

    const slotsLength = slots.length;
    const moves: CPUMove[] = [];

    for (let x = 0; x < slotsLength; x++) {
        board[slots[x].x][slots[x].y] = turn;
        moves.push({ score: cpuPlay(board, toggleTurn(turn), cpuTurn, size, slots[x]).score, coords: slots[x] });
        board[slots[x].x][slots[x].y] = null;
    }

    const movesLength = moves.length;
    let bestMove: number = -1;
    if (turn === cpuTurn) {
        let bestScore = -10000;
        for (let x = 0; x < movesLength; x++) {
            if (moves[x].score > bestScore) {
                bestScore = moves[x].score;
                bestMove = x;
            }
        }
    } else {
        let bestScore = 10000;
        for (let x = 0; x < movesLength; x++) {
            if (moves[x].score < bestScore) {
                bestScore = moves[x].score;
                bestMove = x;
            }
        }
    }

    return moves[bestMove];
}

export const availableSlots = (board: Board, size: number): Coords2D[] => {
    const slots: Coords2D[] = [];
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y] === null) {
                slots.push({ x, y });
            }
        }
    }
    return slots;
}

export const getPlayModeName = (mode: 'a' | 'b' | 'c'): string => {
    switch (mode) {
        case 'a':
            return 'Playing vs CPU as X';
        case 'b':
            return 'Playing vs CPU as O';
        case 'c':
            return 'Player vs Player';
    }
}

export const getWinnerText = (winner: PositionType, isBoardFull: boolean): string | null => {
    if (winner === TurnList.x) return 'Player X wins';
    if (winner === TurnList.o) return 'Player O wins';
    if (isBoardFull) return 'Draw game';

    return null;
}
