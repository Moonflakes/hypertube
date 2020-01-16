import React from 'react';
import ReactDOM from 'react-dom';
import SearchInputHeader from '..';
import theme from '../../../theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchInputHeader theme={theme} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
