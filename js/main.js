// -----------------------------
// クイズページ用
// -----------------------------
// クイズの答えを判定する
function judge() {
  // エレメントを取得する
  const questionElem = document.getElementById('question');
  const rightElem = document.getElementById('right');
  const wrongElem = document.getElementById('wrong');
  const answerElem = document.getElementById('answer');
  const commentElem = document.getElementById('comment');

  // 初期化（ユーザが再回答した場合）
  rightElem.classList.remove('hidden');
  wrongElem.classList.remove('hidden');

  // ユーザの回答を取得
  const yourChoice = questionElem.choice.value;
  // ユーザの 3 の選択肢（正解）を選んだ場合
  if (yourChoice === '2') {
    wrongElem.classList.add('hidden');
  } else {
    rightElem.classList.add('hidden');
  }
  // 解答と解説を表示する
  answerElem.classList.remove('hidden');
  commentElem.classList.remove('hidden');
}

// -----------------------------
// タイルページ用
// -----------------------------
const images = [
  'images/tile-none.png',
  'images/tile-marisa.png',
  'images/tile-reimu.png',
];

// タイル並べ用
document.addEventListener('DOMContentLoaded', function() {
  const tiles = document.getElementsByClassName('tile');
  for (let i = 0; i < tiles.length; i++) {
    if (!tiles[i].classList.contains('fixed')) {
      tiles[i].addEventListener('click', function() {
        const nextImageNumber = (Number(tiles[i].dataset.imageNumber) + 1) % images.length;
        tiles[i].dataset.imageNumber = nextImageNumber;
        tiles[i].src = images[nextImageNumber];
      });
    }
  }
});

// タイルの並びを判定する
function judgeTiles() {
  const rowCount = 4;
  const tiles = document.getElementsByClassName('tile');
  const answerElem = document.getElementById('answer');
  const rightElem = document.getElementById('right');
  const wrongElem = document.getElementById('wrong');
  if (!hasNone(tiles)) {
    const rowTiles = divide2Rows(tiles, rowCount);
    const colTiles = divide2Cols(tiles, rowCount);
    let rowResult = judgeRowsOrCols(rowTiles);
    let colResult = judgeRowsOrCols(colTiles);
    answerElem.classList.remove('hidden');
    // 再実行時用
    wrongElem.classList.remove('hidden');
    rightElem.classList.remove('hidden');
    if (rowResult && colResult) {
      wrongElem.classList.add('hidden');
    } else {
      rightElem.classList.add('hidden');
    }
  }
}

// タイルを初期化する
function initializeTiles() {
  const tiles = document.getElementsByClassName('tile');
  const answerElem = document.getElementById('answer');
  for (let i = 0; i < tiles.length; i++) {
    if (!tiles[i].classList.contains('fixed')) {
      tiles[i].dataset.imageNumber = '0';
      tiles[i].src = images[0];
    }
  }
  answerElem.classList.add('hidden');
}

// めくられていないタイルが存在するか
function hasNone(tiles) {
  for (let i = 0; i < tiles.length; i++) {
    let imageNumber = Number(tiles[i].dataset.imageNumber);
    if (imageNumber === 0) {
      return true;
    }
  }
  return false;
}

// 全行または全列を判定する
function judgeRowsOrCols(dividedTiles) {
  let result = true;
  for (let i = 0; i < dividedTiles.length; i++) {
    result = judgeRowOrColTiles(dividedTiles[i]);
    if (!result) {
      break;
    }
  }
  return result;
}

// 1 列または 1 行のタイルを判定する
// 空白タイルはないという前提
function judgeRowOrColTiles(rowOrColTiles) {
  const rightCount = rowOrColTiles.length / 2;
  let marisaCount = 0;
  let reimuCount = 0;
  for (let i = 0; i < rowOrColTiles.length; i++) {
    switch(Number(rowOrColTiles[i].dataset.imageNumber)) {
      case 1:
        marisaCount++;
        break;
      default:
        reimuCount++;
        break;
    }
    if (rightCount < marisaCount || rightCount < reimuCount) {
      return false;
    }
  }
  return true;
}

// 行に分割
function divide2Rows(tiles, rowCount) {
  const rows = new Array(rowCount);
  // 各要素を初期化する
  for (let i = 0; i < rowCount; i++) {
    rows[i] = new Array(rowCount);
  }
  for (let i = 0; i < tiles.length / rowCount; i++) {
    for (let j = 0; j < rowCount; j++) {
      rows[i][j] = tiles[i * rowCount + j];
    }
  }
  return rows;
}

// 列に分割
function divide2Cols(tiles, colCount) {
  const cols = new Array(colCount);
  // 各要素を初期化する
  for (let i = 0; i < colCount; i++) {
    cols[i] = new Array(colCount);
  }
  for (let i = 0; i < tiles.length; i++) {
    cols[i % colCount][Math.floor(i / colCount)] = tiles[i];
  }
  return cols;
}
