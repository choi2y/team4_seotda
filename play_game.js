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

// 플레이어 및 AI 정보
let playerCount = 4;
let playerGameInfo = [];
let deck = [];
const user = { nickname: "player", point: 1000 };

// 카드 덱 초기화 및 섞기
function initializeDeck() {
    deck = [...cards];
    deck.sort(() => Math.random() - 0.5);
}

// 카드 분배
function dealCards() {
    return deck.pop();
}

// AI 생성
function createAI() {
    let aiPlayers = [];
    for (let i = 1; i < playerCount; i++) {
        aiPlayers.push({
            nickname: `AI Player ${i}`,
            point: 1000,
            cards: [],
            pairs: "",
            bettingType: ""
        });
    }
    return aiPlayers;
}

// 플레이어 정보 초기화
function initializePlayers() {
    playerGameInfo = [{
        nickname: user.nickname,
        point: user.point,
        cards: [],
        pairs: "",
        bettingType: ""
    }, ...createAI()];
}

// 게임 시작
function startGame() {
    initializeDeck();
    initializePlayers();
    
    // 첫 번째 카드 분배
    for (let player of playerGameInfo) {
        player.cards.push(dealCards());
    }
    
    // 배팅 진행
    console.log("첫 번째 배팅 진행...");

    // 두 번째 카드 분배
    for (let player of playerGameInfo) {
        if (player.bettingType !== '다이') {
            player.cards.push(dealCards());
        }
    }
    
    // 족보 판별 및 결과 확인
    console.log("족보 판별 및 게임 결과 확인...");
}

// 게임 실행
document.addEventListener("DOMContentLoaded", startGame);
