import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import QuestionType from "../types/QuestionType";
import useAuth from "./useAuth";


type FirebaseQuestionType = Record<string, QuestionType>

export default function useRoom(roomId: string) {
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();

            if (databaseRoom === null) return;

            const firebaseQuestions: FirebaseQuestionType = databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map<QuestionType>(([id, question]) => {
                const likeId = Object.entries(question.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0];
                const likeCount = Object.values(question.likes ?? {}).length;

                return {
                    id: id,
                    content: question.content,
                    author: {
                        name: question.author.name,
                        avatar: question.author.avatar
                    },
                    isHighlighted: question.isHighlighted,
                    isAnswered: question.isAnswered,
                    likeCount: likeCount,
                    likeId: likeId
                }
            });

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions);

            return () => {
                roomRef.off('value');
            }
        });

    }, [roomId, user])

    return { questions, title }
}