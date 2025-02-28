const cards = [
    { num: 1, name: '소나무', img: 'img/11.jpg' }, { num: 1, name: '광', img: 'img/1.jpg' },
    { num: 2, name: '휘파람새', img: 'img/2.jpg' }, { num: 2, name: '매화꽃', img: 'img/12.jpg' },
    { num: 3, name: '광', img: 'img/3.jpg' }, { num: 3, name: '벗꽃', img: 'img/13.jpg' },
    { num: 4, name: '두견새', img: 'img/4.jpg' }, { num: 4, name: '등나무 꽃', img: 'img/14.jpg' },
    { num: 5, name: '다리', img: 'img/5.jpg' }, { num: 5, name: '창포꽃', img: 'img/15.jpg' },
    { num: 6, name: '나비', img: 'img/6.jpg' }, { num: 6, name: '모란', img: 'img/16.jpg' },
    { num: 7, name: '멧돼지', img: 'img/7.jpg' }, { num: 7, name: '싸리 꽃', img: 'img/17.jpg' },
    { num: 8, name: '광', img: 'img/8.jpg' }, { num: 8, name: '기러기', img: 'img/18.jpg' },
    { num: 9, name: '술잔', img: 'img/9.jpg' }, { num: 9, name: '국화', img: 'img/19.jpg' },
    { num: 10, name: '사슴', img: 'img/10.jpg' }, { num: 10, name: '단풍', img: 'img/20.jpg' }
];
// AI 난이도 설정 불러오기 (localStorage에서 값 가져오기)
let aiDifficulty = localStorage.getItem("difficulty") || "easy"; // 기본값 "easy"
let playerCount = parseInt(localStorage.getItem("aiCount")) + 1 || 4; // 플레이어 포함
let deck = [];
let playerCards = [];
let aiCards = [];

let playerPoint = 50000000; // 플레이어의 초기 포인트
let aiPoints = [];//ai포인트

let bettingPoint = 10000; // 기본 배팅 금액
let totalBettingPoint = 0; // 총 배팅 금액
let playerBettingPoint = 0; // 플레이어가 배팅한 금액


function initializeDeck() {
    deck = [...cards];
    deck.sort(() => Math.random() - 0.5); // 카드 섞기
}

function initializePoints() {
    initPlayerPoint(); // 플레이어 포인트 불러오기

    const savedAIPoints = localStorage.getItem("aiPoints");
    if (savedAIPoints) {
        aiPoints = JSON.parse(savedAIPoints);
    } else {
        aiPoints = Array(playerCount - 1).fill(50000000);
    }

    createAIUI(); // AI UI를 먼저 생성한 후 포인트 업데이트

    document.getElementById("player-point").innerText = `포인트: ${formatMoney(playerPoint)}`;
    for (let i = 1; i < playerCount; i++) {
        const aiPointElement = document.getElementById(`ai-point-${i}`);
        if (aiPointElement) {
            aiPointElement.innerText = `포인트: ${formatMoney(aiPoints[i - 1])}`;
        } else {
            console.warn(`⚠️ AI ${i}의 포인트 UI를 찾을 수 없습니다.`);
        }
    }
}




function createAIUI() {
    const opponentsContainer = document.querySelector(".allOpponents");
    opponentsContainer.innerHTML = ""; // 기존 AI UI 초기화

    for (let i = 1; i < playerCount; i++) {
        const aiPlayer = document.createElement("div");
        aiPlayer.classList.add("player");
        aiPlayer.innerHTML = `
            <p>플레이어 ${i}</p>
            <p id="ai-point-${i}" class="ai-money">포인트: ${formatMoney(aiPoints[i - 1])}</p> 
            <img class="card back" id="ai-card-${i}-1" src="img/0.jpg">
            <img class="card back" id="ai-card-${i}-2" src="img/0.jpg">
            <p class="bettingResult" id="ai-bet-${i}">대기 중...</p>
        `;
        opponentsContainer.appendChild(aiPlayer);
    }
}



function dealCards() {
    playerCards = [deck.pop(), deck.pop()];
    aiCards = [];
    for (let i = 1; i < playerCount; i++) {
        aiCards.push([deck.pop(), deck.pop()]);
    }
}

function updateUI() {
    document.getElementById("my-card-1").src = playerCards[0].img;
    document.getElementById("my-card-2").src = playerCards[1].img;

    for (let i = 1; i < playerCount; i++) {
        document.getElementById(`ai-card-${i}-1`).src = "img/0.jpg"; // 기본 가려진 카드
        document.getElementById(`ai-card-${i}-2`).src = "img/0.jpg";
    }
}

