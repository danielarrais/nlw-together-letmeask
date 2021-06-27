import { ButtonHTMLAttributes } from 'react';

import './style.scss'

type ButtonPropsType = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
}

export default function Button({ isOutlined = false, ...props }: ButtonPropsType) {
    return <button className={`button ${isOutlined ? 'outlined' : ''}`} {...props} />
}