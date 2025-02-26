// 카드 목록 정의
const cards = [
    { num: 1, name: '소나무', img: "img/11.jpg" }, { num: 1, name: '광', img: "img/1.jpg" },
    { num: 2, name: '휘파람새', img: "img/2.jpg" }, { num: 2, name: '매화꽃', img: "img/12.jpg" },
    { num: 3, name: '광', img: "img/3.jpg" }, { num: 3, name: '벗꽃', img: "img/13.jpg" },
    { num: 4, name: '두견새', img: "img/4.jpg" }, { num: 4, name: '등나무 꽃', img: "img/14.jpg" },
    { num: 5, name: '다리', img: "img/5.jpg" }, { num: 5, name: '창포꽃', img: "img/15.jpg" },
    { num: 6, name: '나비', img: "img/6.jpg" }, { num: 6, name: '모란', img: "img/16.jpg" },
    { num: 7, name: '멧돼지', img: "img/7.jpg" }, { num: 7, name: '싸리 꽃', img: "img/17.jpg" },
    { num: 8, name: '광', img: "img/8.jpg" }, { num: 8, name: '기러기', img: "img/18.jpg" },
    { num: 9, name: '술잔', img: "img/19.jpg" }, { num: 9, name: '국화', img: "img/9.jpg" },
    { num: 10, name: '사슴', img: "img/10.jpg" }, { num: 10, name: '단풍', img: "img/20.jpg" }
];

// 족보 우선순위 설정
const jokboList = new Map([
    ["38광땡", [[3, "광"], [8, "광"]]], ["18광땡", [[1, "광"], [8, "광"]]], ["13광땡", [[1, "광"], [3, "광"]]],
    ["장땡", [[10, null], [10, null]]], ["구땡", [[9, null], [9, null]]], ["팔땡", [[8, null], [8, null]]],
    ["칠땡", [[7, null], [7, null]]], ["육땡", [[6, null], [6, null]]], ["오땡", [[5, null], [5, null]]],
    ["사땡", [[4, null], [4, null]]], ["삼땡", [[3, null], [3, null]]], ["이땡", [[2, null], [2, null]]], ["삥땡", [[1, null], [1, null]]],
    ["알리", [[1, null], [2, null]]], ["독사", [[1, null], [4, null]]], ["구삥", [[1, null], [9, null]]],
    ["장삥", [[1, null], [10, null]]], ["장사", [[4, null], [10, null]]], ["세륙", [[4, null], [6, null]]],
    ["갑오", [[1, null], [8, null]], [[2, null], [7, null]], [[3, null], [6, null]], [[4, null], [5, null]]]
]);

// 플레이어 및 컴퓨터 카드
let playerCards = [];
let computerCards = [];
let deck = [];

// 카드 덱 초기화 및 섞기
function initializeDeck() {
    deck = [...cards];
    deck.sort(() => Math.random() - 0.5);
}

// 카드 분배
function dealCards() {
    playerCards = [deck.pop(), deck.pop()];
    computerCards = [deck.pop(), deck.pop()];  // 컴퓨터(딜러) 카드
}

// 상대 플레이어(컴퓨터) 카드 UI 생성 (배치 자동 정렬)
function generateAiPlayers() {
    const aiContainer = document.querySelector(".allOpponents");
    aiContainer.innerHTML = ""; // 기존 AI 초기화

    aiCount = parseInt(localStorage.getItem("aiCount")) || 1; // 기본값: 1명

    for (let i = 1; i <= aiCount; i++) {
        let aiHtml = `
            <div class="player">
                <p>플레이어 ${i + 1}</p>
                <img class="card back" id="ai-card-${i}-1" src="img/0.jpg">
                <img class="card back" id="ai-card-${i}-2" src="img/0.jpg">
                <p class="bettingResult" id="ai-bet-${i}">대기 중...</p>
            </div>
        `;
        aiContainer.insertAdjacentHTML("beforeend", aiHtml);
    }
}

