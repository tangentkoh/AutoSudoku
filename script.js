const grid = document.getElementById("sudoku-grid");
const generateBtn = document.getElementById("generate-btn");
const sizeRadios = document.querySelectorAll('input[name="size"]');

let size = 16; // 初期値を16に設定
let blockSize = 4;

const generateSudoku = () => {
  // ユーザーの選択に基づいてサイズを更新
  size = parseInt(document.querySelector('input[name="size"]:checked').value);

  // ブロックサイズを動的に決定
  if (size === 4) {
    blockSize = 2;
  } else if (size === 9) {
    blockSize = 3;
  } else if (size === 16) {
    blockSize = 4;
  }

  // HTMLのスタイルを切り替える
  grid.className = `grid-${size}x${size}`;
  const cellSize = size === 4 ? 50 : size === 9 ? 40 : 25;
  grid.style.width = size * cellSize + "px";
  grid.style.height = size * cellSize + "px";

  let board = Array.from({ length: size }, () => Array(size).fill(0));

  // バックトラッキングで完成した数独を生成
  solveSudoku(board);

  // 難易度に合わせて数字を削除
  const cellsToRemovePerBlock = size === 4 ? 2 : size === 9 ? 5 : 8;
  const puzzle = removeNumbersPerBlock(board, cellsToRemovePerBlock);

  // HTMLに盤面を描画
  renderSudoku(puzzle);
  // 描画後にボーダーを適用
  applyBorders();
};

// バックトラッキング関数（汎用化）
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

// ルールチェック関数（汎用化）
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

// ブロックごとに数字を削除する関数
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

// HTMLに盤面を描画する関数
const renderSudoku = (board) => {
  grid.innerHTML = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (board[row][col] !== 0) {
        cell.textContent = board[row][col];
      }
      grid.appendChild(cell);
    }
  }
};

// 太線を適用する関数
const applyBorders = () => {
  const cells = grid.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
    cell.classList.remove("border-right", "border-bottom");

    const row = Math.floor(index / size);
    const col = index % size;

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

// ページの読み込み時とボタンクリック時に新しい問題を生成
document.addEventListener("DOMContentLoaded", generateSudoku);
generateBtn.addEventListener("click", generateSudoku);
sizeRadios.forEach((radio) => {
  radio.addEventListener("change", generateSudoku);
});
