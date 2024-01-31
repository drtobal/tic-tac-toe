/** object with open properties */
export type AnyObject = {
    [prop: string]: any;
}

/** plyer's turn value */
export type Turn = 0 | 1; // zero is x, 1 is o

/** value of a slot in the board, can be one of player's turn or null */
export type SlotValue = Turn | null;

/** board game data, is 2 dimension array */
export type Board = SlotValue[][];

/** 2d coords of the board */
export type Coords2D = { x: number, y: number };

/**
 * game mode codes
 * a: single player vs cpu, player plays as X
 * b: single player vs cpu, player plays as O
 * c: two player mode
 * */
export type GameMode = 'a' | 'b' | 'c';

/** data returned when a player win the game */
export type WinData = {
    type: 'row' | 'column' | 'diagonal' | 'reverse-diagonal';
    coords: Coords2D;
    turn: Turn;
};

/** data returned after a player adds mark on the board */
export interface BoardMove {
    board: Board;
    moved: boolean;
}

/** data returned when cpu finds a movement */
export type CPUMove = {
    score: number;
    coords: Coords2D | null;
};
