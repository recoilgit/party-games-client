let mafiaPlayers = [];

function startGameLocal(game) {
    if (game === "mafia") startMafiaLocal();
    if (game === "bunker") startBunkerLocal();
}

function startGameOnline(game) {
    if (game === "mafia") startMafiaOnline();
    if (game === "bunker") startBunkerOnline();
}

/* ЛОКАЛЬНАЯ МАФИЯ: один экран, ведущий управляет */
function startMafiaLocal() {
    const area = document.getElementById("game-area");
    area.innerHTML = "";

    mafiaPlayers = ["Игрок 1", "Игрок 2", "Игрок 3", "Игрок 4"];

    const list = document.createElement("ul");
    mafiaPlayers.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p;
        list.appendChild(li);
    });

    const btnRoles = document.createElement("button");
    btnRoles.textContent = "Раздать роли";
    btnRoles.onclick = () => {
        log("Роли разданы (упрощённо)");
    };

    area.appendChild(list);
    area.appendChild(btnRoles);
}

/* ОНЛАЙН МАФИЯ: каждый игрок видит свою роль */
function startMafiaOnline() {
    const area = document.getElementById("game-area");
    area.innerHTML = "";

    const btnReady = document.createElement("button");
    btnReady.textContent = "Я готов";
    btnReady.onclick = () => {
        sendGameMessage("mafia", {action: "ready"});
    };

    area.appendChild(btnReady);
}

function handleMafiaNet(payload) {
    if (payload.action === "role") {
        const area = document.getElementById("game-area");
        area.innerHTML = "";
        const roleDiv = document.createElement("div");
        roleDiv.textContent = "Твоя роль: " + payload.role;
        area.appendChild(roleDiv);
        log("Получена роль: " + payload.role);
    }
}
