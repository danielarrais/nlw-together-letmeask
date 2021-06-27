import { History } from 'history';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import Question from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import useAuth from '../hooks/useAuth';
import useRoom from '../hooks/useRoom';
import { database } from '../services/firebase';
import '../styles/room.scss';



type RoomParamsType = { id: string }

export default function AdminRoom() {
    const params = useParams<RoomParamsType>();
    const history = useHistory();
    const roomId = params.id;
    const { user, signInWithGoogle } = useAuth();
    const [newQuestion, setNewQuestion] = useState('');
    const { questions, title } = useRoom(roomId);

    redirectIfNotExistingRoom(roomId, history);

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') return;
        if (!user) throw new Error('Você tem que está logado!');

        const question = {
            content: newQuestion.trim(),
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');
    }

    function handleQuestionInput(event: ChangeEvent<HTMLTextAreaElement>) {
        setNewQuestion(event.target.value);
    }

    function handleLoginButton() {
        signInWithGoogle();
    }

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