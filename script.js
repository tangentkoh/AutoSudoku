const grid = document.getElementById("sudoku-grid");
const generateBtn = document.getElementById("generate-btn");
const solveBtn = document.getElementById("solve-btn");
const sizeRadios = document.querySelectorAll('input[name="size"]');
const difficultySelect = document.getElementById("difficulty");

let size = 16;
let blockSize = 4;
let solutionBoard = [];

const generateSudoku = () => {
  size = parseInt(document.querySelector('input[name="size"]:checked').value);
  const difficulty = difficultySelect.value;
  let cellsToRemovePerBlock;

  // ブロックサイズと削除する数字の数を動的に決定
  if (size === 4) {
    blockSize = 2;
    if (difficulty === "easy") cellsToRemovePerBlock = 1;
    else if (difficulty === "normal") cellsToRemovePerBlock = 2;
    else cellsToRemovePerBlock = 3;
  } else if (size === 9) {
    blockSize = 3;
    if (difficulty === "easy") cellsToRemovePerBlock = 2;
    else if (difficulty === "normal") cellsToRemovePerBlock = 4;
    else cellsToRemovePerBlock = 6;
  } else if (size === 16) {
    blockSize = 4;
    if (difficulty === "easy") cellsToRemovePerBlock = 5;
    else if (difficulty === "normal") cellsToRemovePerBlock = 8;
    else cellsToRemovePerBlock = 11;
  }

  // HTMLのスタイルを切り替える
  grid.className = `grid-${size}x${size}`;

  let board = Array.from({ length: size }, () => Array(size).fill(0));

  // バックトラッキングで完成した数独を生成
  solveSudoku(board);
  // 解答を保存
  solutionBoard = board.map((row) => [...row]);

  // 難易度に合わせて数字を削除
  const puzzle = removeNumbersPerBlock(board, cellsToRemovePerBlock);

  // HTMLに盤面を描画
  renderSudoku(puzzle);
  // 描画後にボーダーを適用
  applyBorders();
};

const solveSudoku = (board) => {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) {
        const numbers = Array.from({ length: size }, (_, i) => i + 1).sort(
          () => Math.random() - 0.5
        );
        for (let num of numbers) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            } else {
              board[row][col] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  return true;
};

const isValid = (board, row, col, num) => {
  // 行のチェック
  for (let x = 0; x < size; x++) {
    if (board[row][x] === num) return false;
  }
  // 列のチェック
  for (let x = 0; x < size; x++) {
    if (board[x][col] === num) return false;
  }
  // ブロックのチェック
  const startRow = row - (row % blockSize);
  const startCol = col - (col % blockSize);
  for (let i = 0; i < blockSize; i++) {
    for (let j = 0; j < blockSize; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
};

const removeNumbersPerBlock = (board, count) => {
  const puzzle = board.map((row) => [...row]);

  for (let blockRow = 0; blockRow < size / blockSize; blockRow++) {
    for (let blockCol = 0; blockCol < size / blockSize; blockCol++) {
      let removedCount = 0;
      while (removedCount < count) {
        const row =
          blockRow * blockSize + Math.floor(Math.random() * blockSize);
        const col =
          blockCol * blockSize + Math.floor(Math.random() * blockSize);

        if (puzzle[row][col] !== 0) {
          puzzle[row][col] = 0;
          removedCount++;
        }
      }
    }
  }
  return puzzle;
};

const renderSudoku = (board) => {
  grid.innerHTML = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      if (board[row][col] !== 0) {
        cell.textContent = board[row][col];
      }
      grid.appendChild(cell);
    }
  }
};

const applyBorders = () => {
  const cells = grid.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
    cell.classList.remove("border-right", "border-bottom");

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // 右側の太線
    if ((col + 1) % blockSize === 0 && col < size - 1) {
      cell.classList.add("border-right");
    }
    // 下側の太線
    if ((row + 1) % blockSize === 0 && row < size - 1) {
      cell.classList.add("border-bottom");
    }
  });
};

const showSolution = () => {
  const cells = grid.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    if (cell.textContent === "") {
      cell.textContent = solutionBoard[row][col];
      cell.classList.add("solution");
    }
  });
};

// イベントリスナーの設定
document.addEventListener("DOMContentLoaded", generateSudoku);
generateBtn.addEventListener("click", generateSudoku);
solveBtn.addEventListener("click", showSolution);
sizeRadios.forEach((radio) => {
  radio.addEventListener("change", generateSudoku);
});
difficultySelect.addEventListener("change", generateSudoku);
