import { BOARD_SIZE, START_PLAYER, TurnList } from "@/constants";
import { addMarkAt, checkBoardFull, checkWin, cpuPlay, generateBoard, getPlayModeName, getWinnerText, toggleTurn } from "@/methods";
import { Board, SlotValue, Turn, WinData } from "@/types";
import { useState } from "react";
import Slot from './slot';
import Header from './header';
import WinLine from './win-line';

/** this is the main component for the game, and page, includes header, footer and the game itself */
export default function Board() {
    /** currently playing game board */
    const [board, setBoard] = useState<Board>(generateBoard(BOARD_SIZE));

    /** check if game board is already full, if there is no winner, it is a draw game */
    const [isBoardFull, setIsBoardFull] = useState<boolean>(false);

    /** turn used for human player */
    const [userPlayer, setUserPlayer] = useState<Turn>(START_PLAYER);

    /** enable cpu playing */
    const [isCpuPlaying, setIsCpuPlaying] = useState<boolean>(true);

    /** type of game playing */
    const [playMode, setPlayMode] = useState<string>(getPlayModeName('a'));

    /** data for winner, useful to draw the win line */
    const [winData, setWinData] = useState<WinData | null>(null);

    /** starts a new game against CPU, player plays with X */
    const cpuXClick = () => {
        startNewGame();
        setUserPlayer(TurnList.x);
        setIsCpuPlaying(true);
        setPlayMode(getPlayModeName('a'));
    };

    /** starts a new game against CPU, player plays with O */
    const cpuOClick = () => {
        const board = generateBoard(BOARD_SIZE);
        const move = cpuPlay(board, TurnList.x, TurnList.x, BOARD_SIZE);
        setPlayMode(getPlayModeName('b'));
        if (move.coords) {
            const result = addMarkAt(board, move.coords, TurnList.x);
            startNewGame(result.board);
            setUserPlayer(TurnList.o);
            setIsCpuPlaying(true);
        }
    };

    /** starts a new game against CPU, player plays with X both marks */
    const twoPlayerClick = () => {
        startNewGame();
        setIsCpuPlaying(false);
        setPlayMode(getPlayModeName('c'));
    };

    /** reset all data */
    const startNewGame = (board: Board = generateBoard(BOARD_SIZE)) => {
        setUserPlayer(START_PLAYER);
        setBoard(board);
        setIsBoardFull(false);
        setWinData(null);
    };

    /** play a turn as CPU */
    const playCpu = (turn: Turn): null => {
        if (isBoardFull || winData !== null || turn === userPlayer) return null;

        const move = cpuPlay(board, turn, turn, BOARD_SIZE);
        if (move.coords) {
            const result = addMarkAt(board, move.coords, turn);
            setBoard([...result.board]);
            setIsBoardFull(checkBoardFull(result.board, BOARD_SIZE));

            setWinData(checkWin(result.board, BOARD_SIZE, move.coords, turn));
        }

        return null;
    }

    /** play a turn as player */
    const play = (x: number, y: number): null => {
        if (isBoardFull || winData !== null) return null;

        const result = addMarkAt(board, { x, y }, userPlayer);
        if (result.moved) {
            setBoard([...result.board]);
            setIsBoardFull(checkBoardFull(result.board, BOARD_SIZE));

            const winData = checkWin(result.board, BOARD_SIZE, { x, y }, userPlayer);
            if (winData) {
                setWinData(winData);
            } else {
                const newTurn = toggleTurn(userPlayer);
                if (isCpuPlaying) {
                    setTimeout(() => playCpu(newTurn), 50);
                } else {
                    setUserPlayer(newTurn);
                }
            }
        }

        return null;
    };

    /** returns the game over message */
    const gameOver = (winner: SlotValue, isBoardFull: boolean) => {
        const text = getWinnerText(winner, isBoardFull);
        if (text) {
            return <p className="end-text text-center my-4">{text}</p>;
        }

        return <></>;
    };

    return (
        <>
            <Header cpuXClick={() => cpuXClick()} cpuOClick={() => cpuOClick()} twoPlayerClick={() => twoPlayerClick()} />

            <div className="container mx-auto px-4">
                <p className="text-center my-4">{playMode}</p>

                <div className="board-container">
                    <div className="board-container__background-column">
                        {[...Array(BOARD_SIZE - 1)].map((n, i) => <div key={i} className="board-container__column-separator"></div>)}
                    </div>
                    <div className="board-container__background-row">
                        {[...Array(BOARD_SIZE - 1)].map((n, i) => <div key={i} className="board-container__row-separator"></div>)}
                    </div>

                    <div className="board">
                        {board.map((column, x) => <div className="board__column" key={x}>
                            {column.map((value, y) => <div onClick={() => play(x, y)} key={y}>
                                <Slot value={value} />
                            </div>)}
                        </div>)}
                    </div>

                    {winData !== null ? <WinLine winData={winData} board={board} /> : null}
                </div>

                {gameOver(winData ? winData.turn : null, isBoardFull)}
            </div>
        </>
    );
}
