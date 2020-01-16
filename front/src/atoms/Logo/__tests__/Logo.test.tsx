import React from 'react';
import ReactDOM from 'react-dom';
import Logo from '..';
import theme from '../../../theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Logo theme={theme} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