function getJokbo(cards) {
    let card1 = cards[0];
    let card2 = cards[1];

    let num1 = card1.num;
    let num2 = card2.num;
    let name1 = card1.name;
    let name2 = card2.name;

    // 광땡 판별 (광 패는 '광'이 들어간 카드)
    const isGwang1 = name1.includes("광");
    const isGwang2 = name2.includes("광");

    if (isGwang1 && isGwang2) {
        if ((num1 === 3 && num2 === 8) || (num1 === 8 && num2 === 3)) return "38광땡";
        if ((num1 === 1 && num2 === 8) || (num1 === 8 && num2 === 1)) return "18광땡";
        if ((num1 === 1 && num2 === 3) || (num1 === 3 && num2 === 1)) return "13광땡";
    }

    // 특수 족보 처리
    const specialHands = {
        "알리": [[1, "소나무"], [2, "휘파람새"]],
        "독사": [[1, "소나무"], [4, "두견새"]],
        "구삥": [[1, "소나무"], [9, "술잔"]],
        "장삥": [[1, "소나무"], [10, "사슴"]],
        "장사": [[4, "두견새"], [10, "사슴"]],
        "세륙": [[4, "두견새"], [6, "나비"]]
    };

    for (const [name, pair] of Object.entries(specialHands)) {
        if (
            (num1 === pair[0][0] && name1 === pair[0][1] && num2 === pair[1][0] && name2 === pair[1][1]) ||
            (num2 === pair[0][0] && name2 === pair[0][1] && num1 === pair[1][0] && name1 === pair[1][1])
        ) {
            return name;
        }
    }

    // 숫자 땡 판별
    if (num1 === num2) return `${num1}땡`;

    // 끗수 계산
    let sum = (num1 + num2) % 10;
    return sum === 0 ? "망통" : `${sum}끗`;
}


async function determineWinner() {
    let playerJokbo = getJokbo(playerCards);
    let aiJokbos = aiCards.map(getJokbo);

    let allHands = [{ name: "플레이어", jokbo: playerJokbo }];
    aiJokbos.forEach((jokbo, index) => {
        allHands.push({ name: `AI ${index + 1}`, jokbo });
    });

    let rankedHands = allHands.sort((a, b) => compareJokbo(b.jokbo, a.jokbo));
    let topRankJokbo = rankedHands[0].jokbo;
    let winners = rankedHands.filter(hand => hand.jokbo === topRankJokbo);

    let isWin = false;
    let resultMessage = "";

    // 로그인한 사용자 정보 가져오기
    let user_id = sessionStorage.getItem("user_id");
    let winCount = 0, loseCount = 0;

    try {
        if (typeof db === "undefined" || !db) {
            console.warn("⚠ 데이터베이스가 초기화되지 않음. 초기화 실행...");
            await initDatabase();
        }

        const query = `SELECT win_count, lose_count FROM user_record WHERE user_id = ?;`;
        const stmt = db.prepare(query);
        stmt.bind([user_id]);

        if (stmt.step()) {
            const record = stmt.getAsObject();
            winCount = record.win_count;
            loseCount = record.lose_count;
        }
        stmt.free();
    } catch (error) {
        console.error(" 전적 조회 중 오류 발생:", error);
    }

    if (winners.length > 1) {
        resultMessage = ` 무승부! (${topRankJokbo}) 배팅 금액 반환`;
        playerPoint += playerBettingPoint;
        for (let i = 1; i < playerCount; i++) {
            aiPoints[i - 1] += bettingPoint;
        }
        console.log(" 무승부! 배팅 금액 반환");
    } else {
        const winner = winners[0];

        if (winner.name === "플레이어") {
            isWin = true;
            playerPoint += totalBettingPoint;
            winCount += 1;
            resultMessage = `승리하셨습니다.\n 승자:${winner.name} (${topRankJokbo}) \n(전적: ${winCount}승 ${loseCount}패)`;
        } else {
            const aiIndex = parseInt(winner.name.split(" ")[1]) - 1;
            aiPoints[aiIndex] += totalBettingPoint;
            loseCount += 1;
            resultMessage = `패배하셨습니다.\n 승자:${winner.name} (${topRankJokbo}) \n(전적: ${winCount}승 ${loseCount}패)`;
        }
    }

    document.getElementById("game-result").innerText = resultMessage;
    document.getElementById("game-result").style.display = "block";

    // AI들의 패 공개
    for (let i = 1; i < playerCount; i++) {
        document.getElementById(`ai-card-${i}-1`).src = aiCards[i - 1][0].img;
        document.getElementById(`ai-card-${i}-2`).src = aiCards[i - 1][1].img;
    }

    // 포인트 업데이트 UI 반영
    document.getElementById("player-point").innerText = `포인트: ${formatMoney(playerPoint)}`;
    for (let i = 1; i < playerCount; i++) {
        document.getElementById(`ai-point-${i}`).innerText = `포인트: ${formatMoney(aiPoints[i - 1])}`;
    }

    // AI 포인트 저장
    saveAIPoints();
    updatePlayerPoint();

    // ✅ 승패 기록 업데이트 실행
    console.log("✅ 승패 기록 업데이트 실행");
    updateUserRecord(user_id, isWin);

}



