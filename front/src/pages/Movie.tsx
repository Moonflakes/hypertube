import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import gql from 'graphql-tag';
import { filter } from 'graphql-anywhere';
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap'

import { auth } from '../hocs'
import {
    MovieHeader,
    PersonList,
    Footer,
    Header,
    CommentList
} from '../organisms'
import { CommentForm } from '../molecules'
import { Spinner } from '../atoms'

interface MovieProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const MOVIE_QUERY = gql`
    query getMovie($imdbID: String!) {
        movie: getMovieByImdbID(imdbID: $imdbID) {
            imdbID
            ...MovieHeaderMovie
            stars {
                ...PersonListPerson
            }
            writers {
                ...PersonListPerson
            }
            directors {
                ...PersonListPerson
            }
            comments {
                ...CommentListComment
            }
        }
    }

    ${MovieHeader.fragments.movie}
    ${PersonList.fragments.person}
    ${CommentList.fragments.comment}
`

const COMMENT_MOVIE_MUTATION = gql`
    mutation commentMovie($input: CommentMovieInput!) {
        movie: commentMovie(input: $input) {
            imdbID
            comments {
                ...CommentListComment
            }
        }
    }

    ${CommentList.fragments.comment}
`

const Movie = styled((props:MovieProps) => {
    const { imdbID } = useParams();
    const { t } = useTranslation();
    const { data, loading } = useQuery(MOVIE_QUERY, { variables: { imdbID } })
    const [commentMovie, { loading:loadingCommentMovie }] = useMutation(COMMENT_MOVIE_MUTATION);

    const onCommentFormSubmitHandler = ({ comment }:any, { reset }:any) => {

        commentMovie({
            variables: { input: { comment, imdbID: data.movie.imdbID } },
            update: () => reset()
        })
    }

    return (
        <div {...props}>
            <Header />
            {loading ? <Spinner animation="border" variant="danger" /> : (
                <>
                    <MovieHeader {...filter(MovieHeader.fragments.movie, data.movie)} />

                    <PersonList title={t('cast')} persons={data.movie.stars} />
                    <PersonList title={t('writers')} persons={data.movie.writers} />
                    <PersonList title={t('directors')} persons={data.movie.directors} />

                    <Row className="comment-container">
                        <Col xs={12} sm={6} className="divider-right">
                            <CommentList comments={data.movie.comments} />
                        </Col>
                        <Col xs={12} sm={6}>
                            <CommentForm
                                onSubmit={onCommentFormSubmitHandler}
                                loading={loadingCommentMovie} />
                        </Col>
                    </Row>
                </>
            )}
            <Footer />
        </div>
    )
})`
    min-height: 100vh;
    position: relative;
    padding-bottom: 216px;
    
    .comment-container {
        margin: 53px auto 70px auto;
        max-width: 1367px;
    }

    .divider-right { border-right: 1px solid #a8a8a8; }

    ${CommentList} {
        padding: 21px 45px 0 36px;
    }

    ${CommentForm} {
        padding: 17px 15px 56px 30px;
    }

    ${PersonList} {
        margin-left: 47px;
        margin-bottom: 40px;
    }
`

export default auth('user')(Movie)