import React, { useEffect, useState } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import useForm from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation, Trans } from 'react-i18next';
import { Schema } from 'yup';
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Input, Button, Typography, HelperText } from '../../atoms';

type FormData = {
    [key: string]: string
}

interface AuthFormProps extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
    title: string
    children?: any
    mutation: any
    validationSchema: Schema<any>
    onCompleted?: any
    successMessage?: any
}


const Box = styled.div`
    position: relative;
    padding: 58px 72px 40px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
    width: 450px;
    ${({ theme }: { theme: DefaultTheme }) => theme.elevation["2dp"]};

    ${({ theme }: { theme: DefaultTheme }) => (`
        @media only screen and (max-width: ${theme.breakpoints.xs}) {
            background: none;
            padding: 70px 10px 40px;
        }
    `)}
`

const Title = styled.h3`
    color: ${({ theme }: { theme: DefaultTheme}) => theme.colors.white};
    font-size: 32px;
    margin: 0 -5px 30px;
    text-transform: capitalize;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;

    ${Input} {
       margin-bottom: 3px;
    }

    ${Button} {
        margin-top: 15px;
        text-transform: capitalize;
        border-radius: 8px;
    }
`

const Alert = styled.div<React.DetailedHTMLFactory<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { variant?: string }>`
    background: ${({ theme, variant }: { theme: DefaultTheme, variant?: 'warning' | 'success' }) =>
        theme.colors[variant === 'success' ? 'green' : 'primaryOrange']};
    color: ${({ theme }: { theme: DefaultTheme}) => theme.colors.white};
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    font-size: 14px;
    margin: 0 0 16px;
    padding: 10px 20px;

    a {
        text-decoration: underline;
        color: ${({ theme }: { theme: DefaultTheme}) => theme.colors.white};
    }

    a:hover {
        color: ${({ theme }: { theme: DefaultTheme}) => theme.colors.white};
    }
`

export const AuthFormLinks = styled.div`
    margin-top: 45px;
    display: flex;
    justify-content: ${({ children }: { children: any }) => children.length > 1
        ? 'space-between' : 'flex-end'};

    a {
        display: block;
        color: ${({ theme }: { theme: DefaultTheme}) => theme.colors.white};
        font-family: ${({ theme }: { theme: DefaultTheme}) => theme.font.helvetica};
        text-transform: capitalize;
        font-size: 15px;
    }
    z-index: 1;
`

const warningMessages:any = {
    "formErrors.password-invalid": () => (<>
        <b>Incorrect password</b>. Please try again or you can <Link to="/reset">reset your password.</Link>
    </>),
    "formErrors.user-not-found": () => (<>
        Sorry, we can't find an account with this email address. Please try again or <Link to="/signup">create a new account.</Link>
    </>)
}

const AuthForm: React.FC<AuthFormProps> = ({
    title,
    mutation,
    children,
    validationSchema,
    onCompleted,
    successMessage
}: AuthFormProps) => {
    const { t } = useTranslation();
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit: handleSubmitWrapper, errors, setError, reset } = useForm({
        validationSchema
    })
    const [callMutation, { error, loading }] = useMutation(mutation, {
        onCompleted: (data:any) => {
            if (data && Object.keys(data).some(k => data[k])) {
                setSuccess(true)
                reset();
            }
            onCompleted && onCompleted(data);
        }
    });

    const authFormInputs:React.ReactNodeArray = [];
    const links:React.ReactNodeArray = [];
    const socialButtons:React.ReactNodeArray = [];
    let avatarSelect:React.ReactElement = null;

    React.Children.forEach(children, (c:any) => (
        (c.type.displayName === 'Input' && authFormInputs.push(c))
        || (c.props.to && links.push(c)) 
        || (c.props.variant && socialButtons.push(c))
        || (c.type.displayName === 'AvatarSelect' && (avatarSelect = c))
    ));

    const handleOnFormSubmit = (input:FormData) => {
        setSuccess(false)
        callMutation({ variables: { input } });
    }

    useEffect(() => {
        if (error){
            const { stacktrace, ...errors } = error.graphQLErrors[0].extensions.exception;

            Object.entries(errors).forEach(([key, i18nKey]) => 
                setError(key, null, t(`formErrors.${i18nKey}`, {field: t(`formErrors.field.${key}`) })))
        }
    }, [error])

    return (
        <Box>
            <Title>{title}</Title>
            {errors && errors['warning'] && (
                <Alert variant="warning">
                    <Trans i18nKey={errors['warning'].message}>
                        {warningMessages[errors['warning'].message]()}
                    </Trans>
                </Alert>
            )}
            {success && successMessage && (
                <Alert variant="success">
                    {successMessage}
                </Alert>
            )}
            <Form onSubmit={handleSubmitWrapper(handleOnFormSubmit)}>
                {authFormInputs.map((authFormInput: React.ReactElement) => (
                    <React.Fragment key={`${title}-${authFormInput.props.name}`}>
                        {React.cloneElement(authFormInput, {
                            ref: register,
                            error: errors && errors[authFormInput.props.name],
                            placeholder: authFormInput.props.placeholder
                                ? authFormInput.props.placeholder.charAt(0).toUpperCase() + authFormInput.props.placeholder.slice(1)
                                : null
                        })}
                        <HelperText variant="warning">
                            {errors && errors[authFormInput.props.name] && errors[authFormInput.props.name].message}
                        </HelperText>
                    </React.Fragment>
                ))}

                {avatarSelect && (
                    <>
                        {React.cloneElement(avatarSelect, { forwardRef: register })}
                        <HelperText variant="warning">
                            {errors && errors[avatarSelect.props.name] && errors[avatarSelect.props.name].message}
                        </HelperText>
                    </>
                )}

                <Button type="submit" disabled={loading}>
                    {loading
                        ? <Spinner animation="border" />
                        : <Typography variant={4} as="span">{title}</Typography>}
                </Button>

                {socialButtons.map((socialButton: React.ReactElement) => (
                    React.cloneElement(socialButton, {
                        key: `social-${socialButton.props.variant}`
                    })
                ))}

                <AuthFormLinks>
                    {links.map((authFormLink: React.ReactElement) => (
                        React.cloneElement(authFormLink, {
                            key: `link-${authFormLink.props.to}`
                        })
                    ))}
                </AuthFormLinks>
            </Form>
        </Box>
    )
}

export default AuthForm;