// 게임 설정 불러오기
let selectedDifficulty = localStorage.getItem("difficulty");
let selectedAiCount = parseInt(localStorage.getItem("aiCount")) || 3; // 기본 AI 3명

// 게임 변수
let playerCards = [];
let aiCards = [];
let deck = [];

// 카드 목록 (1~10: 동물/광, 11~20: 띠/국진)
const cards = [
    { num: 1, type: "광", img: "img/1.jpg" }, { num: 1, type: "띠", img: "img/11.jpg" },
    { num: 2, type: "동물", img: "img/2.jpg" }, { num: 2, type: "띠", img: "img/12.jpg" },
    { num: 3, type: "광", img: "img/3.jpg" }, { num: 3, type: "띠", img: "img/13.jpg" },
    { num: 4, type: "동물", img: "img/4.jpg" }, { num: 4, type: "띠", img: "img/14.jpg" },
    { num: 5, type: "난초", img: "img/5.jpg" }, { num: 5, type: "띠", img: "img/15.jpg" },
    { num: 6, type: "동물", img: "img/6.jpg" }, { num: 6, type: "띠", img: "img/16.jpg" },
    { num: 7, type: "동물", img: "img/7.jpg" }, { num: 7, type: "띠", img: "img/17.jpg" },
    { num: 8, type: "광", img: "img/8.jpg" }, { num: 8, type: "동물", img: "img/18.jpg" },
    { num: 9, type: "띠", img: "img/9.jpg" }, { num: 9, type: "국진", img: "img/19.jpg" },
    { num: 10, type: "동물", img: "img/10.jpg" }, { num: 10, type: "띠", img: "img/20.jpg" }
];

// 족보 정의
const jokboList = new Map([
    ["38광땡", [[3, "광"], [8, "광"]]], ["18광땡", [[1, "광"], [8, "광"]]], ["13광땡", [[1, "광"], [3, "광"]]],
    ["장땡", [[10, null], [10, null]]], ["구땡", [[9, null], [9, null]]], ["팔땡", [[8, null], [8, null]]],
    ["칠땡", [[7, null], [7, null]]], ["육땡", [[6, null], [6, null]]], ["오땡", [[5, null], [5, null]]],
    ["사땡", [[4, null], [4, null]]], ["삼땡", [[3, null], [3, null]]], ["이땡", [[2, null], [2, null]]], ["삥땡", [[1, null], [1, null]]],
    ["알리", [[1, null], [2, null]]], ["독사", [[1, null], [4, null]]], ["구삥", [[1, null], [9, null]]],
    ["장삥", [[1, null], [10, null]]], ["장사", [[4, null], [10, null]]], ["세륙", [[4, null], [6, null]]]
]);

// 카드 덱 초기화
function initializeDeck() {
    deck = [...cards];
}

// 카드 섞기
function shuffleDeck() {
    deck.sort(() => Math.random() - 0.5);
}

// 카드 분배
function dealCards() {
    playerCards = [deck.pop(), deck.pop()];
    aiCards = [];
    for (let i = 0; i < selectedAiCount; i++) {
        aiCards.push([deck.pop(), deck.pop()]);
    }
}

// UI 업데이트 (플레이어 & AI 카드 표시)
function updateUI() {
    document.getElementById("my-card-1").src = playerCards[0].img;
    document.getElementById("my-card-2").src = playerCards[1].img;
}

// ** 승패 판별 함수 **
function determineWinner() {
    let playerJokbo = getJokbo(playerCards);
    let aiJokbos = aiCards.map(getJokbo);

    let allHands = [{ name: "플레이어", jokbo: playerJokbo }];
    aiJokbos.forEach((jokbo, index) => {
        allHands.push({ name: `AI ${index + 1}`, jokbo });
    });

    // 족보 점수 매기기
    let rankedHands = allHands.sort((a, b) => compareJokbo(b.jokbo, a.jokbo));
    let winner = rankedHands[0];

    alert(`🎉 승자: ${winner.name} (${winner.jokbo})`);
}

// 족보 계산
function getJokbo(cards) {
    for (let [name, condition] of jokboList) {
        if (condition.some(rule =>
            rule.every((c, i) => c[0] === cards[i].num && (c[1] === null || c[1] === cards[i].type))
        )) {
            return name;
        }
    }
    return `${(cards[0].num + cards[1].num) % 10}끗`;
}

// 족보 비교
function compareJokbo(jokboA, jokboB) {
    const order = Array.from(jokboList.keys()).reverse();
    return order.indexOf(jokboA) - order.indexOf(jokboB);
}

// 베팅 로직
function playerBet(action) {
    alert(`플레이어가 '${action}'을 선택했습니다.`);
    aiTurn();
}

// AI 베팅 로직
function aiTurn() {
    setTimeout(() => {
        alert("AI가 배팅을 진행합니다.");
        determineWinner();
    }, 1000);
}

// 게임 시작
function startGame() {
    initializeDeck();
    shuffleDeck();
    dealCards();
    updateUI();
}

// 게임 재시작
function restartGame() {
    localStorage.clear();
    location.reload();
}

// 규칙 표시
function showRules() {
    document.getElementById("rules-modal").style.display = "block";
}

// 규칙 닫기
function closeRules() {
    document.getElementById("rules-modal").style.display = "none";
}

// DOM이 로드된 후 실행
document.addEventListener("DOMContentLoaded", startGame);
