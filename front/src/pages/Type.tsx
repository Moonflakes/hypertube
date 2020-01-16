import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { useParams, Redirect } from 'react-router-dom'
import styled, { DefaultTheme } from 'styled-components'
import { Star } from 'styled-icons/boxicons-solid/Star';

import { auth } from '../hocs'
import { Wallpaper, Typography, Spinner } from '../atoms'
import { Header, Footer, MoviesGrid } from '../organisms'

const GET_MOVIES_BY_TYPE_QUERY = gql`
    query getMoviesByType($input: GetMoviesByTypeInput!) {
        collection: getMoviesByType(input: $input) {
            lastImdbID
            lastPage
            startId
            hasNext
            genre
            movies {
                imdbID
                trailer
                title
                coverImg
                poster
                datePublished
                imdbRating
            }
            person {
                name
                nameID
            }
        }
    }
`

const updateQuery = (prev:any, { fetchMoreResult }:any) =>
    !fetchMoreResult || !fetchMoreResult.collection
        ? prev
        : ({
            collection: {
                ...fetchMoreResult.collection,
                movies: [...prev.collection.movies, ...fetchMoreResult.collection.movies]
            }
        })

const StarIcon = styled(Star)`
    height: 22px;
    position: relative;
    bottom: 2px;
`;

const Grid = styled.div`
        margin-top: 50px;
        height: 100%;
        text-align: center;
`;

const WallpaperContent = styled(({ title, movie, className }) => (
    <div className={className}>
        <Typography variant={2}>{title}</Typography>
        <Typography variant={1}>{movie.title} <StarIcon /> {movie.imdbRating}</Typography>
        <Typography variant={1}>{movie.datePublished}</Typography>
    </div>
))`
    ${Typography}::first-letter {
        text-transform: uppercase;
    }
`

const Type = styled(({ className }) => {
    const input = useParams<any>();

    const { data, loading, error, fetchMore } = useQuery(GET_MOVIES_BY_TYPE_QUERY, {
        variables: { input: { ...input, lastImdbID: null, lastPage: "1", startId: 1 } },
        notifyOnNetworkStatusChange: true
    });

    if (error || (!loading && !data.collection.movies.length))
        return <Redirect to="/" />

    const documentScrollEventHandler = () => {
        if (!loading && data) {
            const { lastPage, lastImdbID, startId, hasNext } = data.collection;
            const h = document.documentElement
            const b = document.body
            const percent = (h['scrollTop']||b['scrollTop']) / ((h['scrollHeight']||b['scrollHeight']) - h.clientHeight) * 100;
            
            if (hasNext && percent > 50)
                fetchMore({ variables: { input: { ...input, lastImdbID, lastPage, startId } }, updateQuery })
        }
    }

    React.useEffect(() => {
        document.addEventListener('scroll', documentScrollEventHandler)

        return () => {
            document.removeEventListener('scroll', documentScrollEventHandler)
        }
    })

    return (
        <div className={className}>
            <Header />
            {loading && !data ? <Spinner animation="border" variant="danger" /> : (
                <>
                    <Wallpaper
                        trailer={data.collection.movies[0].trailer}
                        image={data.collection.movies[0].coverImg
                            ? data.collection.movies[0].coverImg.replace('477_CR0,0,477,268', '2400_CR0,200,2400,936')
                            : data.collection.movies[0].coverImg}>
                        <WallpaperContent
                            title={input.type === 'person'
                                ? data.collection.person.name
                                : data.collection.genre}
                            movie={data.collection.movies[0]} />
                    </Wallpaper>
                    
                    <Grid><MoviesGrid listSrc={data.collection.movies.slice(1)}/></Grid>
                </>
            )}
            <Footer />
        </div>
    )
})`
    min-height: 100vh;
    position: relative;
    padding-bottom: 216px;

    ${({ theme }: { theme: DefaultTheme }) => (`
        @media only screen and (max-width: ${theme.breakpoints.xs}) {
            background: none;
            padding-bottom: 96px;
        }
    `)}
`

export default auth('user')(Type);