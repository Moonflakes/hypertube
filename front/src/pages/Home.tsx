import React from 'react'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks';
import { filter } from 'graphql-anywhere';
import { useTranslation } from 'react-i18next'

import { auth } from '../hocs';

import { Spinner } from '../atoms'
import { MoviesList } from '../molecules';
import { Header, Footer, MovieHeader } from '../organisms'

interface HomeProps {
    className?: string
}

const TOP_RATED_MOVIES_QUERY = gql`
    query getTopRatedMovies($input: TopRatedMoviesInput) {
        collection: topRatedMovies(input: $input) {
            lastImdbID
            hasNext
            movies {
                ...MoviesListMovie
            }
        }
    }

    ${MoviesList.fragments.movie}
`

const RECENTLY_ADDED_MOVIES = gql`
    query getRecentlyAddedMovies($input: RecentlyAddedMoviesInput) {
        movies: recentlyAddedMovies(input: $input) {
            imdbID
            ...MovieHeaderMovie
            ...MoviesListMovie
        }
    }

    ${MovieHeader.fragments.movie}
    ${MoviesList.fragments.movie}
`

const USER_WATCHED_MOVIES = gql`
    query getUserWatchedMovies {
        me {
            id
            watchedMovies {
                imdbID
                ...MoviesListMovie
            }
        }
    }

    ${MoviesList.fragments.movie}
`

const USER_FAVORITE_MOVIES = gql`
    query getUserFavoriteMovies {
        me {
            id
            favoriteMovies {
                imdbID
                ...MoviesListMovie
            }
        }
    }

    ${MoviesList.fragments.movie}
`

const updateMoviesFunction = (prev: any, { fetchMoreResult }: any) =>
    !fetchMoreResult || !fetchMoreResult.movies || !fetchMoreResult.movies.length
        ? prev
        : ({
            movies: [...prev.movies, ...fetchMoreResult.movies]
        })

const MoviesListContainer = styled.div`
    padding-left: 40px; 
    @media screen and (max-width: 1000px) and (min-width: 0px) {
        padding-left: 3vw;
      }
`

const Home = styled(({ className }: HomeProps) => {
    const { t } = useTranslation();
    const {
        data: dataRAM,
        loading: loadingRAM,
        error: errorRAM,
        fetchMore: fetchMoreRAM
    } = useQuery(RECENTLY_ADDED_MOVIES);
    const {
        data: dataTRM,
        loading: loadingTRM,
        error: errorTRM,
        fetchMore: fetchMoreTRM
    } = useQuery(TOP_RATED_MOVIES_QUERY);
    const {
        data: dataUWM,
        loading: loadingUWM,
        error: errorUWM,
    } = useQuery(USER_WATCHED_MOVIES);
    const {
        data: dataUFM,
        loading: loadingUFM,
        error: errorUFM,
    } = useQuery(USER_FAVORITE_MOVIES);

    return (
        <div className={className}>
            <Header />
            {loadingRAM ? (<Spinner animation="border" variant="danger" />) : (
                <>
                    {loadingRAM || <MovieHeader {...filter(MovieHeader.fragments.movie, dataRAM.movies[0])} />}
                    <MoviesListContainer>
                        <MoviesList
                            variant={"normal"}
                            loading={loadingRAM}
                            listName={t('recently-added')}
                            listSrc={loadingRAM ? [] : dataRAM.movies.slice(1).map((m: any) => filter(MoviesList.fragments.movie, m))} />
                        {loadingUWM || (dataUWM.me.watchedMovies.length > 0 && (
                            <MoviesList
                                variant={"normal"}
                                listName={t('watch-again')}
                                listSrc={dataUWM.me.watchedMovies.map((m: any) => filter(MoviesList.fragments.movie, m))} />
                        ))}
                        <MoviesList
                            variant={"normal"}
                            loading={loadingTRM}
                            listName={t('top-rated-movies')}
                            listSrc={loadingTRM ? [] : dataTRM.collection.movies.map((m: any) => filter(MoviesList.fragments.movie, m))} />
                        {loadingUFM || (dataUFM.me.favoriteMovies.length > 0 && (
                            <MoviesList
                                variant={"normal"}
                                listName={t('my-list')}
                                listSrc={dataUFM.me.favoriteMovies.map((m: any) => filter(MoviesList.fragments.movie, m))} />
                        ))}
                    </MoviesListContainer>
                </>  
            )}
            <Footer />
        </div>
    )
})`
    min-height: 100vh;
    position: relative;
    padding-bottom: 216px;
`

export default auth('user')(Home);