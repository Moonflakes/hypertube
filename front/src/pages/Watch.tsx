import React from 'react';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '../organisms';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import styled from 'styled-components';

const GET_MOVIE_QUERY = gql`
    query getMovie($imdbID: String!) {
        movie: getMovieByImdbID(imdbID: $imdbID) {
            imdbID
            subtitles {
                language
                url
            }
            qualities: torrents {
                quality
            }
            currentUserTime
        }
    }
`;

const WatchContainer = styled.div`
    background-color: black;
    width: 100vw;
    height: 100vh;
`;

const LoadingSpin = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
`;

const Watch: React.FC = () => {
    const { imdbID } = useParams();
    const { loading, error, data } = useQuery(GET_MOVIE_QUERY, {
        variables: { imdbID },
        fetchPolicy: 'network-only'
    });

    if (error) console.log(`Error! ${error}`);
    return (
        <>
            {(loading)
                ? (
                    <WatchContainer>
                        <LoadingSpin src={`${process.env.REACT_APP_API_HOST}/static/loading.gif`} />
                    </WatchContainer>
                )
                : <VideoPlayer
                    imdbID={ imdbID }
                    startTime={data.movie.currentUserTime}
                    subtitles={ data.movie.subtitles }
                    qualities={ data.movie.qualities } />}
        </>
    )
}

export default Watch;