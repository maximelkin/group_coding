import React from 'react';
import ReactDOM from 'react-dom';

import { test } from './app';

const App = () => (
  <div className="App">
    <h1 className="App-Title">Test</h1>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
