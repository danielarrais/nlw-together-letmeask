import { History } from 'history';
import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../../assets/images/logo.svg';
import Button from '../../components/Button';
import Question from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';
import useRoom from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import './style.scss';

type RoomParamsType = { id: string }

export default function AdminRoom() {
    const params = useParams<RoomParamsType>();
    const history = useHistory();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    redirectIfNotExistingRoom(roomId, history);

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined={true}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>{title}</h1>
                    {questions.length > 0 && <span> {questions.length} pergunta(s)</span>}
                </div>
                <div className="question-list">
                    {questions.map((question) => {
                        return <Question key={question.id} content={question.content} author={question.author} />
                    })}
                </div>
            </main>
        </div>
    );
}

async function redirectIfNotExistingRoom(roomId: string, history: History) {
    await database.ref(`rooms/${roomId}`).get().then((room) => {
        if (!room.exists()) {
            history.push('/');
        }
    })
}