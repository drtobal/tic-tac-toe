import { addMarkAt, availableSlots, checkBoardFull, checkWin, deepClone, generateBoard, toggleTurn } from "./methods";
import { Board } from "./types";


describe("Util methods for tables", () => {

    test('should return a copy of the object', () => {
        const object = { name: 'test' };
        const clone = deepClone(object);
        object.name = 'changed';
        expect(object.name).toBe('changed');
        expect(clone.name).toBe('test');
    });

    test('it should generate a board', () => {
        expect(generateBoard(1)).toEqual([[null]]);
        expect(generateBoard(2)).toEqual([[null, null], [null, null]]);
        expect(generateBoard(3)).toEqual([[null, null, null], [null, null, null], [null, null, null]]);
        expect(generateBoard(4)).toEqual([
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
        ]);
    });

    test('it should add a mark to a board', () => {
        let result = addMarkAt([[null, null, null], [null, null, null], [null, null, null]], { x: 0, y: 0 }, 0);
        expect(result).toEqual({ board: [[0, null, null], [null, null, null], [null, null, null]], moved: true });

        result = addMarkAt([[1, null, null], [null, null, null], [null, null, null]], { x: 0, y: 0 }, 0);
        expect(result).toEqual({ board: [[1, null, null], [null, null, null], [null, null, null]], moved: false });

        result = addMarkAt([[1, null, null], [null, null, null], [null, null, null]], { x: 1, y: 2 }, 1);
        expect(result).toEqual({ board: [[1, null, null], [null, null, 1], [null, null, null]], moved: true });
    });

    test('should toggle turn', () => {
        expect(toggleTurn(1)).toBe(0);
        expect(toggleTurn(0)).toBe(1);
    });

    test('check if board is full', () => {
        expect(checkBoardFull([[1, null, null], [null, null, null], [null, null, null]], 3)).toBe(false);
        expect(checkBoardFull([[1, null, 0], [1, null, 1], [0, null, 1]], 3)).toBe(false);
        expect(checkBoardFull([[1, 1, 0], [1, 0, 1], [0, 1, 1]], 3)).toBe(true);
    });

    test('check if table has a winner', () => {
        let table: Board = [[1, 1, 0], [1, 0, 1], [0, 1, 1]];
        expect(checkWin(table, 3, { x: 0, y: 0 }, 1)).toBeNull();

        table = [[1, null, 0], [1, null, 1], [1, null, null]];
        expect(checkWin(table, 3, { x: 0, y: 0 }, 1)).toEqual({ type: 'row', coords: { x: 0, y: 0 }, turn: 1 });

        table = [[0, null, 0], [0, null, 1], [0, null, null]];
        expect(checkWin(table, 3, { x: 0, y: 0 }, 0)).toEqual({ type: 'row', coords: { x: 0, y: 0 }, turn: 0 });

        table = [[0, 1, 0], [0, 1, 1], [1, 1, null]];
        expect(checkWin(table, 3, { x: 1, y: 1 }, 1)).toEqual({ type: 'row', coords: { x: 0, y: 1 }, turn: 1 });
        expect(checkWin(table, 3, { x: 1, y: 1 }, 0)).toBeNull();

        table = [[0, 1, 0], [null, null, 0], [1, 1, 0]];
        expect(checkWin(table, 3, { x: 1, y: 2 }, 0)).toEqual({ type: 'row', coords: { x: 0, y: 2 }, turn: 0 });

        table = [[0, 1, 0], [null, null, 0], [1, null, 1]];
        expect(checkWin(table, 3, { x: 1, y: 2 }, 0)).toBeNull();

        table = [[1, null, null], [null, 1, 0], [1, null, 1]];
        expect(checkWin(table, 3, { x: 1, y: 1 }, 1)).toEqual({ type: 'diagonal', coords: { x: 0, y: 0 }, turn: 1 });

        table = [[1, null, 0], [null, 0, 0], [0, null, 1]];
        expect(checkWin(table, 3, { x: 0, y: 2 }, 0)).toEqual({ type: 'reverse-diagonal', coords: { x: 0, y: 2 }, turn: 0 });

        table = [[1, null, 0], [null, 1, 0], [0, null, 1]];
        expect(checkWin(table, 3, { x: 0, y: 2 }, 0)).toBeNull();

        table = [[0, 0, 0], [0, null, 0], [1, 1, null]];
        expect(checkWin(table, 3, { x: 0, y: 0 }, 0)).toEqual({ type: 'column', coords: { x: 0, y: 0 }, turn: 0 });

        table = [[null, 1, 0], [1, 1, 1], [0, 1, null]];
        expect(checkWin(table, 3, { x: 1, y: 2 }, 1)).toEqual({ type: 'column', coords: { x: 1, y: 0 }, turn: 1 });
        expect(checkWin(table, 3, { x: 1, y: 2 }, 0)).toBeNull();
    });

    test('get available slots', () => {
        expect(availableSlots([[1, 1, 1], [0, 0, 0], [1, 1, 1]], 3)).toEqual([]);
        expect(availableSlots([[1, 1, 1], [0, null, 0], [1, 1, 1]], 3)).toEqual([{ x: 1, y: 1 }]);
        expect(availableSlots([[1, 1, null], [0, null, 0], [1, 1, 1]], 3)).toEqual([{ x: 0, y: 2 }, { x: 1, y: 1 }]);
        expect(availableSlots([[1, 1, null], [0, null, 0], [null, 1, 1]], 3)).toEqual([{ x: 0, y: 2 }, { x: 1, y: 1 }, { x: 2, y: 0 }]);
    });

});
