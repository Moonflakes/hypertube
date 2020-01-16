import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

interface TypographyProps {
    variant: number
    theme?: DefaultTheme
    i18Options?: Object
    children?: string | string[]
    i18nKey?: string
    as?: string
    className?: string
    id?: string
}

const styles = [
    ({ theme }: TypographyProps) => `
        font-family: ${theme.font.helveticaNeue};
        font-size: 20px;
        color: ${theme.colors.primaryGrey};
    `,
    ({ theme }: TypographyProps) => `
        font-family: ${theme.font.helveticaNeue};
        font-size: 20px;
        font-weight: bold;
        color: ${theme.colors.primaryGrey};
    `,
    ({ theme }: TypographyProps) => `
        font-family: ${theme.font.lato};
        font-size: 18px;
        color: ${theme.colors.primaryGrey};
    `,
    ({ theme }: TypographyProps) => `
        font-family: ${theme.font.helvetica};
        font-size: 18px;
        color: ${theme.colors.white};
    `,
    ({ theme }: TypographyProps) => `
        font-family: ${theme.font.helvetica};
        font-size: 18px;
        color: ${theme.colors.primaryGrey};
    `,
    ({ theme }: TypographyProps) => `
        font-family: ${theme.font.lato};
        font-size: 14px;
        color: ${theme.colors.primaryGrey};
    `,
    ({ theme }: TypographyProps) => `
        font-family: ${theme.font.helveticaNeue};
        font-size: 16px;
        font-weight: bold;
        color: ${theme.colors.primaryGrey};
    `,
]

const Typography = styled(({
    children, i18Options = {}, variant = 1, i18nKey, as = 'p', ...props }: TypographyProps
) => {
    const { t } = useTranslation()

    return React.createElement(as, props, [
        i18nKey ? t(i18nKey, i18Options) : children
    ]);
})`
    ${({ variant, ...props }: TypographyProps) => styles[variant - 1]({ ...props, variant })}
`

export default Typography;