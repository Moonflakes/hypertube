import React from 'react'
import styled, { DefaultTheme } from 'styled-components';

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    theme?: DefaultTheme
    error?: any
}

const Input = styled.input<InputProps>`
    padding: 16px 20px;
    background-color: ${({ theme }: InputProps) => theme.colors.strongGrey};
    border-radius: 8px;
    color: ${({ theme }: InputProps) => theme.colors.primaryGrey};
    font-family: ${({ theme }: InputProps) => theme.colors.helvetica};
    font-size: 18px;
    outline: none;
    border: none;
    border-bottom: 2px solid transparent;

    &:-webkit-autofill,
    &:-webkit-autofill:hover, 
    &:-webkit-autofill:focus, 
    &:-webkit-autofill:active  {
        -webkit-box-shadow: 0 0 0 30px ${({ theme }: InputProps) => theme.colors.strongGrey} inset !important;
        -webkit-text-fill-color: ${({ theme }: InputProps) => theme.colors.primaryGrey} !important;
        border: 1px solid ${({ theme }: InputProps) => theme.colors.strongGrey} !important;
    }

    ${({ error, theme }: InputProps) => error && `
        border-color: ${theme.colors.primaryOrange};
    `}
`

Input.displayName = "Input"

export default Input;