import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { DefaultTheme } from 'styled-components';
import { Play as PlayIcon } from 'styled-icons/boxicons-regular';

import { Button } from '../../atoms';

interface PlayButtonProps extends React.ButtonHTMLAttributes<any> {
    theme?: DefaultTheme
    onClick?: any
}

const PlayIconResponsive = styled(PlayIcon)`
    @media screen and (max-width: 1300px) and (min-width: 640px) {
        width: 2.3vw;
        height: 2.3vw;
    }
    @media screen and (max-width: 640px) and (min-width: 0px) {
        width: 14.719px;
        height: 14.719px;
    }
`

const PlayButton =
    (props: PlayButtonProps) => {
        const { t } = useTranslation();

        return (
            <Button variant="small" {...props}>
                <PlayIconResponsive size={30} /> {t('play')}
            </Button>
        )
    }

export default styled(PlayButton)`
    font-family: ${({ theme }: PlayButtonProps) => theme.font.helveticaNeue};
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 0.2px;
    color: ${({ theme }: PlayButtonProps) => theme.colors.white};
    border-radius: 0;
    padding: 10px 20px 10px 15px;

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
