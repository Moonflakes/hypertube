import React from 'react';
import gql from 'graphql-tag';
import { useTranslation, Trans } from 'react-i18next';
import styled, { DefaultTheme }  from 'styled-components';
import { Container } from 'react-bootstrap';
import * as yup from 'yup';
import { Link } from 'react-router-dom';

import { auth } from '../hocs'
import { Input } from '../atoms';
import { AvatarSelect } from '../molecules'
import { AuthForm, Header, Footer } from '../organisms';

interface SignUpProps {
    className?: string
}

const SIGNUP_MUTATION = gql`
  mutation SignUp($input: SignupInput!) {
    signup(input: $input)
  }
`;

const SignUp = styled(({ className }: SignUpProps) => {
    const { t } = useTranslation();

    const schema:yup.Schema<any> = yup.object().shape({
        firstname: yup.string()
            .required(t('formErrors.any.empty')),
        lastname: yup.string()
            .required(t('formErrors.any.empty')),
        email: yup.string()
            .required(t('formErrors.any.empty'))
            .email(t('formErrors.any.email')),
        username: yup.string()
            .required(t('formErrors.any.empty')),
        password: yup.string()
            .required(t('formErrors.any.empty'))
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, t('formErrors.any.password')),
        passwordConfirm: yup.string()
            .required(t('formErrors.any.empty'))
            .test({
                name: 'equalTo',
                exclusive: false,
                message: t('formErrors.any.password-not-equal'),
                test: function (value:string) {
                    return value === this.parent.password;
                }
            }),
        avatar: yup.string()
            .required(t('formErrors.avatar'))
    });

    return (
        <>
            <Header />
            <Container className={className} fluid>
                <AuthForm
                    validationSchema={schema}
                    mutation={SIGNUP_MUTATION}
                    title={t('signup')}
                    successMessage={
                        <Trans i18nKey="successSignup" components={[
                            <strong />,
                            <Link to="/signin" />
                        ]} />
                    }>
                    <Input name="firstname" placeholder={t('firstname')} />
                    <Input name="lastname" placeholder={t('lastname')} />
                    <Input name="email" placeholder={t('email')} />
                    <Input name="username" placeholder={t('username')} />
                    <Input type="password" name="password" placeholder={t('password')} />
                    <Input type="password" name="passwordConfirm" placeholder={t('password-confirm')} />

                    <AvatarSelect name="avatar" visibleAvatarsCount={9} />

                    <Link to="/signin">{t('signin')}</Link>
                </AuthForm>
                <Footer />
            </Container>
        </>
    );
})`
    position: relative;
    min-height: 100vh;
    padding-bottom: 216px;
    background: url(/city.jpeg);
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;

    ${({ theme }: { theme: DefaultTheme }) => (`
        @media only screen and (max-width: ${theme.breakpoints.xs}) {
            background: none;
            padding-bottom: 96px;
        }
    `)}
`;

export default auth("guest")(SignUp)