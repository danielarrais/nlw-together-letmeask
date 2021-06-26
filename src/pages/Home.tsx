import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoGoogleImg from '../assets/images/google-icon.svg';
import Button from '../components/Button'
import { useHistory } from 'react-router-dom';

import '../styles/auth.scss';

export default function Home() {
    const history = useHistory();

    function navigateToNewRoom() {
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
                    <button onClick={navigateToNewRoom} className="create-room">
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