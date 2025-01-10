// src/data/deckData.js
export function createDeck() {
  const cardTypes = [
    { type: "tank", color: "blue" },
    { type: "damage", color: "red" },
    { type: "speed", color: "green" },
    { type: "healer", color: "yellow" },
  ];

  let deck = [];
  cardTypes.forEach((cardType) => {
    for (let i = 0; i < 4; i++) {
      deck.push({ ...cardType });
    }
  });

  return shuffleDeck(deck);
}

// Fisher-Yates Shuffle Algorithm
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
