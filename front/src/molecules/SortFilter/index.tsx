import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { Radio, Typography } from '../../atoms';
import { useQuery } from '@apollo/react-hooks';
import { FILTERS_LOCAL_QUERY } from '../../apollo';

interface SortFilterProps {
  theme?: DefaultTheme
  onChange: any
}

const Filter = styled.div`
  ${Typography} {
    display: inline;
    margin-left: 8px;
    text-transform: capitalize;
  }
`;

const SortContainer = styled.div`
  ${Typography}:first-child {
    text-align: center;
    font-size: 24px;
    text-transform: capitalize;
  }
  margin: 0 auto;
  width: 100%;
`;


const SortFilter: React.FC<SortFilterProps> = ({ onChange }: any) => {

  const { data:dt } = useQuery(FILTERS_LOCAL_QUERY);
  const changeSortHandler = (e: any) => {
    onChange(e.target.value)
  }

  return (
    <SortContainer>
      <Typography variant={2} i18nKey={"title-sort-filter"} />
        {['alpha,asc', 'user_rating,desc', 'year,desc'].map((v: string, index: number) => (
          <Filter key={index}><Radio key={index} value={v} onChange={changeSortHandler} checked={dt.filters.sort === v} /><Typography variant={3} i18nKey={`${v}-sort-filter`} /></Filter>
        ))}
    </SortContainer>
  )
}

export default SortFilter;