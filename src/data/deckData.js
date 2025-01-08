// src/data/deckData.js

export const cardTypes = [
  { type: "tank", color: "blue" },
  { type: "damage", color: "red" },
  { type: "speed", color: "green" },
  { type: "healer", color: "yellow" },
];

// Create a deck with 4 of each type
export const createDeck = () => {
  const deck = [];

  // Push 4 of each card type into the deck
  cardTypes.forEach((card) => {
    for (let i = 0; i < 5; i++) {
      deck.push({ type: card.type, color: card.color });
    }
  });

  return deck;
};
