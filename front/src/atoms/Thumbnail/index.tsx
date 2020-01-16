import React from 'react';
import styled from 'styled-components';

interface ThumbnailProps extends React.DetailedHTMLFactory<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    variant: 'small' | 'normal' | 'big'
}

const variants = {
    small: `
        width: 132px;
        height: 196px;
    `,
    normal: `
        height: 100%;
    `,
    big: `
        width: 250px;
        height: 385px;
    `
}

const Thumbnail = styled.img<ThumbnailProps>`
    ${({ variant }: ThumbnailProps) => variants[variant]}
`

Thumbnail.defaultProps = {
    variant: 'normal'
}

export default Thumbnail;