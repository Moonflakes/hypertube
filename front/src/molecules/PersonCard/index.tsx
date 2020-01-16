import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Avatar, Typography } from '../../atoms';

interface PersonCardProps extends React.HTMLAttributes<React.AnchorHTMLAttributes<HTMLAnchorElement>> {
    name: string
    nameID: string
    img: string
}

const PersonCard = ({ name, nameID, img, ...props }: PersonCardProps) => {
    return (
        <Link to={`/person/${nameID}`} className={props.className}>
            <Avatar src={img.replace('1000_CR0,0,674,1000','500_CR0,0,300,500')} variant="big"/>
            <Typography variant={3}>{name}</Typography>
        </Link>
    )
}

export default styled(PersonCard)`
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${Avatar} {
        margin-bottom: 15px;
    }
`;