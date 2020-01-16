import React from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'

import { Typography } from '../../atoms'
import { PersonCard } from '../../molecules'

interface PersonListProps {
    className?: string
    persons: any
    title: string
}

const PersonCardsContainer = styled.div`
    overflow-x: scroll;
    display: flex;
    padding: 0 25px;

    &::-webkit-scrollbar {
        width: 2px;
        height: 4px;
    }
    &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }
    &::-webkit-scrollbar-thumb {
      background-color: darkgrey;
      outline: 1px solid slategrey;
    }

    ${PersonCard} {
        margin-right: 46px;
        text-decoration: none;
    }
`

const PersonList = ({ persons, title, ...props }: PersonListProps) => {
    return (
        <div {...props}>
            <Typography variant={2}>{title}</Typography>
            <PersonCardsContainer>
                {persons.map((person:any, i:number) => <PersonCard key={`${title}-person-${person.nameID}-${i}`} {...person} />)}
            </PersonCardsContainer>
        </div>
    )
}

PersonList.fragments = {
    person: gql`
        fragment PersonListPerson on Person {
            nameID
            name
            img
        }
    `
}

export default styled(PersonList)`
    ${Typography}::first-letter {
        text-transform: uppercase;
    }
` as any;