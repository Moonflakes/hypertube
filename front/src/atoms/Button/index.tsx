import React from 'react';
import styled, { DefaultTheme } from 'styled-components'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    theme: DefaultTheme
    variant?: 'small' | 'normal' | 'big'
    backgroundColor?: string
    backgroundColorHover?: string
    color?: string
    textAlign?: string
}

const variants = {
  small: '100px',
  normal: '135px',
  big: '300px',
}

const Button = styled.button<ButtonProps>`
  background-color: ${(props: ButtonProps) =>
    props.backgroundColor || props.theme.colors.primaryRed};
  color: ${(props: ButtonProps) => props.color || props.theme.colors.white};
  text-align: ${(props: ButtonProps) => props.textAlign};
  cursor: pointer;
  position: relative;
  min-width: ${(props: ButtonProps) => variants[props.variant]};
  height: 47px;
  padding: 0 14px;
  border: none;
  transition: background 0.8s;
  border-radius: 8px;
  ${(props: ButtonProps) => props.theme.elevation["2dp"]};

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${(props: ButtonProps) =>
      props.backgroundColorHover || props.theme.colors.secondaryRed};
    ${(props: ButtonProps) => props.theme.elevation["8dp"]};
    background: #80050b radial-gradient(circle, transparent 1%, #80050b 1%) center/15000%;
  }
  
  &:active {
    background-color: #e50914;
    background-size: 100%;
    transition: background 0s;
  }
`

Button.defaultProps = {
    variant: 'normal',
}

export default Button;