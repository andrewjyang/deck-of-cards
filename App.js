const http = require('http');
const config = require('./config.js');
const DeckOfCards = require('./DeckOfCards.js');

// instantiate class to start program...
const Deck = new DeckOfCards();
Deck.createDeck();

// initialize node server
const server = http.createServer((req, res) => {
    let cards = Deck.getCards();
    let score = Deck.getScore();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    cards.forEach(card =>
        res.write(JSON.stringify(card) + '\n')
    );
    res.write("\ntop-scoring poker hand: " + JSON.stringify(score));
    res.end();
});

server.listen(config.port, config.hostname, () => {
    console.log(`Deck of Cards Server Running: http://${config.hostname}:${config.port}/`);
});