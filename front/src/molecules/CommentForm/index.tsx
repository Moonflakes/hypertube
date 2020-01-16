import React from 'react';
import styled from 'styled-components';
import useForm from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup';
import { Spinner } from 'react-bootstrap'

import { Button, Textarea, HelperText, Typography } from '../../atoms';

interface CommentFormProps extends React.DetailedHTMLFactory<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
    className?: string
    onSubmit: any
    TextareaProps?: any
    ButtonProps?: any
    loading?: boolean
}

const CommentForm = ({ loading, className, onSubmit, TextareaProps = {}, ButtonProps = {}, ...props}:CommentFormProps) => {
    const { t } = useTranslation();
    const validationSchema:yup.Schema<any> = yup.object().shape({
        comment: yup.string().required(t('formErrors.any.empty')),
    });
    const { register, handleSubmit, errors, reset, setError } = useForm({ validationSchema });
    const buttonLabel = t('send-comment');
    const onSubmitWrapper = (data:any) => onSubmit(data, { reset, setError })

    return (
        <form className={className} onSubmit={handleSubmit(onSubmitWrapper)} {...props}>
            <Textarea
                name="comment"
                ref={register}
                rows={7}
                style={{ resize: 'none' }}
                error={errors.comment}
                placeholder={t('comment-placeholder')}
                {...TextareaProps}/>
            {errors.comment && <HelperText variant="warning">{errors.comment.message}</HelperText>}

            <Button type="submit" disabled={loading} {...ButtonProps}>
                {loading
                    ? <Spinner animation="border" />
                    : (
                        <Typography variant={4} as="span">
                            {buttonLabel.charAt(0).toUpperCase() + buttonLabel.slice(1)}
                        </Typography>
                    )}
            </Button>
        </form>
    )
}

export default styled(CommentForm)`
    width: 100%;
    display flex;
    flex-direction: column;
    align-items: center;

    ${Button} {
        margin-top: 77px;
    }

    ${HelperText} {
        align-self: start;
        margin-top: 7px;
        margin-bottom: -30px;
    }

    ${Typography} {
        &::first-letter {
            text-transform: uppercase;
        }
    }
`;