import { Link } from 'react-router-dom';
import { FormEvent, useState, ChangeEvent } from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button'

import '../styles/auth.scss';
import { database } from '../services/firebase';
import useAuth from '../hooks/useAuth';

export default function NewRoom() {
    const [newRoom, setNewRoom] = useState('');
    const { user } = useAuth();

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') return;

        const roomRef = database.ref('rooms');

        await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        });
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        setNewRoom(event.target.value)
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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={handleInputChange}
                            value={newRoom}
                        />
                        <Button type="submit">Criar sala</Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
                </div>
            </main>
        </div>
    );
}