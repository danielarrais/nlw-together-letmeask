import copyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss'

type PropsType = {
    code: string
}

export function RoomCode(props: PropsType) {

    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code)
    }

    return (
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="Copiar Código da Sala" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    );
}