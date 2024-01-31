import { AnyObject, Board, WinData } from "@/types";

type Props = {
    winData: WinData,
    board: Board,
};

const winLineStyles = (board: Board, winData: WinData): { class: string, style: AnyObject } => {
    if (!winData) {
        return { class: '', style: {} };
    }

    const size = board.length;

    switch (winData.type) {
        case 'column':
            return { class: 'column', style: { left: `${(100 / size) * winData.coords.x}%` } }
        case 'row':
            return { class: 'row', style: { top: `${(100 / size) * winData.coords.y}%` } }
        case 'diagonal':
        case 'reverse-diagonal':
            return { class: winData.type, style: {} };
    }
};

export default function WinLine(props: Props) {
    const classStyles = winLineStyles(props.board, props.winData);

    return <div className="win">
        <div className={`win__${classStyles.class}`} style={classStyles.style}>
            {['diagonal', 'reverse-diagonal'].indexOf(props.winData.type) > -1 ? <div className="win__line"></div> : null}
        </div>
    </div>;
}
