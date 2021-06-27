import { ReactNode } from 'react';
import cx from 'classnames';

import './style.scss'

type QuestionProps = {
    content: string,
    author: {
        name: string,
        avatar: string,
    };
    children?: ReactNode,
    isHighlighted?: boolean,
    isAnswered?: boolean,
}

export default function Question({
    content,
    author,
    children,
    isHighlighted,
    isAnswered
}: QuestionProps) {

    const userInfoStyle = cx('question', { answered: isHighlighted }, { highlighted: isHighlighted && !isAnswered })

    return (
        <div className={userInfoStyle}>
            <p>{content}</p>
            <footer>
                <div className="user-info" >
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div >
    );
}