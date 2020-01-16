import React, { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks'
import { LOGIN_LOCAL_MUTATION } from '../apollo'

const OAuth: React.FC = () => {
    let params  = new URLSearchParams(useLocation().search);
    const [login, { loading }] = useMutation(LOGIN_LOCAL_MUTATION);

    useEffect(() => {
        login({ variables: { accessToken: params.get('token') }})
    })

    return (
        loading ? null : <Redirect to="/"/>
    );
}

export default OAuth;