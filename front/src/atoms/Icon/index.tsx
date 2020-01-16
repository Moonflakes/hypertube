import styled from 'styled-components'

interface IconProps {
    name?: '42',
}

const names = {
    42: (props: IconProps) => `
        background-image: url("${process.env.PUBLIC_URL}/logo_42.png");
        width: 35px;
        height: 26px;
    `,
}

const Icon = styled.svg<IconProps>`
    ${({ name }: IconProps) => name ? names[name] : ''};
    background-size: contain;
    background-repeat: no-repeat;
`

Icon.defaultProps = {
    name: '42'
}

export default Icon;