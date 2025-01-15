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

  // Function to draw a card with action limit and hand size limit enforcement
  const handleDrawCard = (
    playerHand,
    setPlayerHand,
    playerDeck,
    setPlayerDeck,
    actions,
    setActions
  ) => {
    if (actions > 0 && playerDeck.length > 0) {
      if (playerHand.length < 5) {
        const newCard = playerDeck[0];
        setPlayerHand([...playerHand, newCard]);
        setPlayerDeck(playerDeck.slice(1));
        setActions(actions - 1);
      } else {
        alert("Hand limit reached (5 cards)!");
      }
    } else {
      alert("No actions remaining!");
    }
  };

  // Function to place a card on the board
  const handlePlaceCard = (
    playerHand,
    setPlayerHand,
    board,
    setBoard,
    slotIndex,
    actions,
    setActions
  ) => {
    if (actions > 0 && board[slotIndex] === null) {
      const selectedCard = playerHand[0]; // Select the first card in hand to place
      if (selectedCard) {
        // Update board with placed card
        const newBoard = [...board];
        newBoard[slotIndex] = selectedCard;
        setBoard(newBoard);

        // Remove placed card from player's hand
        setPlayerHand(playerHand.slice(1));

        // Decrement action count
        setActions(actions - 1);
      }
    } else if (board[slotIndex] !== null) {
      alert("Slot already occupied!");
    } else {
      alert("No actions remaining!");
    }
  };

  // Render a single player's board
  const renderBoard = (
    board,
    playerHand,
    setPlayerHand,
    actions,
    setActions,
    setBoard
  ) => (
    <div className="board-grid">
      {board.map((slot, index) => (
        <div
          key={index}
          className={`board-cell ${slot ? "occupied" : ""}`}
          style={{ backgroundColor: slot ? slot.color : "transparent" }}
          onClick={() =>
            handlePlaceCard(
              playerHand,
              setPlayerHand,
              board,
              setBoard,
              index,
              actions,
              setActions
            )
          }
        >
          {slot ? slot.type : `Slot ${index + 1}`}
        </div>
      ))}
    </div>
  );
  return (
    <div className="game-board">
      <div className="player-section">
        <h2>Player 1</h2>
        <p>Actions Remaining: {playerOneActions}</p>
        <button
          onClick={() =>
            handleDrawCard(
              playerOneHand,
              setPlayerOneHand,
              playerOneDeck,
              setPlayerOneDeck,
              playerOneActions,
              setPlayerOneActions
            )
          }
        >
          Draw Card
        </button>
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
        {renderBoard(
          playerOneBoard,
          playerOneHand,
          setPlayerOneHand,
          playerOneActions,
          setPlayerOneActions,
          setPlayerOneBoard
        )}
      </div>

      <div className="player-section">
        <h2>Player 2</h2>
        <p>Actions Remaining: {playerTwoActions}</p>
        <button
          onClick={() =>
            handleDrawCard(
              playerTwoHand,
              setPlayerTwoHand,
              playerTwoDeck,
              setPlayerTwoDeck,
              playerTwoActions,
              setPlayerTwoActions
            )
          }
        >
          Draw Card
        </button>
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
        {renderBoard(
          playerTwoBoard,
          playerTwoHand,
          setPlayerTwoHand,
          playerTwoActions,
          setPlayerTwoActions,
          setPlayerTwoBoard
        )}
      </div>
    </div>
  );
};

export default Board;
