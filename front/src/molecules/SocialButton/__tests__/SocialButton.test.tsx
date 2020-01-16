import React from 'react';
import ReactDOM from 'react-dom';
import SocialButton from '..';
import theme from '../../../theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SocialButton theme={theme} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
