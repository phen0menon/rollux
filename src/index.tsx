import React from 'react';
import ReactDOM from 'react-dom';
import DerivedApp from './App';

ReactDOM.render(
  <React.StrictMode>
    <DerivedApp testProp={"s"} />
  </React.StrictMode>,
  document.getElementById('root')
);
