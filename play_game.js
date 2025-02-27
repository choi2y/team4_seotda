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
//

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

    // 족보 순서대로 정렬
    let rankedHands = allHands.sort((a, b) => compareJokbo(b.jokbo, a.jokbo));

    let topRankJokbo = rankedHands[0].jokbo; // 가장 높은 족보
    let winners = rankedHands.filter(hand => hand.jokbo === topRankJokbo); // 같은 족보를 가진 플레이어들

    if (winners.length > 1) {
        document.getElementById("game-result").innerText = `🤝 무승부 (${topRankJokbo})`;
    } else {
        document.getElementById("game-result").innerText = `🎉 승자: ${winners[0].name} (${topRankJokbo})`;
    }

    document.getElementById("game-result").style.display = "block";

    // AI들의 패 공개
    for (let i = 1; i < playerCount; i++) {
        document.getElementById(`ai-card-${i}-1`).src = aiCards[i - 1][0].img;
        document.getElementById(`ai-card-${i}-2`).src = aiCards[i - 1][1].img;
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
