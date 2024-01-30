export type Turn = 0 | 1;

export type PositionType = Turn | null;

export type Board = PositionType[][];

export type Coords2D = { x: number, y: number };

export interface BoardMove {
    board: Board;
    moved: boolean;
}

export type CPUMove = {
    board: Board;
    winner: boolean;
};

export type MoveScore = {
    position: Coords2D;
    score: number;
};
