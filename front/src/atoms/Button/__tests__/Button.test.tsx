import React from 'react';
import ReactDOM from 'react-dom';
import Button from '..';
import theme from '../../../theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Button theme={theme} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
