import { BOARD_SIZE, CPU_MOVE_VALUE } from "./constants";
import { Board, BoardMove, Coords2D, CPUMove, MoveScore, PositionType, Turn } from "./types";

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

export const toggleTurn = (turn: Turn): Turn => turn === 1 ? 0 : 1;

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

    return false;
}

export const minimax = (board: Board, turn: Turn, spot: Coords2D, size: number): number => {
    const clone = deepClone(board);
    clone[spot.x][spot.y] = turn;
    if (checkWin(clone, size, spot.x, spot.y, turn)) return 1;

    const otherTurn = toggleTurn(turn);
    clone[spot.x][spot.y] = otherTurn;
    if (checkWin(clone, size, spot.x, spot.y, otherTurn)) return -1;
    return 0;
}

export const cpuPlay = (board: Board, turn: Turn, size: number): CPUMove => {
    const spots = availableSpots(board, size);
    const spotsLength = spots.length;
    if (spotsLength === 0) return { board, winner: false }; // can't play 

    const moves: MoveScore[] = [];

    for (let x = 0; x < spotsLength; x++) {
        const score = minimax(board, turn, spots[x], size);
        console.log(score);
        if (score !== 0) { // winner or looser move
            board[spots[x].x][spots[x].y] = turn;
            return { board, winner: score > 0 };
        }
        moves.push({ score, position: spots[x] });
    }

    const movesLength = moves.length;
    for (let x = 0; x < movesLength; x++) {
        if (moves[x].score === 0) { // just don't let user win
            board[moves[x].position.x][moves[x].position.y] = turn;
            return { board, winner: false };
        }
    }

    return { board, winner: false };
};

export const availableSpots = (board: Board, size: number): Coords2D[] => {
    const spots: Coords2D[] = [];
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y] === null) {
                spots.push({ x, y });
            }
        }
    }
    return spots;
}
