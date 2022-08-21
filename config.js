const config = {
    hostname: '127.0.0.1',
    port: 8080,
    deck: {
        NEW_DECK_URL: 'http://deckofcardsapi.com/api/deck/new/',
        SHUFFLE_DECK_URL: 'http://deckofcardsapi.com/api/deck/<<deck_id>>/shuffle/',
        DRAW_CARD_URL: 'http://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count='
    }
};

module.exports = config;