import React, { useState, useEffect, useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import styled, { DefaultTheme } from 'styled-components';
import { Edit } from 'styled-icons/boxicons-regular/Edit';
import { Close } from 'styled-icons/material';
import { Check } from 'styled-icons/boxicons-regular/Check';
import { Spinner3 } from 'styled-icons/evil/Spinner3';
import useForm from 'react-hook-form';
import { Container, Row, Col } from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as yup from 'yup';

import { auth } from '../hocs'

import { Header, Footer } from '../organisms';
import { Avatar, Input, HelperText } from '../atoms';

const Box = styled.div`
    position: relative;
    padding: 30px 55px 40px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
    ${({ theme }: { theme: DefaultTheme }) => theme.elevation["2dp"]};
    ${({ theme }: { theme: DefaultTheme }) => (`
        @media only screen and (max-width: ${theme.breakpoints.xs}) {
            padding: 12px 20px 17px;
        }
    `)}
`
const Title = styled.h3`
    color: ${({ theme }: { theme: DefaultTheme}) => theme.colors.white};
    font-size: 32px;
    margin: 0 -5px 30px;
    text-transform: capitalize;
`
const EditForm = styled(Edit)`
    color: #999999;
    cursor: pointer;
`
const UpdateForm = styled(Check)`
    color: #999999;
    cursor: pointer;
`
const CloseForm = styled(Close)`
    color: #999999;
    cursor: pointer;
`

const SpinnerForm = styled(Spinner3)`
    animation: rotate 1s linear infinite;
    color: #999999;

    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }
`

const ME_QUERY = gql`
    query AccountMe {
        user: me {
            id
            avatar
            firstname
            lastname
            username
            email
        }
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

const MAX_AVATARS = {
    FEMALE: 114,
    MALE: 129,
}
    
const allAvatars = [
    ...Array.from({ length: MAX_AVATARS.FEMALE }).map((_, i) => `/female/${i + 1}`),
    ...Array.from({ length: MAX_AVATARS.MALE }).map((_, i) => `/male/${i + 1}`)
].sort(() => Math.random() - 0.5)

interface AvatarListProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
        avatars: any
        selectedAvatar: string
        isAllAvatarsShowed?: boolean
        onAvatarClick: any
}

const AvatarList = styled(({
        avatars,
        selectedAvatar,
        isAllAvatarsShowed,
        onAvatarClick,
        ...props
    }: AvatarListProps) => {
        return (
            <div {...props}>
                {avatars.map((src:string) => (
                    <Avatar
                        variant="squared"
                        className={src === selectedAvatar ? 'selected' : ''}
                        src={`${process.env.PUBLIC_URL}/avatars${src}.png`}
                        data-src={src}
                        onClick={onAvatarClick}
                        key={props.id ? props.id + src : src} />
                ))}
            </div>
        );
    })`
    ${Avatar} {
        width: 50px;
        height: 50px;
        margin: 5px 5px;
        border: 2px solid transparent;

        &.selected {
            border: 2px solid white;
        }
    }
`

interface InputTableProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    placeholderText: string
    errors: any
    label: string
    forwardRef: any,
    value?: string,
    type?: string
}

const InputTable = styled(({
    placeholderText,
    errors,
    label,
    forwardRef,
    value,
    type,
    ...props
    }: InputTableProps) => {
        return (
            <div {...props}>
                <Input
                    type={type}
                    defaultValue={value}
                    name={label}
                    placeholder={placeholderText}
                    ref={forwardRef}
                    error={errors && errors[label]}/>
                <HelperText variant="warning">
                    {errors && errors[label] && errors[label].message}
                </HelperText>
            </div>
        );
})`
${Input} {
    width: 100%;
    padding: 0px;
    margin: 0px;
    background-color: transparent;
    border-radius: 0px;
    color: #999999;
    font-size: 16px;
    outline: none;
    border: none;
    border-bottom: #9999 1px solid;
    
}
`

const UPDATE_MUTATION = gql`
    mutation updateUserInfos($input: UpdateUserInfosInput!) {
        updateUserInfos(input: $input) {
            id
            avatar
            firstname
            lastname
            username
            email
        }
    }
`;

const Account = styled(({ className }) => {
    const { t } = useTranslation();

    const translate = {
        account: t('account'),
        firstname: t('firstname'),
        lastname: t('lastname'),
        email: t('email'),
        newEmail: t('new-email'),
        username: t('username'),
        newUsername: t('new-username'),
        pwd: t('password'),
        newPwd: t('new-password'),
        pwdConf: t('password-confirm'),
        update: t('update'),
        updatePwd: t('reset-pwd'),
        emptyForm: t('formErrors.any.empty'),
        invalidEmail: t('formErrors.any.email'),
        pwdNotEq: t('formErrors.any.password-not-equal'),
        invalidPwd: t('formErrors.any.password')
    }
    
    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const pwdRef = useRef(null);
    const confirmRef = useRef(null);
    const avatarRef= useRef(null);

    const [isAllAvatarsShowed, setIsAllAvatarsShowed] = useState(false);
    const [isUpdateUsername, setIsUpdateUsername] = useState(false);
    const [isUpdateEmail, setIsUpdateEmail] = useState(false);
    const [isUpdatePwd, setIsUpdatePwd] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [success, setSuccess] = useState(null);

    const { data, loading, error } = useQuery(ME_QUERY);

    if (error || (!loading && !data.user))
        return <Redirect to="/" />

    const schemaInfos:yup.Schema<any> = yup.object().shape({
        email: yup.string()
            .required(translate.emptyForm)
            .email(translate.invalidEmail),
        username: yup.string()
            .required(translate.emptyForm)
    });

    const schemaPwd:yup.Schema<any> = yup.object().shape({
        password: yup.string()
            .required(translate.emptyForm)
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, translate.invalidPwd),
        passwordConfirm: yup.string()
            .required(translate.emptyForm)
            .test({
                name: 'equalTo',
                exclusive: false,
                message: translate.pwdNotEq,
                test: function (value:string) {
                    return value === this.parent.password;
                }
            })
    });

    const { errors, setError, reset, clearError } = useForm({
        validationSchema: schemaInfos
    })
    
    const [callMutation, { error: err, loading: load }] = useMutation(UPDATE_MUTATION);

    useEffect(() => {
        if (err){
            const { stacktrace, ...errors } = err.graphQLErrors[0].extensions.exception;

            Object.entries(errors).forEach(([key, i18nKey]) => 
                setError(key, null, t(`formErrors.${i18nKey}`, {field: t(`formErrors.field.${key}`) })))
        }
    }, [err])
    
    const onUpdate = async (ref:any) => {
        const values = [ref.current.value]
        const name = ref.current.name;

        const mutate = () => callMutation({
            variables: { input: { name, values } },
            update: () => {
                setSuccess({ name })
                setIsUpdateUsername(false)
                setIsUpdateEmail(false)
                setIsUpdatePwd(false)
                setIsAllAvatarsShowed(false)
                reset();
            }
        });

        clearError();

        try {
            if (ref.current.name === "password") {
                values.push(confirmRef.current.value)

                await schemaPwd.validate({ password: values[0], passwordConfirm: values[1] }, { abortEarly: false });
            } else if (name !== "avatar")
                await schemaInfos.validateAt(name, { [name]: values[0] })
            
            mutate();
        } catch (e) {
            if (ref.current.name === "password")
                return e.inner.reduce((p:any, err:any) => {
                    if (!p.includes(err.path) && err.path) {
                        setError(err.path, null, err.message)
                        return [...p, err.path];
                    }
                    return p;
                }, [])
            
            setError(e.path, null, e.message)
        }
    }

    const handleOnAvatarClick = (e:any):any => {
        const avatar = e.currentTarget.getAttribute('data-src');

        setSelectedAvatar(avatar);
    };

    return (
        <div className={className} >
            <Header />
            {loading || (
                <>
                <Box>
                    <Title>{translate.account}</Title>
                    {success && (
                        <Alert variant="success">
                            <Trans i18nKey="successUpdateInfos" >
                                <strong>Votre {{ name: t(success.name) }} a bien été modifié</strong>.
                            </Trans>
                        </Alert>
                    )}
                    
                    <div id="avatarDiv">
                        <Avatar id="avatar" variant="big" src={`${process.env.PUBLIC_URL}/avatars${selectedAvatar || data.user.avatar}.png`} />
                        {isAllAvatarsShowed
                            ? <>{ load
                                    ? <SpinnerForm id="spinnerAvatar" size={20} />
                                    : (<UpdateForm id="updateAvatar" size={20} onClick={() => onUpdate(avatarRef)}/>) }
                                    <CloseForm id="closeAvatar" size={20} onClick={() => setIsAllAvatarsShowed(false)}/></>
                            : <EditForm id="editAvatar" size={20} onClick={() => setIsAllAvatarsShowed(true)} /> 
                        }
                    </div>
                        <Input ref={avatarRef} type="hidden" name="avatar" value={selectedAvatar}/>
                        <Container>
                            <Row>
                                <Col xs={4} id="label">{translate.firstname} :</Col>
                                <Col xs={4} id="infosUser">{data.user.firstname}</Col>
                                <Col xs={4}></Col>
                            </Row>
                            <Row>
                                <Col xs={4} id="label">{translate.lastname} :</Col>
                                <Col xs={4} id="infosUser">{data.user.lastname}</Col>
                                <Col xs={4}></Col>
                            </Row>
                            <Row>
                                <Col xs={12} sm={4} id="label">{translate.username} :</Col>
                                <Col xs={10} sm={7} id="infosUser">{isUpdateUsername
                                    ? <InputTable forwardRef={ usernameRef } value={data.user.username} label="username" placeholderText={translate.newUsername} errors={errors}/>
                                    : data.user.username}</Col>
                                <Col xs={2} sm={1} className="justify-content-end" id="actions">{ isUpdateUsername
                                    ? <>{ load
                                        ? <SpinnerForm size={20} />
                                        : (<UpdateForm size={20} onClick={() => onUpdate(usernameRef)}/>)}
                                        <CloseForm size={20} onClick={() => setIsUpdateUsername(false)}/></>
                                    : <EditForm size={20} onClick={() => setIsUpdateUsername(true)} /> 
                                }</Col>
                            </Row>
                            <Row>
                                <Col xs={12} sm={4} id="label">{translate.email} :</Col>
                                <Col xs={10} sm={7} id="infosUser">{ isUpdateEmail
                                    ? <InputTable forwardRef={ emailRef } label="email" value={data.user.email} placeholderText={translate.newEmail} errors={errors}/>
                                    : data.user.email }</Col>
                                <Col xs={2} sm={1} className="justify-content-end" id="actions">{ isUpdateEmail
                                    ? <>{ load
                                        ? <SpinnerForm size={20} />
                                        : (<UpdateForm size={20} onClick={() => onUpdate(emailRef)}/>) }
                                        <CloseForm size={20} onClick={() => setIsUpdateEmail(false)}/></>
                                    : <EditForm size={20} onClick={() => setIsUpdateEmail(true)} />  
                                }</Col>
                            </Row>
                            <Row>
                                <Col xs={12} sm={4} id="label">{translate.pwd} :</Col>
                                <Col xs={10} sm={7} id="infosUser">{ isUpdatePwd
                                    ? <><InputTable forwardRef={ pwdRef } label="password" placeholderText={translate.newPwd} errors={errors} type="password"/>
                                        <InputTable forwardRef={ confirmRef } label="passwordConfirm" placeholderText={translate.pwdConf} errors={errors} type="password"/></>
                                    : data.user.password }</Col>
                                <Col xs={2} sm={1} className="justify-content-end" id="actions">{ isUpdatePwd
                                    ? (
                                        <>
                                            { load
                                            ? <SpinnerForm size={20} />
                                            : (<UpdateForm size={20} onClick={() => onUpdate(pwdRef)}/>) }
                                            <CloseForm size={20} onClick={() => setIsUpdatePwd(false)}/>
                                        </>
                                    )
                                    : <EditForm size={20} onClick={() => setIsUpdatePwd(true)} /> 
                                }</Col>
                            </Row>
                        </Container>
                        {isAllAvatarsShowed?  
                            <AvatarList
                                id="all-avatars"
                                avatars={allAvatars}
                                selectedAvatar={selectedAvatar || data.user.avatar}
                                onAvatarClick={handleOnAvatarClick}
                                isAllAvatarsShowed={isAllAvatarsShowed}
                            /> : <></>}
                </Box>
                </>
                 )}
            <Footer />
        </div>
    )
})`
    min-height: 100vh;
    position: relative;
    padding-bottom: 216px;
    padding-top: 117px;
    background: url(/cinema.png);
    background-size: cover;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    display: flex;

    .col, .col-1, .col-11, .col-12, .col-3, .col-4, .col-5, .col-6, .col-7, 
    .col-8, .col-9, .col-auto, .col-lg, .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, 
    .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-auto, 
    .col-md, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, 
    .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-auto, .col-sm, .col-sm-1, 
    .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, 
    .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-10, .col-xl-11, 
    .col-xl-12, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, 
    .col-xl-9, .col-xl-auto {
        padding: 0;
        padding-top: 20px;
    }

    #infosUser {
        color: white;
        width: 270px;
    }


    #label {
        color: #999999;
        width: 160px;

        &::first-letter {
            text-transform: capitalize;
        }
    }

    td {
        padding-top: 20px;
    }

    #editAvatar, #updateAvatar, #spinnerAvatar {
        position: absolute;
        bottom: 10px;
        right: 35%;
    }

    #closeAvatar {
        position: absolute;
        bottom: 10px;
        right: 29%;
    }

    #actions {
        display: flex;
    }

    #all-avatars {
        position: absolute;
        max-width: 85px;
        height: 100%;
        right: -93px;
        bottom: 0;
        background-color: rgba(0,0,0,0.7);
        border-radius: 8px;
        justify-content: center;
        overflow-y: scroll;
    }
    ${({ theme }: { theme: DefaultTheme }) => (`
        @media only screen and (max-width: ${theme.breakpoints.xs}) {
            #all-avatars {
                right: 6px;
            }
            .col-10, .col-2 {
                padding-top: 4px!important;
            }
        }
    `)}

    #avatarDiv {
        position: relative;
        height: 137px;
    }

    #avatar {
        margin-bottom: 12px;
        position: absolute;
        right: 35%;
    }
`

export default auth('user')(Account)