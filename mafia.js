let mafiaState = {
    players: [],
    role: null,
    phase: "setup" // setup | night | day
};

function startGameLocal(game) {
    if (game === "mafia") startMafiaLocal();
    if (game === "bunker") startBunkerLocal();
}

function startGameOnline(game) {
    if (game === "mafia") startMafiaOnline();
    if (game === "bunker") startBunkerOnline();
}

/* ЛОКАЛЬНАЯ МАФИЯ: ведущий на одном устройстве */
function startMafiaLocal() {
    const area = document.getElementById("game-area");
    area.innerHTML = "";

    const input = document.createElement("textarea");
    input.placeholder = "Введи имена игроков по одному в строке";
    input.style.width = "100%";
    input.rows = 5;

    const btnRoles = document.createElement("button");
    btnRoles.textContent = "Раздать роли";
    btnRoles.onclick = () => {
        mafiaState.players = input.value.split("\n").filter(x => x.trim());
        log("Роли разданы (ведущий сам показывает карточки игрокам).");
        renderMafiaLocalRoles();
    };

    area.appendChild(input);
    area.appendChild(btnRoles);
}

function renderMafiaLocalRoles() {
    const area = document.getElementById("game-area");
    area.innerHTML = "";
    const roles = ["Мафия","Доктор","Детектив","Мирный","Мирный","Мирный"];

    mafiaState.players.forEach((name, i) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<b>${name}</b><br>Роль: ${roles[i] || "Мирный"}`;
        area.appendChild(card);
    });
}

/* ОНЛАЙН МАФИЯ: каждый видит свою роль и действия */
function startMafiaOnline() {
    const area = document.getElementById("game-area");
    area.innerHTML = "";

    const info = document.createElement("div");
    info.className = "card";
    info.textContent = "Ожидаем выдачи ролей от сервера...";
    area.appendChild(info);
}

function handleMafiaNet(payload) {
    const area = document.getElementById("game-area");

    if (payload.action === "role") {
        mafiaState.role = payload.role;
        area.innerHTML = "";

        const roleCard = document.createElement("div");
        roleCard.className = "card";
        roleCard.innerHTML = `<b>Твоя роль:</b> ${payload.role}`;
        area.appendChild(roleCard);

        mafiaState.phase = "night";
        renderMafiaActions();
        log("Получена роль: " + payload.role);
    }

    if (payload.action === "phase") {
        mafiaState.phase = payload.phase;
        renderMafiaActions();
        log("Фаза: " + payload.phase);
    }
}

function renderMafiaActions() {
    const area = document.getElementById("game-area");

    const actionsCard = document.createElement("div");
    actionsCard.className = "card";

    if (mafiaState.phase === "night") {
        actionsCard.innerHTML = "<b>Ночь.</b> Выбери действие:";
        if (mafiaState.role === "Мафия") {
            const btn = document.createElement("button");
            btn.textContent = "Выбрать жертву (условно)";
            btn.onclick = () => {
                sendGameMessage("mafia",{action:"night-move",role:"Мафия"});
                log("Ты выбрал жертву (демо).");
            };
            actionsCard.appendChild(btn);
        } else if (mafiaState.role === "Доктор") {
            const btn = document.createElement("button");
            btn.textContent = "Лечить (условно)";
            btn.onclick = () => {
                sendGameMessage("mafia",{action:"night-move",role:"Доктор"});
                log("Ты лечишь кого-то (демо).");
            };
            actionsCard.appendChild(btn);
        } else if (mafiaState.role === "Детектив") {
            const btn = document.createElement("button");
            btn.textContent = "Проверить (условно)";
            btn.onclick = () => {
                sendGameMessage("mafia",{action:"night-move",role:"Детектив"});
                log("Ты проверяешь кого-то (демо).");
            };
            actionsCard.appendChild(btn);
        } else {
            actionsCard.innerHTML += "<br>Мирный спит.";
        }
    }

    if (mafiaState.phase === "day") {
        actionsCard.innerHTML = "<b>День.</b> Обсуждение и голосование (демо).";
        const btn = document.createElement("button");
        btn.textContent = "Проголосовать против случайного";
        btn.onclick = () => {
            sendGameMessage("mafia",{action:"vote"});
            log("Ты проголосовал (демо).");
        };
        actionsCard.appendChild(btn);
    }

    area.appendChild(actionsCard);
}
