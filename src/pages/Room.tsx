import { useHistory, useParams } from 'react-router-dom';
import { RoomCode } from '../components/RoomCode';
import { database } from '../services/firebase';
import { FormEvent, useState, ChangeEvent } from 'react';
import { History } from 'history';

import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';
import Question from '../components/Question';

import '../styles/room.scss'
import useRoom from '../hooks/useRoom';

type RoomParamsType = { id: string }

export default function Room() {
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
                    <RoomCode code={roomId} />
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>{title}</h1>
                    {questions.length > 0 && <span> {questions.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        value={newQuestion}
                        onChange={handleQuestionInput}
                        placeholder="O que você quer perguntar?"
                    />
                    <div className="form-footer">
                        {!user ? (
                            <span>Para enviar uma pergunta <button type="button" onClick={handleLoginButton}>faça seu login</button>.</span>
                        ) : (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        )}
                        <Button disabled={!user} type="submit">Enviar pergunta</Button>
                    </div>
                </form>
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