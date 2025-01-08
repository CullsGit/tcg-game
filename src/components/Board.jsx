import React from "react";
import "./Board.css";

const Board = () => {
  // Initialize the boards with 9 empty cells (null or empty strings for now)
  const playerOneBoard = Array(9).fill(null);
  const playerTwoBoard = Array(9).fill(null);

  // Render a 3x3 grid for a player
  const renderBoard = (board) => (
    <div className="board">
      {board.map((cell, index) => (
        <div key={index} className="cell">
          {cell}
        </div>
      ))}
    </div>
  );

  return (
    <div className="game-board">
      <div className="player-board">
        <h2>Player 1</h2>
        {renderBoard(playerOneBoard)}
      </div>
      <div className="player-board">
        {renderBoard(playerTwoBoard)}
        <h2>Player 2</h2>
      </div>
    </div>
  );
};

export default Board;
