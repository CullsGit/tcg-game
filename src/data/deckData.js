// src/data/deckData.js
export function createDeck() {
  const cardTypes = [
    { type: "Tank", color: "blue" },
    { type: "Damage", color: "red" },
    { type: "Speed", color: "green" },
    { type: "Healer", color: "purple" },
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
