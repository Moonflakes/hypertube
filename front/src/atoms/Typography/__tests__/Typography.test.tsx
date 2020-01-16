import React from 'react';
import ReactDOM from 'react-dom';
import Typography from '..';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Typography variant={5}>example</Typography>, div);
  ReactDOM.unmountComponentAtNode(div);
});
