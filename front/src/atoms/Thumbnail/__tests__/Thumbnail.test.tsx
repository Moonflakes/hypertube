import React from 'react';
import ReactDOM from 'react-dom';
import Thumbnail from '..';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Thumbnail src="https://m.media-amazon.com/images/M/MV5BMjM3MjQ1MzkxNl5BMl5BanBnXkFtZTgwODk1ODgyMjI@._V1_UX182_CR0,0,182,268_AL_.jpg" variant="small" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
