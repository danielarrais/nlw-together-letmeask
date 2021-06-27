import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import QuestionType from "../types/Question";


type FirebaseQuestionType = Record<string, QuestionType>

export default function useRoom(roomId: string) {
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();

            if (databaseRoom === null) return;

            const firebaseQuestions: FirebaseQuestionType = databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map<QuestionType>(([id, question]) => {
                return {
                    id: id,
                    content: question.content,
                    author: {
                        name: question.author.name,
                        avatar: question.author.avatar
                    },
                    isHighlighted: question.isHighlighted,
                    isAnswered: question.isAnswered
                }
            });

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions);
        });

    }, [roomId])

    return { questions, title }
}