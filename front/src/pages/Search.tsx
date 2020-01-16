import React, { useEffect } from 'react';
import styled from 'styled-components';
import { auth } from '../hocs';
import { Header, SearchFilters, MoviesGrid } from '../organisms';
import { Spinner } from '../atoms';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { FILTERS_LOCAL_QUERY, FILTERS_LOCAL_MUTATION } from '../apollo';

const minMax: any = {
    imdb_grade: [1, 10],
    prod_year: [1964, 2019]
}

const Search = () => {
    const Background = styled.div`
        background-color: rgba(0, 0, 0, 0.85);
    `;

    const Grid = styled.div`
        margin-top: 50px;
        height: 100%;
        text-align: center;
    `;

    const SEARCH_MOVIE_QUERY = gql`
        query searchMovie($searchInput: SearchInput!) {
            searchMovie(input: $searchInput) {
                title
                imdbID
                datePublished
                imdbRating
                paginationID
                poster
                torrents {
                magnet
                }
            }
        }
    `;

    useEffect(() => {
        window.addEventListener('scroll', fetchMoreHandler);
        return () => {
            window.removeEventListener('scroll', fetchMoreHandler);
        }
    })

    const { data: dt, error: et } = useQuery(FILTERS_LOCAL_QUERY);
    const { __typename, ...filters } = dt.filters;
    const [updateFilters, { error: elf }] = useMutation(FILTERS_LOCAL_MUTATION);
    const { loading, error, data, fetchMore, networkStatus } = useQuery(SEARCH_MOVIE_QUERY, {
        variables: { searchInput: { ...filters, title: dt.filters.title }},
        notifyOnNetworkStatusChange: true
    });
    
    let searchMovie: any = [];

    if (error || elf || et) console.log(`Error! ${error}`);
    if (!loading && data) {
        searchMovie = data.searchMovie.filter((movie: any) => movie.torrents.length !== 0);
    }

    const fetchMoreRef = React.useRef(true);

    if (fetchMoreRef.current && !loading && data && !(window.innerWidth > document.body.clientWidth)) {
        fetchMoreRef.current = false;
        fetchMore({
            variables: { searchInput: { ...filters, startId: parseInt(data.searchMovie[data.searchMovie.length - 1].paginationID) + 1 } },
            updateQuery: (prev: any, { fetchMoreResult }: any) => {
                return (!fetchMoreResult || !fetchMoreResult.searchMovie) ? prev : ((prev) ? 
                    {
                        searchMovie: [
                            ...prev.searchMovie,
                            ...fetchMoreResult.searchMovie]
                    } : {
                        searchMovie: [
                            ...fetchMoreResult.searchMovie]
                    })
            }
        })
    }

    const fetchMoreHandler = () => {
        var scrollpercent = (document.body.scrollTop + document.documentElement.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);

        if (!loading && searchMovie[searchMovie.length - 1] && (scrollpercent * 100) > 50) {
            fetchMore({
                variables: { searchInput: { ...filters, startId: parseInt(searchMovie[searchMovie.length - 1].paginationID) + 1 } },
                updateQuery: (prev: any, { fetchMoreResult }: any) => {
                    return (!fetchMoreResult || !fetchMoreResult.searchMovie) ? prev : {
                        searchMovie: [
                            ...prev.searchMovie,
                            ...fetchMoreResult.searchMovie
                        ]
                    }
                }
            })
        }
    }

    const onChange = ({ name, values }: any) => {
        updateFilters({ variables: { filters: { ...dt.filters, [name]: values } } });
    }

    return (
        <Background>
            <Header />
            <SearchFilters onChange={onChange} minMax={minMax} />
            {((loading && !data) || networkStatus === 2 || !data) ? <Grid><Spinner animation="border" variant="danger" /></Grid> : <Grid><MoviesGrid listSrc={data.searchMovie.filter((movie: any) => movie.torrents.length !== 0)} /></Grid>}
        </Background>
    )
};

export default auth('user')(Search);