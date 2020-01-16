import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { Checkbox, Typography } from '../../atoms';
import { Row, Col, Container } from 'react-bootstrap';
import { useQuery } from '@apollo/react-hooks';
import { FILTERS_LOCAL_QUERY } from '../../apollo';

interface GenreFilterProps {
  theme?: DefaultTheme
  onChange: any
}

const GenreContainer = styled.div`
  ${Typography}:first-child {
    text-align: center;
    font-size: 24px;
    text-transform: capitalize;
  }
`;

const Filter = styled.div`
  ${Typography} {
    display: inline;
    margin-left: 8px;
    text-transform: capitalize;
  }
`;

const GenreFilter: React.FC<GenreFilterProps> = ({ onChange }: any) => {
  
  const genres = ['action', 'adventure', 'animation', 'biography', 'comedy', 'crime', 'documentary', 'drama', 'family', 'fantasy', 'film-noir', 'history', 'horror', 'music', 'musical', 'mystery', 'romance', 'sci-fi', 'short', 'sport','superhero', 'thriller', 'war', 'western']
  const { data:dt } = useQuery(FILTERS_LOCAL_QUERY);

  const setGenreHandler = (e: any) =>
    onChange(e.target.checked
      ? [...dt.filters.genres, e.target.value]
      : dt.filters.genres.filter((el: string) => el !== e.target.value))

  return (
    <Container>
    <GenreContainer>
      <Typography variant={2} i18nKey={ "title-genre-filter" }/>
      <Row>
        {genres.map((genre: string, index: number) => (
          <Col xs={6} sm={4} md={3} key={index}>
            <Filter key={index}>
              <Checkbox
                key={index}
                onChange={setGenreHandler}
                value={genre}
                checked={dt.filters.genres.includes(genre)} />
              <Typography variant={6}>{genre}</Typography>
            </Filter>
          </Col>
        ))}
      </Row>
    </GenreContainer>
    </Container>
  )
}

export default GenreFilter;