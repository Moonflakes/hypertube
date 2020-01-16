import React, { useState } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import theme from '../../theme';
import { useTranslation } from 'react-i18next';
import { Search } from 'styled-icons/boxicons-regular/Search';
import { useQuery } from '@apollo/react-hooks';
import { FILTERS_LOCAL_QUERY } from '../../apollo';

interface SearchInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  theme?: DefaultTheme
  onChange: any
}

const SearchIcon = styled(Search)`
  width: 20px;
  height: 20px;
  color: ${theme.colors.primaryGrey};
`;

const BaseInput = styled.input`
  max-width: 386px;
  width: 100%;
  height: 46px;
  border: solid 1px ${theme.colors.primaryGrey};
  border-radius: 8px;
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  font-family: ${theme.font.helveticaNeue};
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.primaryGrey};
  text-indent: 32px;

  &::placeholder {
    text-transform: capitalize;
  }
  
  &:active,
  &:focus {
    outline: none;
  }
`;

const IconSpan = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
`

const RelativeContainer = styled.div`
  position: relative;  
  max-width: 386px;
  margin: 0 auto;
`;

const SearchInput: React.FC<SearchInputProps> = ({ onChange }: any) => {
  const { t } = useTranslation();
  const { data:dt } = useQuery(FILTERS_LOCAL_QUERY);
  const [searchState, setSearch] = useState(dt.filters.title);
  
  const onKeyPress = (e:any) => {
    setSearch(e.target.value);
    onChange(e.target.value);
  }

  return (
      <RelativeContainer>
        <IconSpan>{<SearchIcon />}</IconSpan>
        <BaseInput type="text" onChange={onKeyPress} value={searchState} placeholder={t('type-here-search')} />
      </RelativeContainer>
  );
}

export default SearchInput;