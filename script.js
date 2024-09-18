const boardSize = 10;  // Размер поля
const mineCount = 10;  // Количество мин

let board;
let revealedCount;
let gameEnded = false;

const gameBoard = document.getElementById("game-board");
const restartButton = document.getElementById("restart");

// Генерация игрового поля
function generateBoard() {
    board = [];
    revealedCount = 0;
    gameEnded = false;
    gameBoard.innerHTML = "";

    // Создание пустого поля
    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            const cell = {
                revealed: false,
                mine: false,
                adjacentMines: 0,
                element: createCellElement(i, j)
            };
            row.push(cell);
            gameBoard.appendChild(cell.element);
        }
        board.push(row);
    }

    // Расстановка мин
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const x = Math.floor(Math.random() * boardSize);
        const y = Math.floor(Math.random() * boardSize);
        if (!board[x][y].mine) {
            board[x][y].mine = true;
            minesPlaced++;
        }
    }

    // Вычисление количества мин рядом с каждой клеткой
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            board[i][j].adjacentMines = countAdjacentMines(i, j);
        }
    }
}

// Создание HTML элемента клетки
function createCellElement(x, y) {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.addEventListener("click", () => revealCell(x, y));
    return cellElement;
}

// Подсчёт мин рядом с клеткой
function countAdjacentMines(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nx = x + i;
            const ny = y + j;
            if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize) {
                if (board[nx][ny].mine) {
                    count++;
                }
            }
        }
    }
    return count;
}

// Открытие клетки
function revealCell(x, y) {
    if (gameEnded || board[x][y].revealed) return;

    const cell = board[x][y];
    cell.revealed = true;
    revealedCount++;

    cell.element.classList.add("revealed");
    if (cell.mine) {
        cell.element.classList.add("mine");
        endGame(false);
    } else if (cell.adjacentMines > 0) {
        cell.element.textContent = cell.adjacentMines;
    } else {
        revealAdjacentCells(x, y);
    }

    if (revealedCount === boardSize * boardSize - mineCount) {
        endGame(true);
    }
}

// Открытие соседних клеток, если нет мин
function revealAdjacentCells(x, y) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nx = x + i;
            const ny = y + j;
            if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize) {
                if (!board[nx][ny].revealed && !board[nx][ny].mine) {
                    revealCell(nx, ny);
                }
            }
        }
    }
}

// Завершение игры
function endGame(win) {
    gameEnded = true;
    alert(win ? "Поздравляем, вы победили!" : "Вы проиграли!");
}

// Перезапуск игры
restartButton.addEventListener("click", generateBoard);

// Запуск игры при загрузке страницы
generateBoard();