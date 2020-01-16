import React from 'react'
import styled from 'styled-components'
import { useParams, Redirect } from 'react-router-dom'
import gql from 'graphql-tag';
import { filter } from 'graphql-anywhere';
import { useQuery } from '@apollo/react-hooks'

import { auth } from '../hocs'
import { Avatar, Typography } from '../atoms'
import { MoviesList } from '../molecules'
import { Header, Footer } from '../organisms'

interface ProfileProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const GET_USER_BY_USERNAME_QUERY = gql`
    query getUserByUsernameQuery($input: UsernameInput!) {
        user:getUserByUsername(input: $input) {
            id
            avatar
            firstname
            lastname
            username
            favoriteMovies {
                imdbID
                ...MoviesListMovie
            }
        }
    }

    ${MoviesList.fragments.movie}
`

const Profile = styled((props: ProfileProps) => {
    const { username } = useParams();
    const { data, loading, error } = useQuery(GET_USER_BY_USERNAME_QUERY, {
        variables: { input: { username } }
    });

    if (error || (!loading && !data.user))
        return <Redirect to="/" />

    return (
        <div {...props}>
            <Header />
            {loading || (
                <>
                <Avatar id="avatar" variant="big2" src={`${process.env.PUBLIC_URL}/avatars${data.user.avatar}.png`} />
                <Typography id="fullname" variant={1}>{data.user.firstname} {data.user.lastname}</Typography>
                <Typography id="username" variant={1}>@{data.user.username}</Typography>
                <MoviesList
                    listName={"My list"}
                    listSrc={data.user.favoriteMovies.map((m:any) => filter(MoviesList.fragments.movie, m))} />
                </>
            )}
            <Footer />
        </div>
    )
})`
    min-height: 100vh;
    position: relative;
    padding-bottom: 216px;
    padding-top: 117px;
    background: url(/cinema.png);
    background-size: cover;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    display: flex;
    overflow:hidden;

    &:before {
        background-color: #000000a6;
        content: '';
        display: block;
        height: 100%;
        position: absolute;
        width: 100%;
    }

    #avatar {
        margin-bottom: 48px;
        z-index: 1;
    }

    .movies-list {
        align-self: baseline;
        padding-left: 57px;
        z-index: 1;
    }

    #fullname {
        margin-bottom: 10px; 
        z-index: 1;
    }

    #username {
        margin-bottom: 94px;
        z-index: 1;
    }
`

export default auth('user')(Profile)