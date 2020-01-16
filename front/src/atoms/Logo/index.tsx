import styled from 'styled-components'

const Logo = styled.div`
  background-image: url("${process.env.PUBLIC_URL}/logo.png");
  background-size: contain;
  background-repeat: no-repeat;
  width: 196px;
  height: 53px;
`

export default Logo;