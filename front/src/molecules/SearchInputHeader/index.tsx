import React, { useRef } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import theme from '../../theme';
import { useTranslation } from 'react-i18next';
import { Search } from 'styled-icons/boxicons-regular/Search';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FILTERS_LOCAL_QUERY, FILTERS_LOCAL_MUTATION } from '../../apollo';
import { useHistory } from 'react-router-dom';

interface SearchInputHeaderProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  theme?: DefaultTheme
}

const Loupe = styled(Search)`
  color: white;
  position: relative;
  top: 3px;
`

const TextInput = styled.input`
  height: 30px;
  font-size: 14px;
  display: inline-block;
  border: none;
  outline: none;
  color: white;
  padding: 3px;
  padding-right: 30px;
  width: 0px;
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  z-index: 3;
  transition: width .4s cubic-bezier(0.000, 0.795, 0.000, 1.000);
  cursor: pointer;

  &:focus:hover {
    border-bottom: 1px solid #BBB;
  }

  &:focus {
    width: 200px;
    z-index: 1;
    border-bottom: 1px solid #BBB;
    cursor: text;
  }

  &::placeholder {
    font-size: 14px;
  }

  @media only screen and (max-width: ${theme.breakpoints.xs}) {
    display: none;
  }
  
`

const Wrap = styled.div`
  margin-right: 20px;
  position: relative;
`

const Form = styled.form``

const SearchInputHeader: React.FC<SearchInputHeaderProps> = () => {
  const { t } = useTranslation();
  const search = useRef(null);
  const { data: dt } = useQuery(FILTERS_LOCAL_QUERY);
  const [updateFilters] = useMutation(FILTERS_LOCAL_MUTATION);
  const { push } = useHistory();

  const onSubmit = (e:any) => {
    e.preventDefault();
    updateFilters({ variables: { filters: { ...dt.filters, title: search.current.value } } }).then(() => push('/search'))
  }

  const onClick = (e: any) => {
    if (window.innerWidth <= 576) {
      e.preventDefault();
      push('/search');
    }
  }

  return (
    <Wrap>
      <Form onSubmit={onSubmit}>
        <Loupe size={20} onClick={onClick}/>
        <TextInput ref={search} type="text" placeholder={t('search')} />
      </Form>
    </Wrap>
  );
}

export default SearchInputHeader;