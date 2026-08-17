let ws = null;

function createLobbyNet(game) {
    ws = new WebSocket("wss://party-games-server-0kgn.onrender.com");
    ws.onopen = () => {
        ws.send(JSON.stringify({type: "create", game}));
    };
    setupWS();
}

function joinLobbyNet(game, code) {
    ws = new WebSocket("wss://party-games-server-0kgn.onrender.com");
    ws.onopen = () => {
        ws.send(JSON.stringify({type: "join", game, code}));
    };
    setupWS();
}

function setupWS() {
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "lobby-created") {
            onLobbyCreated(data.code);
        } else if (data.type === "lobby-joined") {
            onLobbyJoined(data.code);
        } else if (data.type === "game-msg") {
            onGameMessage(data.game, data.payload);
        }
    };
}

function sendGameMessage(game, payload) {
    if (!ws) return;
    ws.send(JSON.stringify({type: "game-msg", game, payload}));
}
