import { PositionType } from "@/types";

type Props = {
    value: PositionType,
};

export default function Position({ value }: Props) {
    return <div>
        {value === null ? 'null' : value}
    </div>;
}
