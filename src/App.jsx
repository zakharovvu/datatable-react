import React from 'react';

import logo from './logo.svg';
import './App.css';

const App = () => (
  <div className="app">
    <header className="app-header">
      <img src={logo} className="app-logo" alt="logo" />
      <p>
       [awesome] react app
      </p>
    </header>
    <main className="app-main">
      place app here
    </main>
  </div>
);
export default App;
