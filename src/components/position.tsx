import { PositionType } from "@/types";

type Props = {
    value: PositionType,
};

export default function Position({ value }: Props) {
    const printMark = (mark: PositionType) => {
        switch (mark) {
            case 0:
                return <div className="mark-x">
                    <div className="mark-x__line-first"></div>
                    <div className="mark-x__line-second"></div>
                </div>
            case 1:
                return <div className="mark-o">
                    <div className="mark-o__circle"></div>
                </div>;
            default:
                return <></>
        }
    }

    return <div className="mark">
        {printMark(value)}
    </div>;
}
