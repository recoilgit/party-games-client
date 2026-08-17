let bunkerState = {
    cards: null
};

function startBunkerLocal() {
    const area = document.getElementById("game-area");
    area.innerHTML = "";

    const input = document.createElement("textarea");
    input.placeholder = "Введи имена игроков по одному в строке";
    input.style.width = "100%";
    input.rows = 5;

    const btn = document.createElement("button");
    btn.textContent = "Раздать карточки";
    btn.onclick = () => {
        const players = input.value.split("\n").filter(x => x.trim());
        renderBunkerLocalCards(players);
    };

    area.appendChild(input);
    area.appendChild(btn);
}

function renderBunkerLocalCards(players) {
    const area = document.getElementById("game-area");
    area.innerHTML = "";

    players.forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        const attrs = genBunkerAttributes();
        card.innerHTML = `<b>${name}</b><br>
            Профессия: ${attrs.prof}<br>
            Здоровье: ${attrs.health}<br>
            Возраст: ${attrs.age}<br>
            Багаж: ${attrs.baggage}<br>
            Хобби: ${attrs.hobby}`;
        area.appendChild(card);
    });
}

function startBunkerOnline() {
    const area = document.getElementById("game-area");
    area.innerHTML = "";

    const info = document.createElement("div");
    info.className = "card";
    info.textContent = "Ожидаем выдачи карточек от сервера...";
    area.appendChild(info);
}

function handleBunkerNet(payload) {
    if (payload.action === "cards") {
        bunkerState.cards = payload.cards;
        const area = document.getElementById("game-area");
        area.innerHTML = "";

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <b>Твои характеристики:</b><br>
            Профессия: ${payload.cards.prof}<br>
            Здоровье: ${payload.cards.health}<br>
            Возраст: ${payload.cards.age}<br>
            Багаж: ${payload.cards.baggage}<br>
            Хобби: ${payload.cards.hobby}
        `;
        area.appendChild(card);

        log("Карточки выданы.");
    }
}

/* генератор атрибутов — можно менять под себя */
function genBunkerAttributes() {
    const profs = ["Врач","Инженер","Учитель","Фермер","Военный","Программист"];
    const health = ["Идеальное","Хроническое заболевание","Инвалидность","Среднее"];
    const ages = ["18","25","35","45","60"];
    const baggage = ["Аптечка","Инструменты","Еда на месяц","Оружие","Книги"];
    const hobbies = ["Спорт","Музыка","Рисование","Рыбалка","Психология"];

    return {
        prof: randomFrom(profs),
        health: randomFrom(health),
        age: randomFrom(ages),
        baggage: randomFrom(baggage),
        hobby: randomFrom(hobbies)
    };
}

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
