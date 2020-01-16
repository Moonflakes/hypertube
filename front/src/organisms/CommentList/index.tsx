import React from 'react'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { Link } from 'react-router-dom';

import { Comment } from '../../molecules'

interface CommentList {
    comments: any
}

const CommentList = ({ comments, ...props }:CommentList) => {

    return (
        <div {...props}>
            {comments.map((comment:any, i: number) => (
                <Link key={`link-${i}`}to={`/profile/${comment.user.username}`}><Comment
                    key={`comment-${i}`}
                    avatar={`${process.env.PUBLIC_URL}/avatars${comment.user.avatar}.png`}
                    comment={comment.content} /></Link>
            ))}
        </div>
    )
}

CommentList.fragments = {
    comment: gql`
        fragment CommentListComment on Comment {
            content
            user {
                avatar
                username
            }
        }
    `
}

export default styled(CommentList)`
    ${Comment} {
        margin-bottom: 15px;
    }
` as any;