import React, { useState, useEffect } from "react";
import "./Board.css";
import { createDeck } from "../data/deckData";

const shuffleDeck = (deck) => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const Board = () => {
  const initialPlayerState = () => ({
    deck: shuffleDeck(createDeck()),
    hand: [],
    board: Array(9).fill(null),
    actions: 900,
    selectedCardIndex: null,
    selectedBoardIndex: null, // Tracks selected card on board for movement
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
        selectedCardIndex:
          prevPlayers[player].selectedCardIndex === index ? null : index, // Toggle selection
        selectedBoardIndex: null, // Deselect board card when selecting from hand
      },
    }));
  };

  const handleSelectBoardCard = (player, index) => {
    setPlayers((prevPlayers) => ({
      ...prevPlayers,
      [player]: {
        ...prevPlayers[player],
        selectedBoardIndex:
          prevPlayers[player].selectedBoardIndex === index ? null : index, // Toggle selection
        selectedCardIndex: null, // Deselect hand card when selecting from board
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

  const handleMoveCard = (player, newIndex) => {
    setPlayers((prevPlayers) => {
      const currentPlayer = prevPlayers[player];
      const { board, actions, selectedBoardIndex } = currentPlayer;

      if (actions > 0 && selectedBoardIndex !== null) {
        const newBoard = [...board];
        newBoard[newIndex] = newBoard[selectedBoardIndex]; // Move card
        newBoard[selectedBoardIndex] = null; // Clear old spot

        return {
          ...prevPlayers,
          [player]: {
            ...prevPlayers[player],
            board: newBoard,
            actions: actions - 1,
            selectedBoardIndex: null, // Deselect after moving
          },
        };
      }
      return prevPlayers;
    });
  };

  const handleDrawCard = (player) => {
    setPlayers((prevPlayers) => {
      const currentPlayer = prevPlayers[player];
      const { deck, hand, actions } = currentPlayer;

      if (hand.length >= 5) {
        alert("You can only have a maximum of 5 cards in hand!");
        return prevPlayers; // Prevent drawing if hand is full
      }
      if (deck.length > 0 && actions > 0) {
        return {
          ...prevPlayers,
          [player]: {
            ...currentPlayer,
            hand: [...hand, deck[0]], // Add top deck card to hand
            deck: deck.slice(1), // Remove top card from deck
            actions: actions - 1, // Deduct one action
          },
        };
      } else {
        alert(
          deck.length === 0 ? "No cards left in deck!" : "No actions remaining!"
        );
      }
      return prevPlayers;
    });
  };

  const getAvailableMoves = (board, index) => {
    const moves = [];
    const row = Math.floor(index / 3);
    const col = index % 3;

    const directions = [
      { rowOffset: -1, colOffset: 0 }, // Up
      { rowOffset: 1, colOffset: 0 }, // Down
      { rowOffset: 0, colOffset: -1 }, // Left
      { rowOffset: 0, colOffset: 1 }, // Right
    ];

    directions.forEach(({ rowOffset, colOffset }) => {
      const newRow = row + rowOffset;
      const newCol = col + colOffset;
      const newIndex = newRow * 3 + newCol;

      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        if (board[newIndex] === null) {
          moves.push(newIndex);
        }
      }
    });

    return moves;
  };

  const renderPlayerSection = (playerKey) => {
    const player = players[playerKey];
    const availableMoves =
      player.selectedBoardIndex !== null
        ? getAvailableMoves(player.board, player.selectedBoardIndex)
        : [];

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
              className={`board-cell ${slot ? "occupied" : ""} 
    ${availableMoves.includes(index) ? "highlight" : ""} 
    ${player.selectedBoardIndex === index ? "selected" : ""}`}
              style={{
                backgroundColor: slot ? slot.color : "transparent",
                border: availableMoves.includes(index) ? "2px solid green" : "",
              }}
              onClick={() =>
                availableMoves.includes(index)
                  ? handleMoveCard(playerKey, index)
                  : slot
                  ? handleSelectBoardCard(playerKey, index)
                  : handlePlaceCard(playerKey, index)
              }
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
