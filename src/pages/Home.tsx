import { useNavigate } from 'react-router-dom'
import { FormEvent, useState } from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';


import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/auth.scss';

export function Home(){
    const navigate = useNavigate();
    const {  user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');


    async function handleCreateRoom() {
        if(!user){
            await signInWithGoogle()
        }
        
        navigate('rooms/new');
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if ( roomCode.trim() === ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if(!roomRef.exists()) {
            alert('Room does not exists.');
            return;
        }

        if(roomRef.val().endedAt) {
            alert('Room already closed.');
            return;
        }

        navigate(`/rooms/${roomCode}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Illustration Image showing questions and answers" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real.</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Logo Image" />

                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Google" />
                        Crie sua sala com o Google
                    </button>

                    <div className="separator"> ou entre em um sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>                        
                    </form>
                </div>
            </main>
        </div>
    )
}