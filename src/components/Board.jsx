import React, { useState, useEffect } from "react";
import "./Board.css";
import { createDeck } from "../data/deckData";

const Board = () => {
  const [playerOneDeck, setPlayerOneDeck] = useState(createDeck());
  const [playerTwoDeck, setPlayerTwoDeck] = useState(createDeck());

  const [playerOneHand, setPlayerOneHand] = useState([]);
  const [playerTwoHand, setPlayerTwoHand] = useState([]);

  const [playerOneActions, setPlayerOneActions] = useState(3);
  const [playerTwoActions, setPlayerTwoActions] = useState(3);

  const [firstTurn, setFirstTurn] = useState(true);

  const [playerOneBoard, setPlayerOneBoard] = useState(Array(9).fill(null));
  const [playerTwoBoard, setPlayerTwoBoard] = useState(Array(9).fill(null));

  // Draw 3 cards at the start of the first turn
  useEffect(() => {
    if (firstTurn) {
      setPlayerOneHand(playerOneDeck.slice(0, 3));
      setPlayerOneDeck(playerOneDeck.slice(3));
      setPlayerTwoHand(playerTwoDeck.slice(0, 3));
      setPlayerTwoDeck(playerTwoDeck.slice(3));
      setFirstTurn(false);
    }
  }, [firstTurn, playerOneDeck, playerTwoDeck]);

  // Render a single player's board
  const renderBoard = (board) => (
    <div className="board-grid">
      {board.map((slot, index) => (
        <div key={index} className="board-cell">
          {slot ? `${slot.type} (${slot.color})` : `Slot ${index + 1}`}
        </div>
      ))}
    </div>
  );
  return (
    <div className="game-board">
      <div className="player-section">
        <h2>Player 1</h2>
        <div className="player-hand">
          <h4>Hand:</h4>
          {playerOneHand.map((card, index) => (
            <div
              key={index}
              className="card"
              style={{ backgroundColor: card.color }}
            >
              {card.type}
            </div>
          ))}
        </div>
        {renderBoard(playerOneBoard)}
      </div>

      <div className="player-section">
        <h2>Player 2</h2>
        <div className="player-hand">
          <h4>Hand:</h4>
          {playerTwoHand.map((card, index) => (
            <div
              key={index}
              className="card"
              style={{ backgroundColor: card.color }}
            >
              {card.type}
            </div>
          ))}
        </div>
        {renderBoard(playerTwoBoard)}
      </div>
    </div>
  );
};

export default Board;
