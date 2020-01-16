import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { DefaultTheme } from 'styled-components';

import { Button } from '../../atoms';

interface MyListButtonProps extends React.ButtonHTMLAttributes<any> {
    theme?: DefaultTheme
    icon?: any
    onClick: any
}

const MyListButton =
    (props: MyListButtonProps) => {
        const { t } = useTranslation();

        return (
            <Button
                variant="small"
                backgroundColor="transparent"
                {...props}>
                {React.cloneElement(props.icon, { size: 30 })} {t('my-list')}
            </Button>
        )
    }

export default styled(MyListButton)`
    font-family: ${({ theme }: MyListButtonProps) => theme.font.helveticaNeue};
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 0.2px;
    color: ${({ theme }: MyListButtonProps) => theme.colors.white};
    border-radius: 0;
    padding: 9px 20px 10px 15px;
    transition: all 0.333s ease;
    border: 1px solid ${({ theme }: MyListButtonProps) => theme.colors.white};
    display: flex;
    align-items: center;

    &:hover {
        color: ${({ theme }: MyListButtonProps) => theme.colors.black}
        background: none!important;
        background-color: ${({ theme }: MyListButtonProps) => theme.colors.white}!important;
    }

    @media screen and (max-width: 1300px) and (min-width: 640px) {
        font-size: 1.1vw;
        height: 3.7vw;
        padding: 0.75vw 1.2vw 0.75vw 1vw;
        min-width: 0px;
    }
    @media screen and (max-width: 640px) and (min-width: 0px) {
        font-size: 7px;
        height: 24px;
        padding: 4.8px 7.8px 4.8px 6.5px;
        min-width: 70.5px;
    }
`;
