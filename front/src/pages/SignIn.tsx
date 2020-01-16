import React from 'react';
import gql from 'graphql-tag';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import * as yup from 'yup';
import { Link, useHistory } from 'react-router-dom'
import client, { LOGIN_LOCAL_MUTATION } from '../apollo';

import { auth } from '../hocs'
import { Input } from '../atoms';
import { SocialButton } from '../molecules';
import { AuthForm, Header, Footer } from '../organisms';

interface SignInProps {
    className?: string
}

interface JWT {
    accessToken: string
}

const SIGNIN_MUTATION = gql`
  mutation SignIn($input: SigninInput!) {
    jwt: signin(input: $input) {
        accessToken
    }
  }
`;

const SignIn = styled(({ className }: SignInProps) => {
    const { t } = useTranslation();
    const { push } = useHistory();

    const schema:yup.Schema<any> = yup.object().shape({
        username: yup.string()
            .required(t('formErrors.any.empty')),
        password: yup.string()
            .required(t('formErrors.any.empty'))
    });

    const handleOnCompleted = ({ jwt }: { jwt?: JWT }) => {
        if (jwt) {
            const { accessToken } = jwt;
            client
                .mutate({
                    mutation: LOGIN_LOCAL_MUTATION,
                    variables: { accessToken },
                    update: () => push('/')
                });
        }
    }

    return (
        <>
            <Header />
            <Container className={className} fluid>
                <AuthForm
                    validationSchema={schema}
                    mutation={SIGNIN_MUTATION}
                    title={t('signin')}
                    onCompleted={handleOnCompleted}>
                    <Input name="username" placeholder={t('username')} />
                    <Input type="password" name="password" placeholder={t('password')} />
                    <Link to="/reset">{t('reset')}</Link>
                    <Link to="/signup">{t('signup')}</Link>
                    <SocialButton variant="42" onClick={() => window.location.replace(`${process.env.REACT_APP_API_HOST}/auth/42`)} />
                    <SocialButton variant="google" onClick={() => window.location.replace(`${process.env.REACT_APP_API_HOST}/auth/google`)} />
                </AuthForm>
            </Container>
            <Footer />
        </>
    );
})`
    min-height: 100vh;
    padding-bottom: 216px;
    background: url(/city.jpeg);
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;

    ${Footer} {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
`;

export default auth("guest")(SignIn);