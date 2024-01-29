import { PositionType } from "./types";

export const generateBoard = (size: number): PositionType[][] => {
    const board: PositionType[][] = [];
    for (let x = 0; x < size; x++) {
        const column: PositionType[] = [];
        for (let y = 0; y < size; y++) {
            column.push(null);
        }
        board.push(column);
    }
    return board;
};
