const fetch = require('node-fetch');
const config = require('./config.js');

module.exports = class DeckOfCards {
    constructor() {
        this.cards = [];
        this.score = "";
    }

    /**
     * createDeck() creates a standard deck of 52 cards by using the deck of cards api
     */
    createDeck = async () => {
        await fetch(config.deck.NEW_DECK_URL)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("error: issue creating new deck");
                }
            })
            .then(async (response) => {
                let deck = response;
                let deckID = deck['deck_id'].trim();
                console.log("created deck  | id:", deckID);
                await this.shuffleDeck(deckID);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    /**
     * shuffleDeck() shuffles the deck of 52 cards by using the deck of cards api
     * @param {String} deckID the deck's id retrieved when creating the deck
     */
    shuffleDeck = async (deckID) => {
        await fetch(config.deck.SHUFFLE_DECK_URL.replace(/<<deck_id>>/, deckID))
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("error: issue shuffling deck");
                }
            })
            .then((response) => {
                let deck = response;
                let shuffled = deck['shuffled'];
                console.log("shuffled deck | shuffled:", shuffled);
                this.drawCards(deckID, 5);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    /**
     * drawCards() draws cards from the deck of 52 cards by using the deck of cards api
     * @param {String} deckID the deck's id retrieved when creating the deck
     * @param {Number} count the number of cards to be drawn
     */
    drawCards = async (deckID, count) => {
        await fetch(config.deck.DRAW_CARD_URL.replace(/<<deck_id>>/, deckID) + count)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("error: issue drawing card");
                }
            })
            .then((response) => {
                let cards = response.cards || [];
                let hand = [];
                let codes = [];
                cards.forEach((card, index) => {
                    let value = card['value'].toLowerCase();
                    let suit = card['suit'].toLowerCase();
                    let cardStr = "card " + (index + 1) + " : " + value + " of " + suit;
                    console.log(cardStr);
                    hand.push(cardStr);
                    codes.push(card['code']);
                });
                this.setCards(hand);
                this.getTopScoringHand(codes);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    /**
     * ascending() serves as the compareFunction for Array.prototype.sort() that sorts an array in ascending order
     * @param {Number} a the first compare value
     * @param {Number} b the second compare value
     * @return a negative value, resulting in a sort in ascending order
     */
    ascending = (a, b) => a - b;

    /**
     * isEqual() determines if two arrays are equal
     * @param {Array} a the first array
     * @param {Array} b the second array
     * @return True if the arrays are equal
     */
    isEqual = (a, b) => a.every((value, index) => value === b[index]);

    /**
     * getTopScoringHand() determines the top-scoring poker hand
     * @param {Array} hand the Array of Strings of each card's code
     * @return {String} score the top-scoring poker hand
     */
    getTopScoringHand = (hand) => {
        let values = [];
        let suits = [];
        const order = {
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9,
            '0': 10,
            'j': 11,
            'q': 12,
            'k': 13,
            'a': 14
        };

        // separate hand into values and suits
        hand.forEach((card) => {
            values.push(card[0].toLowerCase());
            suits.push(card[1].toLowerCase());
        });

        // sort the values in ascending order and the suits alphabetically
        values = values.map(a => order[a]).sort(this.ascending);
        suits = suits.sort();

        // hand is a flush if every card is the same suit
        const flush = suits.every(suit => suits[0] === suit);

        // hand is a straight if the index equals every card's value - the first card's value OR if the card values are a wheel (ie. ace to 5)
        const wheel = [14, 2, 3, 4, 5];
        const straight = values.every((value, index) => value - values[0] === index || this.isEqual(values, wheel.sort(this.ascending)));

        // hand is n of a kind if there are n duplicate values
        // note: https://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript#answer-19395302
        const counts = {};
        values.forEach(value => counts[value] = (counts[value] || 0) + 1);
        const ofAKind = (n) => Object.values(counts).includes(n);

        // determine the top scoring poker hand
        const straightFlush = straight && flush;
        const fourOfAKind = ofAKind(4);
        const fullHouse = ofAKind(3) && ofAKind(2);
        const threeOfAKind = ofAKind(3);
        const twoPair = Object.values(counts).filter(count => count === 2).length === 2;
        const onePair = ofAKind(2);

        let score = straightFlush ? "straight flush"
            : fourOfAKind ? "four of a kind"
                : fullHouse ? "full house"
                    : flush ? "flush"
                        : straight ? "straight"
                            : threeOfAKind ? "three of a kind"
                                : twoPair ? "two pairs"
                                    : onePair ? "one pair"
                                        : "high card";

        console.log("top-scoring poker hand:", score);
        this.setScore(score);
        return score;
    }

    /**
     * getCards() gets the cards drawn
     * @return {Array} cards the cards drawn
     */
    getCards = () => {
        return this.cards;
    }

    /**
     * setCards() sets the cards drawn
     * @param {Array} cards the cards drawn
     */
    setCards = (cards) => {
        this.cards = cards;
    }

    /**
     * getScore() gets the top-scoring poker hand
     * @return {String} the top-scoring poker hand
     */
    getScore = () => {
        return this.score;
    }

    /**
     * setScore() sets the top-scoring poker hand
     * @param {String} score the top-scoring poker hand
     */
    setScore = (score) => {
        this.score = score;
    }
}