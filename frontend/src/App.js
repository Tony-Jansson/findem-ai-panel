import React from 'react';
import Chat from './components/Chat';
import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Findem Group AI Panel</h1>
      </header>
      <main>
        <Chat />
      </main>
    </div>
  );
}

export default App;
