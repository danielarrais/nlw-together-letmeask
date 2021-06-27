import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

type ButtonPropsType = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
}

export default function Button({ isOutlined = false, ...props }: ButtonPropsType) {
    return <button className={`button ${isOutlined ? 'outlined' : ''}`} {...props} />
}