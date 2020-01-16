import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { useTranslation } from 'react-i18next'
import useForm from 'react-hook-form'
import { Globe } from 'styled-icons/fa-solid'
import { CaretDown } from 'styled-icons/boxicons-regular'

import resources from '../../translations';

const languages = Object.keys(resources);

interface LanguageSelectorForm extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
    className?: string
    theme?: DefaultTheme
}

const LanguageSelectorForm = styled((props: LanguageSelectorForm) => {
    const { t, i18n } = useTranslation();
    const { register, handleSubmit } = useForm({ 
        mode: 'onChange',
        defaultValues: {
            language: i18n.language
        }
    });

    const onChange = ({ language }: any):any => {
        i18n.changeLanguage(language);
        window.location.reload();
    }

    return (
        <form {...props}>
            <Globe id="globe" />
            <select name="language" ref={register} onChange={handleSubmit(onChange)}>
                {languages.map(language =>
                    <option value={language} key={`language-${language}`}>
                        {t(`language.${language}`)}
                    </option>)}
            </select>
            <CaretDown id="caret" />
        </form>
    )
})`
    position: relative;
    svg {
        position: absolute;
        height: 16px;
        
        &#globe {
            top: 17px;
            left: 15px;
            color: #999;
        }

        &#caret {
            right: 10px;
            top: 18px;
            color: #999;
        }
    }

    select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: #000;
        background-image: none;
        border: 1px solid #333;
        color: #999;
        padding: 12px 30px 12px 50px;
    }
`

export default LanguageSelectorForm;