import { History } from 'history';
import { useHistory, useParams } from 'react-router-dom';
import { database } from '../../services/firebase';
import { RoomCode } from '../../components/RoomCode';

import logoImg from '../../assets/images/logo.svg';
import trashImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';
import Button from '../../components/Button';
import Question from '../../components/Question';
import useRoom from '../../hooks/useRoom';

import './style.scss';

type RoomParamsType = { id: string }

export default function AdminRoom() {
    const params = useParams<RoomParamsType>();
    const history = useHistory();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    redirectIfNotExistingRoom(roomId, history);

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir a pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ isAnswered: true });
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ isHighlighted: true });
    }

    async function handleClosedRoom() {
        if (window.confirm('Tem certeza que você encerrar esta sala?')) {
            await database.ref(`rooms/${roomId}`).update({ closedAt: new Date() });
        }

        history.push('/')
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button onClick={handleClosedRoom} isOutlined={true}>Encerrar Sala</Button>
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
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isHighlighted={question.isHighlighted}
                                isAnswered={question.isAnswered}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                            <img src={answerImg} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button type="button" onClick={() => handleHighlightQuestion(question.id)}>
                                            <img src={checkImg} alt="Dar destaque à pergunta" />
                                        </button>
                                    </>
                                )}
                                <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src={trashImg} alt="Excluir pergunta" />
                                </button>
                            </Question>
                        )
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