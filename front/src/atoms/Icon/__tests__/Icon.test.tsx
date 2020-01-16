import React from 'react';
import ReactDOM from 'react-dom';
import Icon from '..';
import theme from '../../../theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Icon name="facebook" />, div);
  ReactDOM.unmountComponentAtNode(div);
});