export type Turn = 0 | 1;

export type PositionType = Turn | null;

export type Board = PositionType[][];

export interface BoardMove {
    board: Board;
    moved: boolean;
}
