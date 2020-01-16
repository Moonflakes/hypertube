import React from 'react';
import styled, { DefaultTheme } from 'styled-components'

interface RadioProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
    theme?: DefaultTheme
}

const Radio: React.FC<RadioProps> = styled.input.attrs(() => ({
    type: 'radio'
}))`
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 50%;
    width: 16px;
    height: 16px;

    border: 2px solid ${({ theme }: RadioProps) => theme.colors.primaryRed};
    transition: 0.2s all linear;

    &:active,
    &:focus {
        outline: none;
    }

    &:checked {
        border: 8px solid ${({ theme }: RadioProps) => theme.colors.primaryRed};
    }
`

export default Radio;