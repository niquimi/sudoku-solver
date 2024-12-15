class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) {
      return { error: 'Required field missing' };
    }
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (/[^1-9.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    for (let i = 0; i < 9; i++) {
      if (i === column) continue;
      if (puzzleString[start + i] === value) {
        return false;
      }
    }
    return true;
  }
  

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (i !== row && puzzleString[column + i * 9] === value) {
        return false;
      }
    }
    return true;
  }
  

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleString[(regionRow + i) * 9 + regionCol + j] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validateResult = this.validate(puzzleString);
    if (validateResult.error) return validateResult;
  
    const solveRecursive = (board) => {
      const emptyIndex = board.indexOf('.');
      if (emptyIndex === -1) return board;
  
      const row = Math.floor(emptyIndex / 9);
      const col = emptyIndex % 9;
  
      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (
          this.checkRowPlacement(board, row, col, value) &&
          this.checkColPlacement(board, row, col, value) &&
          this.checkRegionPlacement(board, row, col, value)
        ) {
          const newBoard = board.slice(0, emptyIndex) + value + board.slice(emptyIndex + 1);
          const solved = solveRecursive(newBoard);
          if (solved) return solved;
        }
      }
  
      return null;
    };
  
    const solution = solveRecursive(puzzleString);
    if (!solution) return { error: 'Puzzle cannot be solved' };
    return { solution };
  }
  
  
}

module.exports = SudokuSolver;