import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import Thumbnail from '../../atoms/Thumbnail';
import { Star } from 'styled-icons/boxicons-solid/Star';
import { Link } from 'react-router-dom'

interface MovieGridProps {
    listSrc: any[]
}


const Cover = styled.div`
    width: 100%;
    height: 0;
    position: absolute;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    transition: all 0.4s;
    visibility: hidden;
    overflow-y: hidden;
`;

const MovieContainer = styled.div`
    margin: 10px 0px;
`;

const CoverContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
    position: relative;
    
    img {
        width: 100%;
    }

    &:hover > ${Cover} {
        height: 50%;
        visibility: visible;
    }
`;

const Title = styled.div`
width: 100%;
    height: 50%;
    text-align: center;
    display: table;
    padding: 0 5px;
    & span {
        display: table-cell;
        vertical-align: middle;
        color: white;
    }
`;

const DetailContainer = styled.div`
    width: 100%;
    height: 50%;
    display: flex;
    align-items: center;
`;

const LeftContainer = styled.div`
    width: 50%;
    float: left;
    text-align: center;
    & span {
        color: white;
    }
`;

const RightContainer = styled.div`
    width: 50%;
    float: right;
    text-align: center;
    & span {
        color: white;
    }
`;


const Rating = styled(Star)`
    color: white;
    width: 20px;
    height: 20px;
    padding-bottom: 2px;
`;

const MoviesGrid = ({ listSrc }: MovieGridProps) => {

    return (
        <Container>
            <Row>
                {
                    listSrc.map((movie, index) => {
                        return (
                            <Col xs={12} sm={6} md={4} lg={3} key={'col-' + index}>
                                <Link to={`/movie/${movie.imdbID}`} key={'link-' + index}>
                                    <MovieContainer key={'movieContainer-' + index}>
                                        <CoverContainer key={'coverContainer-' + index}>
                                            <Thumbnail key={'thumb-' + index} variant={"normal"} src={movie.poster} />
                                            {
                                                (movie.title) ?
                                                    (<Cover>
                                                        <Title key={'title-' + index}><span>{movie.title}</span></Title>
                                                        <DetailContainer key={'detailContainer-' + index}>
                                                            <LeftContainer key={'leftContainer-' + index}>
                                                                <span key={"datePublished-" + index}>{movie.datePublished}</span>
                                                            </LeftContainer>
                                                            <RightContainer key={'rightContainer-' + index}>
                                                                <span key={"rating-" + index}>{movie.imdbRating} </span><Rating />
                                                            </RightContainer>
                                                        </DetailContainer>
                                                    </Cover>) : null
                                            }
                                        </CoverContainer>
                                    </MovieContainer>
                                </Link>
                            </Col>
                        )
                    })
                }
            </Row>
        </Container>
    )
}

export default MoviesGrid
