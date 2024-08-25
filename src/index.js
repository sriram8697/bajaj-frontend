import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main'; // Import Main.js


ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root') // Assumes that your root div is in index.html
);
