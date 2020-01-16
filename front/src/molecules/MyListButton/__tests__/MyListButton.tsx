import React from 'react';
import ReactDOM from 'react-dom';
import MyListButton from '..';
import theme from '../../../theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MyListButton theme={theme} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
