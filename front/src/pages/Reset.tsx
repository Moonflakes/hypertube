import React from 'react';
import gql from 'graphql-tag';
import { useTranslation, Trans } from 'react-i18next';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import * as yup from 'yup';
import { Link, useLocation } from 'react-router-dom';

import { Input } from '../atoms';
import { AuthForm, Header, Footer } from '../organisms';
import { auth } from '../hocs';

interface ResetProps {
    className?: string
}

const RESETMSG_MUTATION = gql`
  mutation resetMsg($input: ResetMsgInput!) {
    resetMsg(input: $input)
  }
`;

const RESETPWD_MUTATION = gql`
  mutation resetPwd($input: ResetPwdInput!) {
    resetPwd(input: $input)
  }
`;

const Reset = styled(({ className }: ResetProps) => {
    const { t } = useTranslation();

    const emailSchema:yup.Schema<any> = yup.object().shape({
        email: yup.string()
            .required(t('formErrors.any.empty'))
    });

    const resetPasswordSchema:yup.Schema<any> = yup.object().shape({
        newPassword: yup.string()
            .required(t('formErrors.any.empty'))
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, t('formErrors.any.password')),
        passwordConfirm: yup.string()
            .required(t('formErrors.any.empty'))
            .test({
                name: 'equalTo',
                exclusive: false,
                message: t('formErrors.any.password-not-equal'),
                test: function (value:string) {
                    return value === this.parent.newPassword;
                }
            }),
    });

    let params  = new URLSearchParams(useLocation().search);
    const token = params.get('token');

    if (token) 
        return (
            <Container className={className} fluid>
                <AuthForm
                    validationSchema={resetPasswordSchema}
                    mutation={RESETPWD_MUTATION}
                    title={t('reset')}
                    successMessage={
                        <Trans i18nKey="successResetPwd" components={[
                            <strong />,
                            <Link to="/signin" />
                        ]} />
                    }>
                    <Input type="password" name="newPassword" placeholder={t('new-password')} />
                    <Input type="password" name="passwordConfirm" placeholder={t('password-confirm')} />
                    <Input type="hidden" name="token" value={token} />
                    <Link to="/signup">{t('signup')}</Link>
                    <Link to="/signin">{t('signin')}</Link>
                </AuthForm>
            </Container>
        );
    return (
        <>
            <Header />
            <Container className={className} fluid>
                <AuthForm
                    validationSchema={emailSchema}
                    mutation={RESETMSG_MUTATION}
                    title={t('reset')}
                    successMessage={
                        <Trans i18nKey="successResetSend" components={[
                            <strong />
                        ]} />
                    }>
                    <Input name="email" placeholder={t('email')} />
                    <Link to="/signup">{t('signup')}</Link>
                    <Link to="/signin">{t('signin')}</Link>
                </AuthForm>
                <Footer />
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

export default auth('guest')(Reset);