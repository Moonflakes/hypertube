import React from 'react';
import ReactDOM from 'react-dom';
import VideoPlayer from '..';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<VideoPlayer imdbId={'99'} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
