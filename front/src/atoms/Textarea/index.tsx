import React from 'react';
import styled, { DefaultTheme } from 'styled-components';

interface TextareaProps extends React.DetailedHTMLFactory<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    theme?: DefaultTheme
    error?: any
}

const Textarea = styled.textarea`
    padding: 16px 20px;
    background-color: ${({ theme }: TextareaProps) => theme.colors.strongGrey};
    color: ${({ theme }: TextareaProps) => theme.colors.primaryGrey};
    font-family: ${({ theme }: TextareaProps) => theme.colors.helvetica};
    font-size: 18px;
    outline: none;
    border: solid 1px ${({ theme }: TextareaProps) => theme.colors.primaryGrey};
    width: 100%;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus, 
    &:-webkit-autofill:active  {
        -webkit-box-shadow: 0 0 0 30px ${({ theme }: TextareaProps) => theme.colors.strongGrey} inset !important;
        -webkit-text-fill-color: ${({ theme }: TextareaProps) => theme.colors.primaryGrey} !important;
        border: 1px solid ${({ theme }: TextareaProps) => theme.colors.strongGrey} !important;
    }

    ${({ error, theme }: TextareaProps) => error && `
        border-bottom: 2px solid  ${theme.colors.primaryOrange}
    `}
`

export default Textarea;