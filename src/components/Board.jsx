import React, { useState, useEffect } from "react";
import "./Board.css";
import { createDeck } from "../data/deckData";

const shuffleDeck = (deck) => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const Board = () => {
  const initialPlayerState = () => ({
    deck: shuffleDeck(createDeck()), // Unique shuffled deck for each player
    hand: [],
    board: Array(9).fill(null),
    actions: 3,
    selectedCardIndex: null,
  });

  const [players, setPlayers] = useState({
    player1: initialPlayerState(),
    player2: initialPlayerState(),
  });

  const [firstTurn, setFirstTurn] = useState(true);

  useEffect(() => {
    if (firstTurn) {
      drawInitialCards("player1");
      drawInitialCards("player2");
      setFirstTurn(false);
    }
  }, [firstTurn]);

  const drawInitialCards = (player) => {
    setPlayers((prevPlayers) => {
      const { deck } = prevPlayers[player];
      const newDeck = deck.slice(3);
      const newHand = deck.slice(0, 3);
      return {
        ...prevPlayers,
        [player]: {
          ...prevPlayers[player],
          deck: newDeck,
          hand: newHand,
        },
      };
    });
  };

  const handleSelectCard = (player, index) => {
    setPlayers((prevPlayers) => ({
      ...prevPlayers,
      [player]: {
        ...prevPlayers[player],
        selectedCardIndex: index,
      },
    }));
  };

  const handlePlaceCard = (player, slotIndex) => {
    const currentPlayer = players[player];
    const { hand, board, actions, selectedCardIndex } = currentPlayer;

    if (
      actions > 0 &&
      board[slotIndex] === null &&
      selectedCardIndex !== null
    ) {
      const selectedCard = hand[selectedCardIndex];
      const newBoard = [...board];
      newBoard[slotIndex] = selectedCard;

      const newHand = [...hand];
      newHand.splice(selectedCardIndex, 1);

      setPlayers((prevPlayers) => ({
        ...prevPlayers,
        [player]: {
          ...prevPlayers[player],
          board: newBoard,
          hand: newHand,
          actions: actions - 1,
          selectedCardIndex: null,
        },
      }));
    } else {
      alert(actions === 0 ? "No actions remaining!" : "Invalid move!");
    }
  };

  const handleDrawCard = (player) => {
    setPlayers((prevPlayers) => {
      const currentPlayer = prevPlayers[player];
      const { deck, hand, actions } = currentPlayer;

      if (actions > 0 && deck.length > 0 && hand.length < 5) {
        const newCard = deck[0];
        return {
          ...prevPlayers,
          [player]: {
            ...currentPlayer,
            hand: [...hand, newCard],
            deck: deck.slice(1),
            actions: actions - 1,
          },
        };
      } else {
        alert(actions === 0 ? "No actions remaining!" : "Hand limit reached!");
        return prevPlayers;
      }
    });
  };

  const renderPlayerSection = (playerKey) => {
    const player = players[playerKey];
    return (
      <div className="player-section">
        <h2>{playerKey === "player1" ? "Player 1" : "Player 2"}</h2>
        <p>Actions Remaining: {player.actions}</p>
        <button onClick={() => handleDrawCard(playerKey)}>Draw Card</button>
        <div className="player-hand">
          <h4>Hand:</h4>
          {player.hand.map((card, index) => (
            <div
              key={index}
              className={`card ${
                player.selectedCardIndex === index ? "selected" : ""
              }`}
              style={{ backgroundColor: card.color }}
              onClick={() => handleSelectCard(playerKey, index)}
            >
              {card.type}
            </div>
          ))}
        </div>
        <div className="board-grid">
          {player.board.map((slot, index) => (
            <div
              key={index}
              className={`board-cell ${slot ? "occupied" : ""}`}
              style={{ backgroundColor: slot ? slot.color : "transparent" }}
              onClick={() => handlePlaceCard(playerKey, index)}
            >
              {slot ? slot.type : `Slot ${index + 1}`}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="game-board">
      {["player1", "player2"].map((playerKey) =>
        renderPlayerSection(playerKey)
      )}
    </div>
  );
};

export default Board;
