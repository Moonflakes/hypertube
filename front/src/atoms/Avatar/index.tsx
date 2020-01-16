import styled from 'styled-components';

interface AvatarProps {
    variant?: 'small' | 'big' | 'squared' | 'big2'
    src: String
}

const variants = {
    squared: `
        width: 30px;
        height: 30px;
        border-radius: 0;
        object-fit: cover;
    `,
    small: `
        width: 90px;
        height: 90px;
        object-fit: cover;
        margin-left: 50px;
    `,
    big: `
        width: 125px;
        height: 125px;
        object-fit: cover;
        object-position: top;
    `,
    big2: `
        width: 200px;
        height: 200px;
    `
}

const Avatar =
    styled.img.attrs(({ variant }: AvatarProps) => ({
        variant: variant || 'small'
    }))`
        border-radius: 100%;
        ${({ variant }: AvatarProps) => variants[variant]}
    `

export default Avatar;