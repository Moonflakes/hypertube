import React from 'react';
import ReactDOM from 'react-dom';
import PersonCard from '..';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PersonCard firstname="Leonardo" lastname="Dicaprio" nameId="nm0000138" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
