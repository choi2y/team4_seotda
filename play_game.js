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

let playerCount = parseInt(localStorage.getItem("aiCount")) + 1 || 4; // 플레이어 포함
let deck = [];
let playerCards = [];
let aiCards = [];

function initializeDeck() {
    deck = [...cards];
    deck.sort(() => Math.random() - 0.5); // 카드 섞기
}

function createAIUI() {
    const opponentsContainer = document.querySelector(".allOpponents");
    opponentsContainer.innerHTML = ""; // 기존 AI UI 초기화

    for (let i = 1; i < playerCount; i++) {
        const aiPlayer = document.createElement("div");
        aiPlayer.classList.add("player");
        aiPlayer.innerHTML = `
            <p>플레이어 ${i}</p>
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
    let num1 = cards[0].num;
    let num2 = cards[1].num;

    // 광땡 판별
    if ((num1 === 3 && num2 === 8) || (num1 === 1 && num2 === 8) || (num1 === 1 && num2 === 3)) {
        return `${num1}${num2}광땡`;
    }

    // 숫자 땡 판별
    if (num1 === num2) return `${num1}땡`;

    // 기타 끗수 계산
    let sum = (num1 + num2) % 10;
    return sum === 0 ? "망통" : `${sum}끗`;
}


function determineWinner() {
    let playerJokbo = getJokbo(playerCards);
    let aiJokbos = aiCards.map(getJokbo);

    let allHands = [{ name: "플레이어", jokbo: playerJokbo }];
    aiJokbos.forEach((jokbo, index) => {
        allHands.push({ name: `AI ${index + 1}`, jokbo });
    });

    let rankedHands = allHands.sort((a, b) => compareJokbo(b.jokbo, a.jokbo));

    let topRankJokbo = rankedHands[0].jokbo; // 가장 높은 족보
    let winners = rankedHands.filter(hand => hand.jokbo === topRankJokbo); // 같은 족보를 가진 플레이어들

    let isWin = false;

    if (winners.length > 1) {
        document.getElementById("game-result").innerText = ` 무승부! (${topRankJokbo})`;
    } else {
        const winner = winners[0];
        document.getElementById("game-result").innerText = ` 승자: ${winner.name} (${topRankJokbo})`;

        if (winner.name === "플레이어") {
            isWin = true;
        }
    }

    document.getElementById("game-result").style.display = "block";

    // AI들의 패 공개
    for (let i = 1; i < playerCount; i++) {
        document.getElementById(`ai-card-${i}-1`).src = aiCards[i - 1][0].img;
        document.getElementById(`ai-card-${i}-2`).src = aiCards[i - 1][1].img;
    }

    //  승패 기록 업데이트
    const storedUser = localStorage.getItem("loggedUser");
    if (storedUser) {
        const user = JSON.parse(storedUser);
        updateUserRecord(user.user_id, isWin);
    } else {
        console.error(" 로그인된 사용자가 없습니다.");
    }
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
    aiTurn();
}

function aiTurn() {
    setTimeout(() => {
        alert("AI가 배팅을 진행합니다.");
        determineWinner();
    }, 1000);
}

function startGame() {
    createAIUI(); // AI UI 생성
    initializeDeck();
    dealCards();
    updateUI();

    // 게임 시작 시 결과창 강제 숨김 (초기화)
    document.getElementById("game-result").style.display = "none";
    document.getElementById("game-result").innerText = "";  // 이전 승패 결과 제거

}


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