function compareJokbo(jokboA, jokboB) {
    const order = [
        "38광땡", "18광땡", "13광땡",  // 광땡 최우선
        "장땡", "구땡", "팔땡", "칠땡", "육땡", "오땡", "사땡", "삼땡", "이땡", "삥땡",
        "알리", "독사", "구삥", "장삥", "장사", "세륙",
        "갑오", "9끗", "8끗", "7끗", "6끗", "5끗", "4끗", "3끗", "2끗", "1끗", "망통"
    ];
    return order.indexOf(jokboB) - order.indexOf(jokboA);
}



function playerBet(action) {
    alert(`플레이어가 '${action}'을 선택했습니다.`);

    let bettingAmount = 0;
    switch (action) {
        case "콜":
            bettingAmount = bettingPoint;
            break;
        case "따당":
            bettingAmount = bettingPoint * 2;
            break;
        case "올인":
            bettingAmount = playerPoint;  // 플레이어가 가진 모든 돈을 배팅
            break;
    }

    if (bettingAmount > playerPoint) {
        alert("💰 보유 금액이 부족합니다!");
        return;
    }

    playerPoint -= bettingAmount; // 🔥 포인트 차감
    updatePlayerPoint(); // 🔥 데이터베이스 업데이트
    document.getElementById("player-point").innerText = `포인트: ${playerPoint}`; // UI 반영

    betting(action, false); // 플레이어 배팅 결과 UI에 반영
    aiTurn();
}



function aiTurn() {
    setTimeout(() => {
        alert("AI가 배팅을 진행합니다.");
        determineWinner();
    }, 1000);
}

async function startGame() {
    createAIUI(); // AI UI 생성
    initializeDeck(); // 카드 덱 초기화
    dealCards(); // 카드 분배
    updateUI(); // UI 업데이트

    await initPlayerPoint(); // 🔥 게임 시작 시 플레이어 포인트 불러오기

    // 포인트 초기화
    initializePoints(); // 🔥 플레이어와 AI 포인트 초기화

    // 게임 시작 시 결과창 강제 숨김 (초기화)
    document.getElementById("game-result").style.display = "none";
    document.getElementById("game-result").innerText = "";  // 이전 승패 결과 제거
}



//nav바 함수들
function restartGame() {
    localStorage.clear();
    location.reload();
}

function showRules() {
    document.getElementById("rules-modal").style.display = "block";
}

function closeRules() {
    document.getElementById("rules-modal").style.display = "none";
}

function goToMyPage() {
    window.location.href = "mypage.html";  // 마이페이지로 이동
}


document.addEventListener("DOMContentLoaded", startGame);

//게임 승패 기록 함수
async function updateUserRecord(user_id, isWin) {
    try {
        if (typeof db === "undefined" || !db) {
            console.warn("⚠️ 데이터베이스가 초기화되지 않았습니다. 초기화 실행...");
            await initDatabase();
        }

        // 승패 업데이트 SQL 실행
        const query = `
            UPDATE user_record
            SET win_count = win_count + ?, lose_count = lose_count + ?
            WHERE user_id = ?;
        `;
        const stmt = db.prepare(query);
        stmt.run([isWin ? 1 : 0, isWin ? 0 : 1, user_id]);
        stmt.free();

        console.log(`✅ ${user_id}의 승패 기록 업데이트 완료 (승리: ${isWin ? 1 : 0}, 패배: ${isWin ? 0 : 1})`);

        // 데이터베이스 백업 (localStorage 저장)
        saveDatabase();

        // 🎯 로컬스토리지의 승패 데이터도 즉시 반영
        const storedUser = JSON.parse(localStorage.getItem("loggedUser"));
        if (storedUser) {
            storedUser.win_count = (storedUser.win_count || 0) + (isWin ? 1 : 0);
            storedUser.lose_count = (storedUser.lose_count || 0) + (isWin ? 0 : 1);
            localStorage.setItem("loggedUser", JSON.stringify(storedUser));
        }
    } catch (error) {
        console.error("❌ 승패 기록 업데이트 중 오류 발생:", error);
    }
}

