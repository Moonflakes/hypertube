import React from 'react'
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom'

import { IS_LOGGED_LOCAL_QUERY } from '../apollo'

export default (type: 'guest' | 'user') => (Component:any) => (props:any) => {
    const { data, loading } = useQuery(IS_LOGGED_LOCAL_QUERY);

    if (loading || !data)
        return null;
    if (!data.isLogged && type === 'user')
        return <Redirect to="/signin" />
    if (data.isLogged && type === 'guest')
        return <Redirect to="/" />
    return <Component {...props} />;
}