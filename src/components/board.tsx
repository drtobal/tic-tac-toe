import { BOARD_SIZE, START_PLAYER, TurnList } from "@/constants";
import { addMarkAt, checkBoardFull, checkWin, cpuPlay, generateBoard, getPlayModeName, getWinnerText, toggleTurn } from "@/methods";
import { Board, SlotValue, Turn, WinData } from "@/types";
import { useState } from "react";
import Slot from './slot';
import Header from './header';
import WinLine from './win-line';

export default function Board() {
    const [board, setBoard] = useState<Board>(generateBoard(BOARD_SIZE));

    const [isBoardFull, setIsBoardFull] = useState<boolean>(false);

    const [userPlayer, setUserPlayer] = useState<Turn>(START_PLAYER);

    const [isCpuPlaying, setIsCpuPlaying] = useState<boolean>(true);

    const [playMode, setPlayMode] = useState<string>(getPlayModeName('a'));

    const [winData, setWinData] = useState<WinData | null>(null);

    const cpuXClick = () => {
        startNewGame();
        setUserPlayer(TurnList.x);
        setIsCpuPlaying(true);
        setPlayMode(getPlayModeName('a'));
    };

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

    const twoPlayerClick = () => {
        startNewGame();
        setIsCpuPlaying(false);
        setPlayMode(getPlayModeName('c'));
    };

    const startNewGame = (board: Board = generateBoard(BOARD_SIZE)) => {
        setUserPlayer(START_PLAYER);
        setBoard(board);
        setIsBoardFull(false);
        setWinData(null);
    };

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

    const endGame = (winner: SlotValue, isBoardFull: boolean) => {
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

                {endGame(winData ? winData.turn : null, isBoardFull)}
            </div>
        </>
    );
}
