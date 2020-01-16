import React from 'react';
import ReactDOM from 'react-dom';
import PlayButton from '..';
import theme from '../../../theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PlayButton theme={theme} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
