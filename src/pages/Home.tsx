import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { firebase, auth } from '../services/firebase'

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoGoogleImg from '../assets/images/google-icon.svg';
import Button from '../components/Button'

import '../styles/auth.scss';
import { AuthContext } from '../contexts/AuthContext'

export default function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useContext(AuthContext);

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
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
                    <form>
                        <input type="text" placeholder="Digite o código da sala" />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    );
}