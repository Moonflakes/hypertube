import React, { useEffect, useRef } from 'react';
import gql from 'graphql-tag';
import styled, { DefaultTheme } from 'styled-components'
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom';

import client, { LOGOUT_LOCAL_MUTATION, IS_LOGGED_LOCAL_QUERY } from '../../apollo'
import { Logo, Avatar } from '../../atoms';
import { HeaderDropdown, SearchInputHeader } from '../../molecules'

const HeaderContainer = styled.header`
    position: fixed;
    background: 'transparent';
    padding: 10px 32px 7px 16px;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    z-index: 99;
    transition: background 0.333s ease;

    ${Logo} {
        cursor: pointer;
    }

    ${({ theme }: { theme: DefaultTheme }) => (`
        @media only screen and (max-width: ${theme.breakpoints.xs}) {
            justify-content: center;
        }
    `)}
`

const ME_QUERY = gql`
    query HeaderMe {
        me {
            id
            username
            avatar
        }
    }
`

const RightComponents = styled.div`
    display: flex;
    flex-direction: row;
`

const Header = () => {
    const { t } = useTranslation();
    const { push } = useHistory();
    const queryLocalCache = useQuery(IS_LOGGED_LOCAL_QUERY);
    const { data, loading, error } = useQuery(ME_QUERY, {
        skip: queryLocalCache.loading || !!queryLocalCache.error || !queryLocalCache.data.isLogged
    });
    const headerContainer = useRef(null);

    useEffect(() => {
        const onScrollEventHandler = function(e:any) {
            if (window.scrollY === 0) {
                headerContainer.current.style.background = 'transparent';
            }
            else
                headerContainer.current.style.background = 'black';
        }

        window.addEventListener("scroll", onScrollEventHandler);

        return () => {
            window.removeEventListener("scroll", onScrollEventHandler);
        }
    })

    return (
        <HeaderContainer ref={ headerContainer }>
            <Logo onClick={() => push('/')} />
            {!queryLocalCache.loading && !queryLocalCache.error && queryLocalCache.data.isLogged && !loading && !error && (
                <RightComponents>
                    <SearchInputHeader />
                    <HeaderDropdown>
                        <HeaderDropdown.Toggle>
                            <Avatar variant="squared" src={loading ? "https://www.redditstatic.com/avatars/avatar_default_19_EA0027.png" : `${process.env.PUBLIC_URL}/avatars${data.me.avatar}.png`} />
                        </HeaderDropdown.Toggle>
                        <HeaderDropdown.Menu>
                            <HeaderDropdown.Item onClick={() => push(`/account`)}>
                                <span>{t('account')}</span>
                            </HeaderDropdown.Item>
                            <HeaderDropdown.Item onClick={() => client.mutate({ mutation: LOGOUT_LOCAL_MUTATION })}>
                                <span>{t('signout')}</span>
                            </HeaderDropdown.Item>
                        </HeaderDropdown.Menu>
                    </HeaderDropdown>
                </RightComponents>
            )}
        </HeaderContainer>
    )
}

export default Header;