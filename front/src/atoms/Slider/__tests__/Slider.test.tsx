import React from 'react';
import ReactDOM from 'react-dom';
import Slider from '..';
import theme from '../../../theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Slider theme={theme} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
