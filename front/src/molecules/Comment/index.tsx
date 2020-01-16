import React from 'react';
import styled from 'styled-components'

import { Avatar, Bubble } from '../../atoms';

interface CommentProps {
    avatar: string
    comment: string
    className?: string
}

const Comment = ({ avatar, comment, className }: CommentProps) => (
    <div className={className}>
        <Bubble>{comment}</Bubble>
        <Avatar src={avatar} variant="small" />
    </div>
)

export default styled(Comment)`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;