// 게임 종료 후 마이페이지로 이동
window.restartGame = function () {
    saveDatabase();  // 변경 사항 저장
    window.location.href = "mypage.html";
};



function saveDatabase() {
    if (!db) return;

    const data = db.export();
    const blob = new Blob([data], { type: "application/octet-stream" });
    const reader = new FileReader();

    reader.onload = function () {
        localStorage.setItem("savedDB", reader.result);
        console.log("✅ 데이터베이스가 로컬스토리지에 저장되었습니다.");
    };

    reader.readAsDataURL(blob);
}

async function initDatabase() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/sql-wasm.wasm`
    });

    try {
        const response = await fetch("sample-db.sqlite");
        if (!response.ok) throw new Error("데이터베이스 파일을 찾을 수 없습니다.");

        const data = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(data));
        console.log("✅ 데이터베이스가 성공적으로 로드되었습니다!");
    } catch (error) {
        console.warn("⚠️ 데이터베이스 파일이 없어 새로 생성합니다.");
        db = new SQL.Database();

        // user_record 테이블 생성 (없을 경우)
        db.run(`
            CREATE TABLE IF NOT EXISTS user_record (
                user_id TEXT PRIMARY KEY,
                win_count INTEGER NOT NULL DEFAULT 0,
                lose_count INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
        `);
        console.log("✅ 새 데이터베이스가 생성되었습니다.");
    }
}
// -------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const music = document.getElementById("BGM001");
    const muteButton = document.getElementById("muteButton");

    if (music) {
        music.volume = 0.5;
    }

    if (muteButton) {
        muteButton.addEventListener("click", toggleMute);
    } else {
        console.error("⚠️ 'muteButton' 요소를 찾을 수 없습니다.");
    }
});

function toggleMute() {
    const music = document.getElementById("BGM001");
    const muteButton = document.getElementById("muteButton");
    if (music && muteButton) {
        music.muted = !music.muted;
        muteButton.innerText = music.muted ? "🔈" : "🔊";
    } else {
        console.error("⚠️ 배경 음악 또는 버튼 요소를 찾을 수 없습니다.");
    }
}

function changeVolume(value) {
    const music = document.getElementById("BGM001");
    if (music) {
        let volume = Math.max(0, Math.min(1, value)); // 0~1 범위 제한
        music.volume = volume;
        console.log(`🎵 볼륨 조절: ${Math.round(volume * 100)}%`);
    } else {
        console.error("⚠️ 배경 음악 요소를 찾을 수 없습니다.");
    }
}


function showSettings() {
    setTimeout(() => {
        const settingsModal = document.getElementById("settings-modal");
        if (settingsModal) {
            settingsModal.style.display = "block";
        } else {
            console.error("⚠️ 설정 모달을 찾을 수 없습니다.");
        }
    }, 100);
}

function closeSettings() {
    const settingsModal = document.getElementById("settings-modal");
    if (settingsModal) {
        settingsModal.style.display = "none";
    }
}

function moveSelect() {
    window.location.href = "select_mode.html";
}

function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "login.html";
}
window.logout = logout;

//-----------------------------

// AI 배팅 액션을 화면에 표시하면서 실행하는 함수
// 배팅 함수: AI와 플레이어의 배팅을 UI에 반영
function betting(action, isAI = false, aiIndex = null) {
    let bettingAmount = 0;

    switch (action) {
        case "다이":
            bettingAmount = 0;
            break;
        case "콜":
            bettingAmount = bettingPoint;
            break;
        case "따당":
            bettingAmount = bettingPoint * 2;
            break;
        case "올인":
            bettingAmount = isAI ? 150000 : playerPoint; // AI는 15만원, 플레이어는 전부
            break;
    }

    if (!isAI) {
        playerBettingPoint = bettingAmount;
    } else {
        // AI 배팅 금액을 반영
        aiPoints[aiIndex - 1] -= bettingAmount;
    }
    totalBettingPoint += bettingAmount;

    // 💡 AI 배팅 상태 표시
    if (isAI && aiIndex !== null) {
        document.getElementById(`ai-bet-${aiIndex}`).innerText = action; // AI 배팅 표시
        // AI 포인트 UI 업데이트
        document.getElementById(`ai-point-${aiIndex}`).innerText = `포인트: ${formatMoney(aiPoints[aiIndex - 1])}`;
    } else {
        document.getElementById("player-bet").innerText = action; // 플레이어 배팅 표시
    }
}





// AI 턴 진행: AI가 배팅을 하고 화면에 반영
function aiTurn() {
    setTimeout(() => {
        for (let i = 1; i < playerCount; i++) {
            let aiAction = aiBettingType(aiDifficulty, aiCards[i - 1]); // AI 배팅 결정
            betting(aiAction, true, i); // AI 배팅 실행 및 UI 반영
        }
        determineWinner(); // 승자 결정
    }, 1000);
}

// AI 배팅 타입 설정
function aiBettingType(aiDifficulty, aiCards) {
    if (aiDifficulty === "easy") {
        return easyAIBettingType();
    } else if (aiDifficulty === "medium") {
        return mediumAIBetting(aiCards);
    } else {
        console.warn("❌ 잘못된 난이도 선택. 기본값 'easy'로 설정");
        return easyAIBettingType();
    }
}

// Easy 모드: 랜덤 배팅
function easyAIBettingType() {
    const bettingOptions = ["다이", "콜", "따당", "올인"];
    return bettingOptions[Math.floor(Math.random() * bettingOptions.length)];
}

// Medium 모드: 족보에 따라 전략적으로 배팅
function mediumAIBetting(aiCards) {
    let aiJokbo = getJokbo(aiCards);
    console.log(`🎲 AI 족보: ${aiJokbo}`);

    // 높은 족보는 공격적으로 배팅, 낮은 족보는 방어적 배팅
    if (["38광땡", "18광땡", "13광땡", "장땡", "구땡", "팔땡"].includes(aiJokbo)) {
        return "올인";
    } else if (["칠땡", "육땡", "오땡", "사땡", "삼땡", "이땡", "삥땡"].includes(aiJokbo)) {
        return Math.random() < 0.7 ? "따당" : "콜";
    } else if (["망통", "1끗", "2끗", "3끗"].includes(aiJokbo)) {
        return "다이";
    } else {
        return "콜";
    }
}
//배팅머니 결과
async function initPlayerPoint() {
    const storedUser = localStorage.getItem("loggedUser");
    if (!storedUser) {
        console.error("❌ 로그인된 사용자가 없습니다.");
        return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.user_id;

    try {
        if (typeof db === "undefined" || !db) {
            console.warn("⚠️ 데이터베이스가 초기화되지 않았습니다. 초기화 실행...");
            await initDatabase();
        }

        const query = `SELECT game_money FROM users WHERE user_id = ?;`;
        const stmt = db.prepare(query);
        stmt.bind([userId]);

        if (stmt.step()) {
            playerPoint = stmt.getAsObject().game_money;
            console.log(`✅ ${userId}의 포인트 불러오기 성공: ${playerPoint}`);
        } else {
            console.warn("⚠️ 플레이어 포인트를 찾을 수 없습니다. 기본값(50000000) 설정");
            playerPoint = 50000000; // 기본값 설정
        }
        stmt.free();

        // UI 업데이트
        document.getElementById("player-point").innerText = `포인트: ${formatMoney(playerPoint)}`;

    } catch (error) {
        console.error("❌ 플레이어 포인트 불러오기 오류:", error);
        playerPoint = 50000000; // 기본값 설정
    }
}



async function updatePlayerPoint() {
    const storedUser = localStorage.getItem("loggedUser");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const userId = user.user_id;

    try {
        if (typeof db === "undefined" || !db) {
            console.warn("⚠️ 데이터베이스가 초기화되지 않았습니다. 초기화 실행...");
            await initDatabase();
        }

        // ✅ `users` 테이블의 `game_money` 업데이트
        const query = `UPDATE users SET game_money = ? WHERE user_id = ?;`;
        const stmt = db.prepare(query);
        stmt.run([playerPoint, userId]);
        stmt.free();

        console.log(`✅ ${userId}의 포인트 업데이트 완료: ${playerPoint}`);

        // ✅ 데이터베이스 변경 사항 저장
        saveDatabase();

        // ✅ 로컬스토리지의 플레이어 정보도 업데이트
        user.game_money = playerPoint;
        localStorage.setItem("loggedUser", JSON.stringify(user));

    } catch (error) {
        console.error("❌ 플레이어 포인트 업데이트 오류:", error);
    }
}



function formatMoney(value) {
    if (value >= 100000000) {
        return (value / 100000000) + "억 원";
    } else if (value >= 10000000) {
        return (value / 10000000) + "천만 원";
    } else if (value >= 1000000) {
        return (value / 1000000) + "백만 원";
    } else if (value >= 10000) {
        return (value / 10000) + "만 원";
    } else if (value >= 1000) {
        return (value / 1000) + "천 원";
    }
    return value + " 원";
}

function saveAIPoints() {
    localStorage.setItem("aiPoints", JSON.stringify(aiPoints));  // 여러 AI 포인트를 배열로 저장
}






