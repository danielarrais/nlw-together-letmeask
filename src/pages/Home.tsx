
import { useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoGoogleImg from '../assets/images/google-icon.svg';
import Button from '../components/Button'

import '../styles/auth.scss';
import useAuth from '../hooks/useAuth';
import { ChangeEvent } from 'react';
import { database } from '../services/firebase';

export default function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        if (roomCode.trim() === '') return;

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            alert('Room does not exists!');
            return;
        }

        history.push(`rooms/${roomCode}`);
    }

    async function handleInputCodeRoom(event: ChangeEvent<HTMLInputElement>) {
        setRoomCode(event.target.value);
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Criei salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência ao-vivo</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={logoGoogleImg} alt="Logo do google" />
                        Crie sua sala com o google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={handleInputCodeRoom}
                            value={roomCode}
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    );
}