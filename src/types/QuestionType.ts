type QuestionType = {
    id: string,
    content: string,
    author: {
        name: string,
        avatar: string
    },
    isHighlighted: boolean,
    isAnswered: boolean,
    likes?: Record<string, {
        authorId: string
    }>
    likeCount: number,
    likeId: string | undefined,
}

export default QuestionType;