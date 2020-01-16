import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { Slider, Typography } from '../../atoms';
import { useQuery } from '@apollo/react-hooks';
import { FILTERS_LOCAL_QUERY } from '../../apollo';

interface SliderFilterProps {
  theme?: DefaultTheme
  onChange: any
  minMaxValues: any
}

const Filter = styled.div`
  width: 100%;
  text-align: center;
  ${Typography} {
    display: inline;
    text-transform: capitalize;
    font-size: 14px !important;
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  ${Typography}:first-child {
    text-align: center;
    font-size: 24px;
    text-transform: capitalize;
  }
`;

const SliderFilter: React.FC<SliderFilterProps> = ({ onChange, minMaxValues }: any) => {

  const { data:dt } = useQuery(FILTERS_LOCAL_QUERY);
  
  const sliderHandler = (values: [number], name: string) =>
    onChange(name, values)

  return (
    <SliderContainer>
      <Typography variant={2} i18nKey={ "title-slider-filter" }/>
      <Filter>
        <Slider
          min={minMaxValues["imdb_grade"][0]}
          max={minMaxValues["imdb_grade"][1]}
          value={dt.filters.userRating}
          onChange={ (values: [number]) => sliderHandler(values, "userRating") }>
          <Typography variant={6} i18nKey={ "imdb-grade-slider" } />
        </Slider>
        <Slider
          min={minMaxValues["prod_year"][0]}
          max={minMaxValues["prod_year"][1]}
          value={dt.filters.releaseDate}
          onChange={ (values: [number]) => sliderHandler(values, "releaseDate") }>
          <Typography variant={6} i18nKey={ "production-year-slider" } />
        </Slider>
      </Filter>
    </SliderContainer>
  )
}

export default SliderFilter;