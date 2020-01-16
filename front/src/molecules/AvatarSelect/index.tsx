import React, { useState } from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { DotsHorizontalRounded } from 'styled-icons/boxicons-regular';
import { Close } from 'styled-icons/material';

import { Avatar } from '../../atoms'

const MAX_AVATARS = {
    FEMALE: 114,
    MALE: 129
}

const allAvatars = [
    ...Array.from({ length: MAX_AVATARS.FEMALE }).map((_, i) => `/female/${i + 1}`),
    ...Array.from({ length: MAX_AVATARS.MALE }).map((_, i) => `/male/${i + 1}`)
].sort(() => Math.random() - 0.5)

const getRandomAvatar = ({ max, gender, array }: { max: number, gender: string, array: string[]}):string => {
    const randomAvatar = `/${gender}/${Math.floor(Math.random() * max) + 1}`

    return array.includes(randomAvatar)
        ? getRandomAvatar({ max, gender, array })
        : randomAvatar;
}

const getRandomAvatars = (nb: number):string[] =>
    ([
        ...Array.from({ length: nb / 2 + nb % 2 })
            .reduce<string[]>((array, c) => [...array, getRandomAvatar({ max: MAX_AVATARS.FEMALE, gender: 'female', array })], []),
        ...Array.from({ length: nb / 2 })
            .reduce<string[]>((array, c) => [...array, getRandomAvatar({ max: MAX_AVATARS.MALE, gender: 'male', array })], [])
    ].sort(() => Math.random() - 0.5))

interface AvatarProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    className?: string
    visibleAvatarsCount: number
    defaultValue?: string
    forwardRef?: any
}

interface AvatarListProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    avatars: any
    selectedAvatar: string
    onShowMoreButtonClick?: any
    isAllAvatarsShowed?: boolean
    onAvatarClick: any
}

const AvatarList = styled(({
    avatars,
    selectedAvatar,
    onShowMoreButtonClick,
    isAllAvatarsShowed,
    onAvatarClick,
    ...props
}: AvatarListProps) => {
    const { t } = useTranslation();

    return (
        <div {...props}>
            {avatars.map((src:string) => (
                <Avatar
                    variant="squared"
                    className={src === selectedAvatar ? 'selected' : ''}
                    src={`${process.env.PUBLIC_URL}/avatars${src}.png`}
                    data-src={src}
                    onClick={onAvatarClick}
                    key={props.id ? props.id + src : src} />
            ))}
            {onShowMoreButtonClick && (
                <OverlayTrigger
                    placement={'top'}
                    overlay={
                        <Tooltip id={`tooltip-show-more-avatars`}>
                            {t(isAllAvatarsShowed ? 'hide-more-avatars' : 'show-more-avatars')}
                        </Tooltip>
                    }
                >
                    {isAllAvatarsShowed
                        ? <Close
                            size={46}
                            onClick={() => onShowMoreButtonClick(false)} />
                        : <DotsHorizontalRounded
                            size={46}
                            onClick={() => onShowMoreButtonClick(true)} />}
                </OverlayTrigger>
            )}
        </div>
    );
})`
    display: flex;
    flex-wrap: wrap;

    ${Avatar} {
        width: 50px;
        height: 50px;
        margin: 5px 5px;
        border: 2px solid transparent;

        &.selected {
            border: 2px solid white;
        }
    }

    svg {
        margin: 5px 5px;
        color: white;
        position: relative;
        top: 2px;
        cursor: pointer;
    }
`

const AvatarSelect = styled(({ className, visibleAvatarsCount, forwardRef, ...props }: AvatarProps) => {
    const [visibleAvatars, setVisibleAvatars] = useState(props.defaultValue
        ? [props.defaultValue, getRandomAvatars(visibleAvatarsCount - 1)]
        : getRandomAvatars(visibleAvatarsCount));
    const [selectedAvatar, setSelectedAvatar] = useState(props.defaultValue || '');
    const [isAllAvatarsShowed, setIsAllAvatarsShowed] = useState(false);
    
    const handleOnAvatarClick = (e:any):any => {
        const avatar = e.currentTarget.getAttribute('data-src');

        setSelectedAvatar(avatar);

        if (!visibleAvatars.includes(avatar))
            setVisibleAvatars([avatar, ...visibleAvatars.slice(1)])
    };
        
    return (
        <div className={className}>
            <input type="hidden" ref={forwardRef} {...props} value={selectedAvatar} />

            <AvatarList
                avatars={visibleAvatars}
                selectedAvatar={selectedAvatar}
                onAvatarClick={handleOnAvatarClick}
                onShowMoreButtonClick={setIsAllAvatarsShowed}
                isAllAvatarsShowed={isAllAvatarsShowed}
            />

            {isAllAvatarsShowed && <AvatarList
                id="all-avatars"
                avatars={allAvatars}
                selectedAvatar={selectedAvatar}
                onAvatarClick={handleOnAvatarClick}
            />}
        </div>
    );
})`
    ${({ theme }: { theme: DefaultTheme }) => (`
        @media only screen and (max-width: ${theme.breakpoints.xs}) {
            position: relative;
        }
    `)}
    #all-avatars {
        position: absolute;
        max-width: 85px;
        right: -95px;
        top: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.7);
        border-radius: 8px;
        justify-content: center;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        }
        &::-webkit-scrollbar-thumb {
          background-color: darkgrey;
          outline: 1px solid slategrey;
        }

        ${({ theme }: { theme: DefaultTheme }) => (`
            @media only screen and (max-width: ${theme.breakpoints.xs}) {
                max-width: initial;
                right: 0;
                left: 0;
                top: -35vh;
                bottom: 100%;
            }
        `)}
    }
`;

AvatarSelect.displayName = "AvatarSelect";

export default AvatarSelect;