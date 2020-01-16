import React from 'react';
import styled from 'styled-components';
import { SearchInput, SortFilter, SliderFilter, GenreFilter } from '../../molecules';
import { Container, Col, Row } from 'react-bootstrap';

interface SearchFiltersProps {
    onChange?: any
    minMax?: any
}

const SearchFilters = ({ onChange, minMax }: SearchFiltersProps) => {

    let timeout: number = 0;

    const onSearchChange = (value: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => onChange({ name: "title", values: value }), 500);
    }

    const onSortChange = (sort: string) => {
        onChange({name: "sort", values: sort})
    }

    const onGenreChange = (genres: [string]) => {
        onChange({name: "genres", values: genres});
    }

    const onSlidersChange = (name: string, sliders: [any]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => onChange({name, values: sliders}), 500);
    }

    const InputContainer = styled.div`
        margin-top: 70px;
        padding: 10px;
    `;

    const GenreContainer = styled.div`
        max-width: 630px;
        @media (max-width: 1000px) {
            max-width: 100%;
        }
    `;

    return (
        <Container>
            <Row>
                <Container>
                    <InputContainer>
                        <SearchInput onChange={onSearchChange}/>
                    </InputContainer>
                </Container>
            </Row>
            <Row>
                <Col xs lg="2">
                    <SortFilter onChange={onSortChange}/>
                </Col>
                <Col md="auto">
                    <GenreContainer>
                        <GenreFilter onChange={onGenreChange}/>
                    </GenreContainer>
                </Col>
                <Col xs lg="3">
                    <SliderFilter onChange={onSlidersChange} minMaxValues={minMax} />
                </Col>
            </Row>
        </Container>
    )
}

export default SearchFilters;