import styled, { DefaultTheme } from 'styled-components'

interface LabelProps {
    theme?: DefaultTheme
}

const Label = styled.span`
  min-width: 6vw;
  padding: 3px 6px;
  border-radius: 8px;
  border: solid 1px #979797;
  font-size: 1.1vw;
  color: ${(props: LabelProps) => props.theme.colors.white};
  font-family: ${(props: LabelProps) => props.theme.font.helveticaNeue};
  text-align: center;

  @media screen and (max-width: 680px) {
    font-size: 10px;
    min-width: 55px;
  }
`

export default Label;