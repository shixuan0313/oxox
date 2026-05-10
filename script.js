const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const startBtn = document.getElementById('start-btn');

let currentPlayer = "X"; // 玩家永遠是 X
let gameState = ["", "", "", "", "", "", "", "", ""]; // 記錄棋盤狀態
let gameActive = false; // 遊戲是否進行中

// 贏球的組合 (索引編號)
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// 啟動/重啟遊戲
startBtn.addEventListener('click', () => {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerText = "輪到你了 (X)";
    cells.forEach(cell => cell.innerText = "");
});

// 處理玩家點擊
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');

        // 如果格子是空的且遊戲還在進行，才允許下棋
        if (gameState[index] === "" && gameActive && currentPlayer === "X") {
            handleCellPlayed(cell, index);
            checkResult();
            
            // 如果玩家下完沒贏也沒平手，換電腦下
            if (gameActive) {
                statusDisplay.innerText = "電腦思考中...";
                setTimeout(computerTurn, 500); 
            }
        }
    });
});

function handleCellPlayed(cell, index) {
    gameState[index] = currentPlayer;
    cell.innerText = currentPlayer;
}

function computerTurn() {
    // 找出所有還空著的格子
    let available = gameState.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    
    if (available.length > 0) {
        let randomIndex = available[Math.floor(Math.random() * available.length)];
        let cell = document.querySelector(`[data-index="${randomIndex}"]`);
        
        currentPlayer = "O";
        handleCellPlayed(cell, randomIndex);
        checkResult();
        
        if (gameActive) {
            currentPlayer = "X";
            statusDisplay.innerText = "輪到你了 (X)";
        }
    }
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "") continue;
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerText = `贏家是 ${currentPlayer}！`;
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusDisplay.innerText = "平手！";
        gameActive = false;
    }
}