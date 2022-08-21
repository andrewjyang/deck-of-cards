# Deck of Cards

---
Deck of Cards is an application built using Node.js. The server makes calls to
the [Deck of Cards API](https://deckofcardsapi.com/) and runs tests using mock data.

Deck of Cards implements the following tasks:

- Creates and shuffles a deck of cards
- Draws 5 cards from the hand and prints their numbers and suits to the console
- Identifies the [top-scoring poker hand](https://en.wikipedia.org/wiki/List_of_poker_hands) that the cards fulfill and
  prints it to the console

### Instructions
1. Install packages and dependencies
    ````
    npm run install
    ````
2. Start program
    ````
    npm run start
    ````
3. Test program
    ```
    npm run test
    ```
    note: mock data is stored in `mock >> data.json`

### Assumptions
- The program assumes a standard deck meaning the deck contains a total of 52 cards with 13 ranks and 4 suits in each
  rank.
- The program assumes a standard deck with the suits: clubs, diamonds, hearts, and spades.
- The program assumes a standard deck with the ranks: 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king, ace where 2 is low
  and ace is high when determining the top scoring poker hand.
- The program assumes a standard deck that does not include the joker cards (ie. five of a kind is not possible).
- The program assumes an ace may be used as a low in a straight (ie. ace, 2, 3, 4, 5 is the lowest possible straight
  also called a "wheel").

### Author

Andrew J. Yang