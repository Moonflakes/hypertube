import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = styled(Spinner)`
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 30px;
`

export default LoadingSpinner;