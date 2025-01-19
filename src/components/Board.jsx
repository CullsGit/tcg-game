import React, { useState, useEffect } from "react";
import "./Board.css";
import { createDeck } from "../data/deckData";

const Board = () => {
  const initialPlayerState = () => {
    const deck = createDeck();
    return {
      deck: deck.slice(3), // Remove 3 cards from deck
      hand: deck.slice(0, 3), // Take the first 3 cards for the hand
      board: Array(9).fill(null),
      actions: 30,
      selectedCardIndex: null,
      selectedBoardIndex: null,
    };
  };

  const [players, setPlayers] = useState({
    player1: initialPlayerState(),
    player2: initialPlayerState(),
  });

  const [currentTurn, setCurrentTurn] = useState("player1"); // Player 1 starts

  useEffect(() => {
    if (players[currentTurn].actions === 0) {
      setTimeout(endTurn, 500); // Delay for clarity
    }
  }, [players, currentTurn]);

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
    if (player !== currentTurn) return; // Block interaction for other player

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
    if (player !== currentTurn) return; // Block interaction for other player

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
    if (player !== currentTurn) return; // Block interaction for other player

    setPlayers((prevPlayers) => {
      const currentPlayer = prevPlayers[player];
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

        return {
          ...prevPlayers,
          [player]: {
            ...currentPlayer,
            board: newBoard,
            hand: newHand,
            actions: actions - 1,
            selectedCardIndex: null,
          },
        };
      }
      return prevPlayers;
    });
  };

  const handleMoveCard = (player, newIndex) => {
    if (player !== currentTurn) return; // Block interaction for other player

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

      if (hand.length >= 20) {
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

  const endTurn = () => {
    setPlayers((prevPlayers) => {
      const nextTurn = currentTurn === "player1" ? "player2" : "player1";
      return {
        ...prevPlayers,
        [nextTurn]: {
          ...prevPlayers[nextTurn],
          actions: 3, // Reset actions for the new turn
        },
      };
    });

    setCurrentTurn((prevTurn) =>
      prevTurn === "player1" ? "player2" : "player1"
    );
  };

  const renderPlayerSection = (playerKey) => {
    const player = players[playerKey];
    const isPlayerTurn = playerKey === currentTurn;

    const availableMoves =
      player.selectedBoardIndex !== null
        ? getAvailableMoves(player.board, player.selectedBoardIndex)
        : [];

    return (
      <div
        className={`player-section ${
          isPlayerTurn ? "active-turn" : "inactive-turn"
        }`}
      >
        <h2>{playerKey === "player1" ? "Player 1" : "Player 2"}</h2>
        <p>Actions Remaining: {player.actions}</p>
        <p>{isPlayerTurn ? "Your Turn" : "Waiting for Opponent..."}</p>

        {/* Disable Draw Button when not their turn */}
        <button
          onClick={() => isPlayerTurn && handleDrawCard(playerKey)}
          disabled={!isPlayerTurn}
          style={{ opacity: isPlayerTurn ? 1 : 0.5 }}
        >
          Draw Card
        </button>

        {/* Player Hand */}
        <div className="player-hand">
          <h4>Hand:</h4>
          {player.hand.map((card, index) => (
            <div
              key={index}
              className={`card ${
                player.selectedCardIndex === index ? "selected" : ""
              }`}
              style={{
                backgroundColor: card.color,
                opacity: isPlayerTurn ? 1 : 0.5,
              }}
              onClick={() => isPlayerTurn && handleSelectCard(playerKey, index)}
            >
              {card.type}
            </div>
          ))}
        </div>

        {/* Player Board Grid */}
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
                opacity: isPlayerTurn ? 1 : 0.5,
              }}
              onClick={() =>
                isPlayerTurn &&
                (availableMoves.includes(index)
                  ? handleMoveCard(playerKey, index)
                  : slot
                  ? handleSelectBoardCard(playerKey, index)
                  : handlePlaceCard(playerKey, index))
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
