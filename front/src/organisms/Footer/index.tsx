import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { useTranslation } from 'react-i18next'

import { LanguageSelectorForm } from '../../molecules'

interface FooterProps {
    className?: string
}

const Copyright = styled.span`
    color: #999;
    font-size: 11px;
    margin-top: 10px;
`

const Footer = styled(({ className }: FooterProps) => {
    const { t } = useTranslation();

    return (
        <footer className={className}>
            <LanguageSelectorForm />
            <Copyright>{t('copyright')}</Copyright>
        </footer>
    )
})`
    display: flex;
    flex-direction: column;
    align-items: baseline;
    padding: 72px 153px 68px;
    background-color: black;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    ${({ theme }: { theme: DefaultTheme }) => (`
        @media only screen and (max-width: ${theme.breakpoints.xs}) {
            background-color: none;
            padding: 12px 0px 8px;
            align-items: center;
            position: fixed;
        }
    `)}
`

export default Footer;