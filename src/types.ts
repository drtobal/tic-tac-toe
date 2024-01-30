export type Turn = 0 | 1; // zero is x, 1 is o

export type PositionType = Turn | null;

export type Board = PositionType[][];

export type Coords2D = { x: number, y: number };

export interface BoardMove {
    board: Board;
    moved: boolean;
}

export type CPUMove = {
    score: number;
    coords: Coords2D | null;
};