// 승패 판별 후 패 공개 (AI 카드도 공개)
function determineWinner() {
    let playerJokbo = getJokbo(playerCards);
    let aiJokbos = aiCards.map(getJokbo);

    let allHands = [{ name: "플레이어", jokbo: playerJokbo }];
    aiJokbos.forEach((jokbo, index) => {
        allHands.push({ name: `AI ${index + 1}`, jokbo });
    });

    let rankedHands = allHands.sort((a, b) => compareJokbo(b.jokbo, a.jokbo));
    let winner = rankedHands[0];

    document.getElementById("game-result").innerText = `🎉 승자: ${winner.name} (${winner.jokbo})`;

    // AI 카드 공개
    showComputerCards();
}

// AI 카드 공개 함수
function showComputerCards() {
    for (let i = 1; i <= aiCount; i++) {
        document.getElementById(`ai-card-${i}-1`).src = aiCards[i - 1][0].img;
        document.getElementById(`ai-card-${i}-2`).src = aiCards[i - 1][1].img;
    }
}

// 게임 시작 시 AI 플레이어 UI 동적 생성
document.addEventListener("DOMContentLoaded", function () {
    generateAiPlayers();
    startGame();
});


// UI 업데이트 (플레이어 카드 표시, 컴퓨터는 숨김)
function updateUI() {
    document.getElementById("my-card-1").src = playerCards[0].img;
    document.getElementById("my-card-2").src = playerCards[1].img;

    // 컴퓨터 카드 숨기기 (게임 종료 전까지)
    document.getElementById("ai-card-1-1").src = "img/0.jpg";
    document.getElementById("ai-card-1-2").src = "img/0.jpg";
}

// 족보 판별
function getJokbo(cards) {
    if (cards[0].num === cards[1].num) {
        return `${cards[0].num}땡`;
    }

    for (let [name, condition] of jokboList) {
        if (condition.some(rule =>
            rule.every(c => cards.some(card => card.num === c[0] && (c[1] === null || c[1] === card.name)))
        )) {
            return name;
        }
    }

    let sum = (cards[0].num + cards[1].num) % 10;
    return sum === 0 ? "망통" : `${sum}끗`;
}

// 승패 판별 후 패 공개 (AI 카드도 공개)
function determineWinner() {
    let playerJokbo = getJokbo(playerCards);
    let aiJokbos = aiCards.map(getJokbo);

    let allHands = [{ name: "플레이어", jokbo: playerJokbo }];
    aiJokbos.forEach((jokbo, index) => {
        allHands.push({ name: `AI ${index + 1}`, jokbo });
    });

    let rankedHands = allHands.sort((a, b) => compareJokbo(b.jokbo, a.jokbo));
    let winner = rankedHands[0];

    let resultElement = document.getElementById("game-result");
    resultElement.innerText = `🎉 승자: ${winner.name} (${winner.jokbo})`;
    resultElement.style.display = "block"; // 승리 문구 표시

    // 모든 AI 카드 공개
    showComputerCards();
}


// AI 카드 공개 함수 (모든 AI의 패 공개)
function showComputerCards() {
    for (let i = 0; i < aiCount; i++) {
        // AI 카드가 존재하는지 확인 후 업데이트
        let card1 = document.getElementById(`ai-card-${i + 1}-1`);
        let card2 = document.getElementById(`ai-card-${i + 1}-2`);

        if (card1 && card2) { // 카드가 존재하는 경우에만 업데이트
            card1.src = aiCards[i][0].img;
            card2.src = aiCards[i][1].img;
        }
    }
}


// 족보 비교
function compareJokbo(jokboA, jokboB) {
    const order = [
        "38광땡", "18광땡", "13광땡",
        "장땡", "구땡", "팔땡", "칠땡", "육땡", "오땡", "사땡", "삼땡", "이땡", "삥땡",
        "알리", "독사", "구삥", "장삥", "장사", "세륙",
        "갑오", "망통", "9끗", "8끗", "7끗", "6끗", "5끗", "4끗", "3끗", "2끗", "1끗"
    ];
    return order.indexOf(jokboA) - order.indexOf(jokboB);
}

// 배팅 진행 함수 (플레이어의 선택을 처리)
function playerBet(action) {
    alert(`플레이어가 '${action}'을 선택했습니다.`);

    // 배팅 후 즉시 승패 판별 (AI 없이 진행)
    determineWinner();
}


// 게임 시작
function startGame() {
    initializeDeck();
    dealCards();
    updateUI();
}

// 게임 재시작
function restartGame() {
    startGame();
}

// 게임 실행
document.addEventListener("DOMContentLoaded", startGame);
