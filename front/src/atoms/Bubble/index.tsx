import React from 'react';
import styled, { DefaultTheme } from 'styled-components'

interface BubbleProps {
  theme?: DefaultTheme
}

const Bubble: React.FC<BubbleProps> = styled.div`
  position: relative;
  padding: 1em;
  border: 1px solid #999;
  background: black;
  width: 400px;
  color: ${(props: BubbleProps) => props.theme.colors.white};
  word-wrap: break-word;

  &:before, &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    border-bottom: 0;
  }

  &:before {
    bottom: -1px;
    right: -50px;
    border-top-color: ${(props: BubbleProps) => props.theme.colors.white};
    border-width: 25px 0 25px 50px;
    transform: rotate(180deg);
  }

  &:after {
    bottom: 0px;
    right: -46px;
    border-top-color: black;
    border-width: 25px 0 25px 50px;
    transform: rotate(180deg);
  }
`;

export default Bubble;