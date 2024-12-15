'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    const validation = solver.validate(puzzle);
    if (validation.error) return res.json(validation);

    if (!/^[A-I][1-9]$/.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    const row = coordinate[0].toUpperCase().charCodeAt(0) - 65;
    const column = parseInt(coordinate[1]) - 1;

    if (row < 0 || row > 8 || column < 0 || column > 8) {
      return res.json({ error: 'Invalid coordinate' });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    const currentVal = puzzle[row * 9 + column];
    if (currentVal === value) {
      return res.json({ valid: true });
    }

    const conflicts = [];
    if (!solver.checkRowPlacement(puzzle, row, column, value)) conflicts.push('row');
    if (!solver.checkColPlacement(puzzle, row, column, value)) conflicts.push('column');
    if (!solver.checkRegionPlacement(puzzle, row, column, value)) conflicts.push('region');

    if (conflicts.length) {
      return res.json({ valid: false, conflict: conflicts });
    }

    return res.json({ valid: true });
  });

  app.route('/api/solve').post((req, res) => {
  const { puzzle } = req.body;

  if (!puzzle) {
    return res.json({ error: 'Required field missing' });
  }

  const result = solver.solve(puzzle);
  return res.json(result);
});

};
