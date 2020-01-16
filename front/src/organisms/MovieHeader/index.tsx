import React from 'react'
import styled, { StyledComponent } from 'styled-components'
import gql from 'graphql-tag';
import { useHistory, useLocation, Redirect, Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Plus as PlusIcon, Minus as MinusIcon } from 'styled-icons/boxicons-regular';
import { Star } from 'styled-icons/boxicons-solid/Star';
import { Spinner } from 'react-bootstrap'

import { MoviesList } from '../../molecules'
import { Typography, Wallpaper, Label } from '../../atoms';
import { PlayButton, MyListButton } from '../../molecules'

type MovieHeaderType = StyledComponent<'div', any> & {
    fragments?: any
}

interface MovieHeaderProps {
    imdbID: string
    coverImg: string
    title: string
    summary: string
    genres: string[]
    isFavorite: boolean
    trailer: string
    duration: string
    imdbRating: string
    datePublished: string
    className?: string
}

const Title = styled.h2`
    font-family: HelveticaNeue;
    font-size: 26px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffffff;
    margin-bottom: 1.2vw;

    @media screen and (max-width: 1500px) and (min-width: 765px) {
        font-size: 1.50vw;
    }
    @media screen and (max-width: 765px) and (min-width: 0px) {
        font-size: 11px;
    }
`

const ButtonsContainer = styled.div`
    margin-top: 4vw;
    display: flex;
`

const LabelsContainer = styled.div`
    margin-bottom: 3vw;
    ${Label} {
        position: relative;
        margin-right: 10px;
        display: inline-block;

        & + svg {
            padding-left: 1vw;
        }

        svg {
            position: absolute;
            left: 5px;
            bottom: 50%;
            transform: translateY(50%);
            width: 1.1vw;
        }
`

const SpinnerIcon = styled(Spinner)`
    width: 1.3vw!important;
    height: 1.3vw!important;
    margin-right: 10px;

    @media screen and (max-width: 640px) {
        width: 9.719px!important;
        height: 9.719px!important;
    }
`

const PlusIconResponsive = styled(PlusIcon)`
    @media screen and (max-width: 1300px) and (min-width: 640px) {
        width: 2.3vw;
        height: 2.3vw;
    }
    @media screen and (max-width: 640px) and (min-width: 0px) {
        width: 14.719px;
        height: 14.719px;
    }
`

const MinusIconResponsive = styled(MinusIcon)`
    @media screen and (max-width: 1300px) and (min-width: 640px) {
        width: 2.3vw;
        height: 2.3vw;
    }
    @media screen and (max-width: 640px) and (min-width: 0px) {
        width: 14.719px;
        height: 14.719px;
    }
`

// @TODO Add fragments from favorite page
const REMOVE_MOVIE_TO_FAVORITES = gql`
    mutation removeMovieToFavorites($input: MovieImdbIDInput!) {
        user: removeMovieToFavorites(input: $input) {
            id
            favoriteMovies {
                imdbID
                ...MoviesListMovie
            }
        }
    }

    ${MoviesList.fragments.movie}
`

const ADD_MOVIE_TO_FAVORITES = gql`
    mutation addMovieToFavorites($input: MovieImdbIDInput!) {
        user: addMovieToFavorites(input: $input) {
            id
            favoriteMovies {
                imdbID
                ...MoviesListMovie
            }
        }
    }

    ${MoviesList.fragments.movie}
`

const MOVIE_HEADER_MOVIE_FRAGMENT = gql`
    fragment MovieHeaderMovie on Movie {
        imdbID
        title
        summary
        coverImg
        genres
        trailer
        isFavorite
        duration
        imdbRating
        datePublished
    }
`

const MovieHeader = ({ imdbID, title, summary, coverImg, genres, isFavorite, trailer, duration, imdbRating, datePublished, className }: MovieHeaderProps) => {
    const { push } = useHistory();
    const { pathname } = useLocation();
    const [mutate, { loading, error }] = useMutation(isFavorite
        ? REMOVE_MOVIE_TO_FAVORITES
        : ADD_MOVIE_TO_FAVORITES, {
            variables: { input: { imdbID } },
            update: (store:any) => {
                store.writeFragment({
                    id: imdbID,
                    fragment: MOVIE_HEADER_MOVIE_FRAGMENT,
                    data: {
                        ...store.readFragment({
                            id: imdbID,
                            fragment: MOVIE_HEADER_MOVIE_FRAGMENT
                        }),
                        isFavorite: !isFavorite
                    }
                })
            }
        })
    
    if (error)
        return (<Redirect to="/" />)

    return (
        <div className={className}>
            <Wallpaper trailer={trailer} image={coverImg ? coverImg.replace('477_CR0,0,477,268', '2400_CR0,200,2400,936') : coverImg}>
                <Title>{title}</Title>
                <LabelsContainer>
                    <Label>{/\b(19|20)\d{2}\b/.exec(datePublished)[0]}</Label>
                    <Label><Star size={18} />{imdbRating}</Label>
                    <Label>{duration}</Label>
                </LabelsContainer>
                <Typography variant={2}>{summary.split('.')[0]}.</Typography>
                <ButtonsContainer>
                    <PlayButton onClick={() => push(`/stream/${imdbID}`, { from: pathname })} />
                    <MyListButton
                        onClick={mutate}
                        icon={(loading && <SpinnerIcon animation="border" />) || (isFavorite ? <MinusIconResponsive /> : <PlusIconResponsive />)} />
                </ButtonsContainer>
                <div className="genresContainer">
                    {genres.map((genre, index) => (
                        <Link className="genres" to={`/genre/${genre}`} key={`${genre}-${index}-link`}>
                            <Typography as="span" className="genres" key={`${genre}-${index}-text`} variant={7}>{(index !== genres.length - 1) ? `${genre} | ` : genre}</Typography>
                        </Link>
                    ))}
                </div>
            </Wallpaper>
        </div>
    )
}

MovieHeader.fragments = {
  movie: MOVIE_HEADER_MOVIE_FRAGMENT
};

export default styled(MovieHeader)`
    .duration {
        font-size: 11px;
        color: grey;    
    }

    .genresContainer {
        margin-top: 1vw;
    }

    .genres {
        cursor: pointer;
        &:hover, &:active, &:focus {
            text-decoration: none;
            outline: none;
        }
    }

    ${Typography} {
        margin-bottom: 0!important;
        @media screen and (max-width: 1500px) and (min-width: 765px) {
            font-size: 1.20vw;
        }
        @media screen and (max-width: 765px) and (min-width: 0px) {
            font-size: 9px;
        }
    }

    ${PlayButton} {
        margin-right: 11px;
    }
` as MovieHeaderType