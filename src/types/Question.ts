type QuestionType = {
    id: string,
    content: string,
    author: {
        name: string,
        avatar: string
    },
    isHighlighted: boolean,
    isAnswered: boolean
}

export default QuestionType;