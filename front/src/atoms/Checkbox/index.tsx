import React from 'react';
import styled, { DefaultTheme } from 'styled-components'

interface CheckboxProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
    theme?: DefaultTheme
}

const Checkbox: React.FC<CheckboxProps> = styled.input.attrs(() => ({
    type: 'checkbox'
}))`
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;

    border: 2px solid ${({ theme }: CheckboxProps) => theme.colors.primaryRed};
    transition: 0.2s all linear;

    &:checked {
        border: 8px solid ${({ theme }: CheckboxProps) => theme.colors.primaryRed};
    }
`

export default Checkbox;