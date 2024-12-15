const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
  suiteSetup(() => {
    solver = new Solver();
  });

  test('Logic handles a valid puzzle string of 81 characters', () => {
    const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3..8..6.....5..2.91.43...7.9..6.1.3.';
    const result = solver.validate(validPuzzle);
    assert.isTrue(result.valid);
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8X2.3674.3..8..6.....5..2.91.43...7.9..6.1.3.';
    const result = solver.validate(invalidPuzzle);
    assert.propertyVal(result, 'error', 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const shortPuzzle = '1.5..2.84..63.12.7.';
    const result = solver.validate(shortPuzzle);
    assert.propertyVal(result, 'error', 'Expected puzzle to be 81 characters long');
  });

  test('Logic handles a valid row placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 0, '7'));
  });

  test('Logic handles an invalid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3..8..6.....5..2.91.43...7.9..6.1.3.';
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 1, '1'));
  });

  test('Logic handles a valid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3..8..6.....5..2.91.43...7.9..6.1.3.';
    assert.isTrue(solver.checkColPlacement(puzzle, 0, 1, '3'));
  });

  test('Logic handles an invalid column placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.isFalse(solver.checkColPlacement(puzzle, 1, 2, '9'));
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3..8..6.....5..2.91.43...7.9..6.1.3.';
    assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 1, '3'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3..8..6.....5..2.91.43...7.9..6.1.3.';
    assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 1, '5'));
  });

  test('Valid puzzle strings pass the solver', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const result = solver.solve(puzzle);
    assert.isObject(result);
    assert.property(result, 'solution');
  });

  test('Invalid puzzle strings fail the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8X2.3674.3..8..6.....5..2.91.43...7.9..6.1.3.';
    const result = solver.solve(puzzle);
    assert.propertyVal(result, 'error', 'Invalid characters in puzzle');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const expectedSolution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
    const result = solver.solve(puzzle);
    assert.propertyVal(result, 'solution', expectedSolution);
  });
});
