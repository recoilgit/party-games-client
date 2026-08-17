let currentGame = null;   // 'mafia' | 'bunker'
let online = false;

function selectGame(game) {
    currentGame = game;
    document.getElementById("game-title").textContent =
        game === "mafia" ? "Мафия" : "Бункер";
}

function startLocal() {
    if (!currentGame) {
        alert("Сначала выбери игру");
        return;
    }
    online = false;
    showGameScreen();
    startGameLocal(currentGame);
}

function showGameScreen() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
}

function log(msg) {
    const logDiv = document.getElementById("log");
    logDiv.innerHTML += msg + "<br>";
    logDiv.scrollTop = logDiv.scrollHeight;
}

/* эти функции вызывают net.js */
function createLobby() {
    if (!currentGame) {
        alert("Сначала выбери игру");
        return;
    }
    createLobbyNet(currentGame);
}

function joinLobby() {
    if (!currentGame) {
        alert("Сначала выбери игру");
        return;
    }
    const code = document.getElementById("joinCode").value.trim();
    if (!code) return;
    joinLobbyNet(currentGame, code);
}

/* колбэки из net.js */
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
