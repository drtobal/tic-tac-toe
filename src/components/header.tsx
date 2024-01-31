type Props = {
    cpuXClick: () => void;
    cpuOClick: () => void;
    twoPlayerClick: () => void;
};

export default function Header(props: Props) {
    return <div className="container mx-auto px-4 flex flex-row justify-center items-center py-4 gap-4">
        <button onClick={props.cpuXClick} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
            Vs CPU X
        </button>
        <button onClick={props.cpuOClick} className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:orange-blue-500 rounded">
            Vs CPU O
        </button>
        <button onClick={props.twoPlayerClick} className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:green-blue-500 rounded">
            Two Player
        </button>
    </div>
}
