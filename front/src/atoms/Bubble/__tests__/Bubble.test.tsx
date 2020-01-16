import React from 'react';
import ReactDOM from 'react-dom';
import Bubble from '..';
import theme from '../../../theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Bubble hasError theme={ theme }>TEST COMMENT</Bubble>, div);
  ReactDOM.unmountComponentAtNode(div);
});
