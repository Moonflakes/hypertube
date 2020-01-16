import React from 'react';
import ReactDOM from 'react-dom';
import Label from '..';
import theme from '../../../theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Label theme={theme}>Test</Label>, div);
  ReactDOM.unmountComponentAtNode(div);
});
