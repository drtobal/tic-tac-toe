import { BOARD_SIZE, START_PLAYER, TurnList } from "@/constants";
import { addMarkAt, checkBoardFull, checkWin, cpuPlay, generateBoard, toggleTurn } from "@/methods";
import { Board, PositionType, Turn } from "@/types";
import { useState } from "react";
import Position from './position';
import Header from './header';

export default function Board() {
    const [board, setBoard] = useState<Board>(generateBoard(BOARD_SIZE));

    const [turn, setTurn] = useState<Turn>(START_PLAYER);

    const [isBoardFull, setIsBoardFull] = useState<boolean>(false);

    const [winner, setWinner] = useState<PositionType>(null);

    const [userPlayer, setUserPlayer] = useState<Turn>(START_PLAYER);

    const [isCpuPlaying, setIsCpuPlaying] = useState<boolean>(true);

    const cpuXClick = () => {
        startNewGame();
        setUserPlayer(TurnList.x);
        setIsCpuPlaying(true);
    };

    const cpuOClick = () => {
        const board = generateBoard(BOARD_SIZE);
        const move = cpuPlay(board, TurnList.o, TurnList.o, BOARD_SIZE);
        if (move.coords) {
            const result = addMarkAt(board, move.coords.x, move.coords.y, TurnList.o);
            startNewGame(result.board);
            setUserPlayer(TurnList.x);
            setIsCpuPlaying(true);
        }
    };

    const twoPlayerClick = () => {
        startNewGame();
        setIsCpuPlaying(false);
    };

    const startNewGame = (board: Board = generateBoard(BOARD_SIZE)) => {
        setUserPlayer(START_PLAYER);
        setBoard(board);
        setIsBoardFull(false);
        setWinner(null);
    };

    const playCpu = (turn: Turn): null => {
        if (isBoardFull || winner !== null || turn === userPlayer) return null;

        const move = cpuPlay(board, turn, turn, BOARD_SIZE);
        if (move.coords) {
            const result = addMarkAt(board, move.coords.x, move.coords.y, turn);
            setBoard([...result.board]);
            setIsBoardFull(checkBoardFull(result.board, BOARD_SIZE));
            setTurn(toggleTurn(turn));

            if (checkWin(result.board, BOARD_SIZE, move.coords.x, move.coords.y, turn)) {
                setWinner(turn);
            }
        }

        return null;
    }

    const play = (column: number, row: number): null => {
        if (isBoardFull || winner !== null) return null;

        const result = addMarkAt(board, column, row, turn);
        if (result.moved) {
            setBoard([...result.board]);
            setIsBoardFull(checkBoardFull(result.board, BOARD_SIZE));
            const newTurn = toggleTurn(turn);
            setTurn(newTurn);

            if (checkWin(result.board, BOARD_SIZE, column, row, turn)) {
                setWinner(turn);
            }

            if (isCpuPlaying) {
                setTimeout(() => playCpu(newTurn), 50);
            }
        }

        return null;
    };

    return (
        <>
            <Header cpuXClick={() => cpuXClick()} cpuOClick={() => cpuOClick()} twoPlayerClick={() => twoPlayerClick()} />

            <div className="board-container">
                <div className="board-container__background-column">
                    {[...Array(BOARD_SIZE - 1)].map((n, i) => <div key={i} className="board-container__column-separator"></div>)}
                </div>
                <div className="board-container__background-row">
                    {[...Array(BOARD_SIZE - 1)].map((n, i) => <div key={i} className="board-container__row-separator"></div>)}
                </div>

                <div className="board">
                    {board.map((column, x) => <div className="board__column" key={x}>
                        {column.map((row, y) => <div onClick={() => play(x, y)} key={y}>
                            <Position value={row} />
                        </div>)}
                    </div>)}
                </div>

                <p>Winner: {winner}</p>
            </div>
        </>
    );
}
