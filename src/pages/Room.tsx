import { ChangeEvent } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { RoomCode } from '../components/RoomCode';
import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';

import '../styles/room.scss'
import { database } from '../services/firebase';
import { FormEvent } from 'react';

type RoomParamsType = {
    id: string
}

export default function Room() {
    const { user, signInWithGoogle } = useAuth();
    const params = useParams<RoomParamsType>();
    const [newQuestion, setNewQuestion] = useState('');
    const roomId = params.id;

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
                    <h1>Sala React</h1>
                    <span>4 perguntas</span>
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
            </main>
        </div>
    );
}