import React from 'react';

const Header = ({ restartGame }) => (
  <div className="grid-header-container">
    <h1>The Fantastic <span>Clicky-Match Game</span></h1>
    <div className="justify-left timer"></div>
    <div className="justify-center game-status-text"></div>
    <div className="">
      <button onClick={restartGame} className="restart-button">Restart Game</button>
    </div>
  </div>
);

export default Header;
