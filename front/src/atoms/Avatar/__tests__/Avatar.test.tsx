import React from 'react';
import ReactDOM from 'react-dom';
import Avatar from '..';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Avatar src="https://pickaface.net/gallery/avatar/sebastien.larcher5270905bcf67b.png" variant="big"/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
