let currentGame = null;   // 'mafia' | 'bunker'
let online = false;

function selectGame(game) {
    currentGame = game;
    document.getElementById("game-title").textContent =
        game === "mafia" ? "Мафия" : "Бункер";
    setRulesText(game);
}

function startLocal() {
    if (!currentGame) return alert("Сначала выбери игру");
    online = false;
    showGameScreen();
    startGameLocal(currentGame);
}

function createLobby() {
    if (!currentGame) return alert("Сначала выбери игру");
    createLobbyNet(currentGame);
}

function joinLobby() {
    if (!currentGame) return alert("Сначала выбери игру");
    const code = document.getElementById("joinCode").value.trim();
    if (!code) return;
    joinLobbyNet(currentGame, code);
}

function showGameScreen() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
}

function backToMenu() {
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
    document.getElementById("log").innerHTML = "";
    document.getElementById("game-area").innerHTML = "";
    document.getElementById("room-code").textContent = "";
}

function log(msg) {
    const logDiv = document.getElementById("log");
    logDiv.innerHTML += msg + "<br>";
    logDiv.scrollTop = logDiv.scrollHeight;
}

/* колбэки сети */
function onLobbyCreated(code) {
    online = true;
    document.getElementById("room-code").textContent = "Комната: " + code;
    showGameScreen();
    startGameOnline(currentGame);
}

function onLobbyJoined(code) {
    online = true;
    document.getElementById("room-code").textContent = "Комната: " + code;
    showGameScreen();
    startGameOnline(currentGame);
}

function onGameMessage(game, payload) {
    if (game === "mafia") handleMafiaNet(payload);
    if (game === "bunker") handleBunkerNet(payload);
}

/* правила */
function openRules() {
    if (!currentGame) {
        document.getElementById("rules-title").textContent = "Правила";
        document.getElementById("rules-text").innerHTML =
            "Выбери игру, чтобы увидеть её правила.";
    }
    document.getElementById("rules-modal").classList.remove("hidden");
}
function closeRules() {
    document.getElementById("rules-modal").classList.add("hidden");
}
function setRulesText(game) {
    const title = document.getElementById("rules-title");
    const text = document.getElementById("rules-text");
    if (game === "mafia") {
        title.textContent = "Мафия — правила";
        text.innerHTML = `
            <div class="card">
                <b>Цель:</b> Мирные жители должны вычислить и казнить мафию. Мафия — убить мирных.
            </div>
            <div class="card">
                <b>Роли:</b> Мафия, Доктор, Детектив, Мирные. Роли выдаются случайно.
            </div>
            <div class="card">
                <b>Ночь:</b> Мафия выбирает жертву, Доктор лечит, Детектив проверяет.
            </div>
            <div class="card">
                <b>День:</b> Обсуждение, голосование, казнь подозреваемого.
            </div>
        `;
    } else if (game === "bunker") {
        title.textContent = "Бункер — правила";
        text.innerHTML = `
            <div class="card">
                <b>Цель:</b> Выжить в бункере. Группа решает, кто достоин остаться.
            </div>
            <div class="card">
                <b>Карточки:</b> Профессия, здоровье, возраст, багаж, хобби и т.д.
            </div>
            <div class="card">
                <b>Раунды:</b> Игроки раскрывают свои характеристики, обсуждают и голосуют.
            </div>
        `;
    }
}
