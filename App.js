const http = require('http');
const config = require('./config.js');
const DeckOfCards = require('./DeckOfCards.js');

// instantiate class to start program...
const Deck = new DeckOfCards();
Deck.play();

// initialize node server
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write(Deck.displayCards());
    res.write('\n');
    res.write(Deck.displayBestHand());
    res.end();
});

server.listen(config.port, config.hostname, () => {
    console.log(`Deck of Cards Server Running: http://${config.hostname}:${config.port}/`);
});