const assert = require('assert');
const DeckOfCards = require('./DeckOfCards.js');

const path = require("path");
const fs = require("fs");
const dir = path.join(__dirname, './mock');

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

    const straightFlush = getDummyData(dir, 'data.json')['straight-flush'];
    it('should return straight flush', () => {
        assert.equal(Deck.getTopScoringHand(straightFlush), 'straight flush');
    });

    const fourOfAKind = getDummyData(dir, 'data.json')['four-of-a-kind'];
    it('should return four of a kind', () => {
        assert.equal(Deck.getTopScoringHand(fourOfAKind), 'four of a kind');
    });

    const fullHouse = getDummyData(dir, 'data.json')['full-house'];
    it('should return full house', () => {
        assert.equal(Deck.getTopScoringHand(fullHouse), 'full house');
    });

    const flush = getDummyData(dir, 'data.json')['flush'];
    it('should return flush', () => {
        assert.equal(Deck.getTopScoringHand(flush), 'flush');
    });

    const straight = getDummyData(dir, 'data.json')['straight'];
    it('should return straight', () => {
        assert.equal(Deck.getTopScoringHand(straight), 'straight');
    });

    const wheel = getDummyData(dir, 'data.json')['wheel'];
    it('should return straight (wheel)', () => {
        assert.equal(Deck.getTopScoringHand(wheel), 'straight');
    });

    const threeOfAKind = getDummyData(dir, 'data.json')['three-of-a-kind'];
    it('should return three of a kind', () => {
        assert.equal(Deck.getTopScoringHand(threeOfAKind), 'three of a kind');
    });

    const twoPairs = getDummyData(dir, 'data.json')['two-pairs'];
    it('should return two pairs', () => {
        assert.equal(Deck.getTopScoringHand(twoPairs), 'two pairs');
    });

    const pair = getDummyData(dir, 'data.json')['one-pair'];
    it('should return pair', () => {
        assert.equal(Deck.getTopScoringHand(pair), 'one pair');
    });

    const highCard = getDummyData(dir, 'data.json')['high-card'];
    it('should return high card', () => {
        assert.equal(Deck.getTopScoringHand(highCard), 'high card');
    });
});