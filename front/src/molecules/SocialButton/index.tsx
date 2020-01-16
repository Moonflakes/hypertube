import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { DefaultTheme } from 'styled-components';
import { FacebookSquare, Google } from 'styled-icons/boxicons-logos';

import { Button } from '../../atoms';
import { Icon } from '../../atoms';

interface SocialButtonProps extends React.ButtonHTMLAttributes<any> {
    theme?: DefaultTheme
    variant: 'facebook' | 'google' | '42' 
}

const variants = {
    facebook: <FacebookSquare size={35} />,
    google: <Google size={35} />,
    "42": <Icon name="42"></Icon>,
}

const SocialButton = ({ variant, ...props }: SocialButtonProps) => {
    const { t } = useTranslation();

    return (
        <Button type='button' variant="big" textAlign="justify" {...props}>
            {variants[variant]} {t('social', { variant: variant.charAt(0).toUpperCase() + variant.slice(1) })}
        </Button>
    )
}

export default styled(SocialButton)`
    font-family: ${({ theme }: SocialButtonProps) => theme.font.helveticaNeue};
    font-size: 18px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 0.2px;
    color: ${({ theme }: SocialButtonProps) => theme.colors.white};
    text-align: center;

    svg {
        margin-right: 5px;
    }
`;