import React from 'react';
import ReactDOM from 'react-dom';
import Input from '..';
import theme from '../../../theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Input type="text" placeholder="Username" error theme={theme} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
