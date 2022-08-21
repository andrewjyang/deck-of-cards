const fetch = require('node-fetch');
const config = require('./config.js');

class DeckOfCards {
    constructor(cards = [], hand = "") {
        this.cards = cards;
        this.hand = hand;
    }

    /**
     * createDeck() creates a standard deck of 52 cards by using the deck of cards api
     * @return resolved async call with the deck id {String}
     */
    createDeck = async () => {
        return await fetch(config.deck.NEW_DECK_URL)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("error: issue creating new deck");
                }
            })
            .then(async (response) => {
                let deck = response;
                return deck['deck_id'].trim();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    /**
     * shuffleDeck() shuffles the deck of 52 cards by using the deck of cards api
     * @param {String} deckID the deck's id retrieved when creating the deck
     * @return resolved async call with the deck shuffled {Boolean}
     */
    shuffleDeck = async (deckID) => {
        return await fetch(config.deck.SHUFFLE_DECK_URL.replace(/<<deck_id>>/, deckID))
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("error: issue shuffling deck");
                }
            })
            .then((response) => {
                let deck = response;
                return deck['shuffled'];
            })
            .catch((error) => {
                console.log(error);
            });
    }

    /**
     * drawCards() draws cards from the deck of 52 cards by using the deck of cards api
     * @param {String} deckID the deck's id retrieved when creating the deck
     * @param {Number} count the number of cards to be drawn
     * @return resolved async call with an array of card codes {Array}
     */
    drawCards = async (deckID, count) => {
        return await fetch(config.deck.DRAW_CARD_URL.replace(/<<deck_id>>/, deckID) + count)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("error: issue drawing card");
                }
            })
            .then((response) => {
                let cards = response.cards || [];
                let codes = [];
                cards.forEach((card, index) => {
                    this.setCards({
                        value: card['value'].toLowerCase(),
                        suit: card['suit'].toLowerCase()
                    });
                    codes.push(card['code']);
                });
                return codes;
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
     * getBestHand() determines the top-scoring poker hand
     * @param {Array} hand the Array of Strings of each card's code
     */
    getBestHand = (hand) => {
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
        let flush = suits.every(suit => suits[0] === suit);

        // hand is a straight if the index equals every card's value - the first card's value OR if the card values are a wheel (ie. ace to 5)
        const wheel = [14, 2, 3, 4, 5];
        let straight = values.every((value, index) => value - values[0] === index || this.isEqual(values, wheel.sort(this.ascending)));

        // hand is n of a kind if there are n duplicate values
        // note: https://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript#answer-19395302
        const counts = {};
        values.forEach(value => counts[value] = (counts[value] || 0) + 1);
        let ofAKind = (n) => Object.values(counts).includes(n);

        // determine the top scoring poker hand
        let straightFlush = straight && flush;
        let fourOfAKind = ofAKind(4);
        let fullHouse = ofAKind(3) && ofAKind(2);
        let threeOfAKind = ofAKind(3);
        let twoPair = Object.values(counts).filter(count => count === 2).length === 2;
        let onePair = ofAKind(2);
        let bestHand = straightFlush ? "straight flush"
            : fourOfAKind ? "four of a kind"
                : fullHouse ? "full house"
                    : flush ? "flush"
                        : straight ? "straight"
                            : threeOfAKind ? "three of a kind"
                                : twoPair ? "two pairs"
                                    : onePair ? "one pair"
                                        : "high card";
        this.setHand(bestHand);
    }

    /**
     * play()
     *  1. creates and shuffles a deck of cards
     *  2. draws 5 cards from the hand and prints their numbers and suits to the console
     *  3. identifies the top-scoring poker hand
     */
    play = async () => {
        try {
            const deckID = await this.createDeck();
            const shuffled = await this.shuffleDeck(deckID);
            const hand = await this.drawCards(deckID, 5);
            this.getBestHand(hand);
            const cards = this.displayCards();
            const bestHand = this.displayBestHand();

            console.log("created deck  | id:", deckID);
            console.log("shuffled deck | shuffled:", shuffled);
            console.log(cards);
            console.log(bestHand);
        } catch(error) {
            console.log("ERROR: There was an issue playing Deck of Cards", error);
        }
    }

    /**
     * getCards() gets the cards drawn
     * @return {Object} cards the cards drawn
     */
    getCards = () => {
        return this.cards;
    }

    /**
     * setCards() sets the cards drawn
     * @param {Object} card the card drawn
     */
    setCards = (card) => {
        this.cards.push(card);
    }

    /**
     * getHand() gets the top-scoring poker hand
     * @return {String} the top-scoring poker hand
     */
    getHand = () => {
        return this.hand;
    }

    /**
     * setHand() sets the top-scoring poker hand
     * @param {String} hand the top-scoring poker hand
     */
    setHand = (hand) => {
        this.hand = hand;
    }

    /**
     * displayCards() displays the cards drawn
     * @return {String} the cards drawn
     */
    displayCards = () => {
        let drawn = [];
        this.cards.forEach((card, index) => {
            drawn.push("card " + (index + 1) + " : " + card['value'] + ' of ' + card['suit']);
        })
        return drawn.join("\n");
    }

    /**
     * displayBestHand() displays the best hand
     * @return {String} the top scoring poker hand
     */
    displayBestHand = () => {
        return ("top-scoring poker hand: " + this.hand);
    }
}

module.exports = DeckOfCards;