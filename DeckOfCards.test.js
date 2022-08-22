const assert = require('assert');
const DeckOfCards = require('./DeckOfCards.js');

const path = require("path");
const fs = require("fs");
const dir = path.join(__dirname, './');

/**
 * getDummyData() parses and formats the dummy data of a JSON file
 * @param {String} dir dummy data's base directory
 * @param {String} fileName file's name containing mock data object
 * @return JSON object
 */
const getDummyData = (dir, fileName) => {
    let file = path.join(dir, fileName);
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
};

describe('Top Scoring Hand', () => {
    const Deck = new DeckOfCards();

    const straightFlush = getDummyData(dir, 'mock-data.json')['straight-flush'];
    it('should return straight flush', () => {
        Deck.getBestHand(straightFlush);
        assert.equal(Deck.getHand(), 'straight flush');
    });

    const fourOfAKind = getDummyData(dir, 'mock-data.json')['four-of-a-kind'];
    it('should return four of a kind', () => {
        Deck.getBestHand(fourOfAKind);
        assert.equal(Deck.getHand(), 'four of a kind');
    });

    const fullHouse = getDummyData(dir, 'mock-data.json')['full-house'];
    it('should return full house', () => {
        Deck.getBestHand(fullHouse);
        assert.equal(Deck.getHand(), 'full house');
    });

    const flush = getDummyData(dir, 'mock-data.json')['flush'];
    it('should return flush', () => {
        Deck.getBestHand(flush);
        assert.equal(Deck.getHand(), 'flush');
    });

    const straight = getDummyData(dir, 'mock-data.json')['straight'];
    it('should return straight', () => {
        Deck.getBestHand(straight);
        assert.equal(Deck.getHand(), 'straight');
    });

    const wheel = getDummyData(dir, 'mock-data.json')['wheel'];
    it('should return straight (wheel)', () => {
        Deck.getBestHand(wheel);
        assert.equal(Deck.getHand(), 'straight');
    });

    const threeOfAKind = getDummyData(dir, 'mock-data.json')['three-of-a-kind'];
    it('should return three of a kind', () => {
        Deck.getBestHand(threeOfAKind);
        assert.equal(Deck.getHand(), 'three of a kind');
    });

    const twoPairs = getDummyData(dir, 'mock-data.json')['two-pairs'];
    it('should return two pairs', () => {
        Deck.getBestHand(twoPairs);
        assert.equal(Deck.getHand(), 'two pairs');
    });

    const pair = getDummyData(dir, 'mock-data.json')['one-pair'];
    it('should return pair', () => {
        Deck.getBestHand(pair);
        assert.equal(Deck.getHand(), 'one pair');
    });

    const highCard = getDummyData(dir, 'mock-data.json')['high-card'];
    it('should return high card', () => {
        Deck.getBestHand(highCard);
        assert.equal(Deck.getHand(), 'high card');
    });
});