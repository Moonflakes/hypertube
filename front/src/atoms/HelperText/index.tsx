import styled, { DefaultTheme } from 'styled-components'

interface HelperTextProps {
    theme?: DefaultTheme
    variant: 'warning' | 'danger' | 'info'
}

const colorByVariant = {
    warning: "primaryOrange",
    danger: "primaryRed",
    info: "primaryGrey"
};

const HelperText = styled.p.attrs((props:HelperTextProps) => ({
    variant: props.variant || 'info'
}))`
    color: ${({ variant, theme }: HelperTextProps) => theme.colors[colorByVariant[variant]]};
    font-size: 12px;
    margin-bottom: 6px;
    min-height: 18px;
`

export default HelperText;