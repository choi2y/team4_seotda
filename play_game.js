const cards = [
    { num: 1, name: '소나무' }, { num: 1, name: '광' }, { num: 2, name: '휘파람새' }, { num: 2, name: '매화꽃' },
    { num: 3, name: '광' }, { num: 3, name: '벗꽃' }, { num: 4, name: '두견새' }, { num: 4, name: '등나무 꽃' },
    { num: 5, name: '다리' }, { num: 5, name: '창포꽃' }, { num: 6, name: '나비' }, { num: 6, name: '모란' },
    { num: 7, name: '멧돼지' }, { num: 7, name: '싸리 꽃' }, { num: 8, name: '광' }, { num: 8, name: '기러기' },
    { num: 9, name: '술잔' }, { num: 9, name: '국화' }, { num: 10, name: '사슴' },  { num: 10, name: '단풍' },
]
const jokboList = new Map([
    ["38광땡", [[3, "광"], [8, "광"]]], ["18광땡", [[1, "광"], [8, "광"]]], ["13광땡", [[1, "광"], [3, "광"]]],
    ["장땡", [[10, null], [10, null]]], ["구땡", [[9, null], [9, null]]], ["팔땡", [[8, null], [8, null]]],
    ["칠땡", [[7, null], [7, null]]], ["육땡", [[6, null], [6, null]]], ["오땡", [[5, null], [5, null]]],
    ["사땡", [[4, null], [4, null]]], ["삼땡", [[3, null], [3, null]]], ["이땡", [[2, null], [2, null]]], ["삥땡", [[1, null], [1, null]]],
    ["알리", [[1, null], [2, null]]], ["독사", [[1, null], [4, null]]], ["구삥", [[1, null], [9, null]]],
    ["장삥", [[1, null], [10, null]]], ["장사", [[4, null], [10, null]]], ["세륙", [[4, null], [6, null]]], ["망통", [[2, null], [8, null]]],
    ["갑오", [[1, null], [8, null]], [[2, null], [7, null]], [[3, null], [6, null]], [[4, null], [5, null]]],
    ["땡잡이", [[3, '광'], [7, '멧돼지']]], ["구사", [[4, null], [9, null]]], ["멍텅구리 구사", [[4, '두견새'], [9, '술잔']]],
    ["암행어사", [[4, '두견새'], [7, '멧돼지']]], ["8끗", [[1, null], [7, null]], [ [2, null], [6, null] ], [ [3, null], [5, null] ] ],
    ["7끗", [[1, null], [6, null]], [ [2, null], [5, null] ], [ [3, null], [4, null] ] ],
    ["6끗", [[1, null], [5, null]], [ [2, null], [4, null] ] ], ["5끗", [[2, null], [3, null]]],
    ["4끗", [[1, null], [3, null]], [ [5, null], [9, null] ], [ [6, null], [8, null] ] ],
    ["3끗", [[3, null], [10, null]], [ [5, null], [8, null] ], [ [6, null], [7, null] ] ],
    ["2끗", [[2, null], [10, null]], [ [3, null], [9, null] ], [ [4, null], [8, null] ], [ [5, null], [7, null] ] ],
    ["1끗", [[[1, null], [10, null]], [[2, null], [9, null]], [[3, null], [8, null]], [[5, null], [6, null]]]]
]);

const user = {
    nickname: "player", // 아이디 연동
    point: 1000,  // 포인트 연동
};

let playerCount = parseInt(document.getElementById("playerInput").value); // 플레이어 수 입력 (3~6)
let mode = parseInt(document.getElementById("modeInput").value); // 모드 입력 (2,3장 선택)
let aiDifficulty = document.getElementById("aiDifficultyInput").value; // ai 난이도 설정 (초급, 중급, 고급)


function AI() {
    if(aiDifficulty==='easy') return easyAIBetting();
    if(aiDifficulty==='normal') return normalAIBetting();
    if(aiDifficulty==='hard') return hardAIBetting();
}

let aiPlayers = [];
function createAI() { // AI 플레이어 생성
    aiPlayers = [];
    for (let i = 1; i < playerCount; i++) {
        aiPlayers.push({
            id: `AI_${i}`,
            nickname: `AI Player ${i}`,
            difficulty: AI(),
            point: 1000
        });
    }
    return aiPlayers;
}

function players() { // 플레이어 정보 (닉네임, 포인트, 카드 패)
    let playersArr = [];
    playersArr.push({
        nickname: user.nickname,
        point: user.point
    });

    let aiList = createAI();
    for (let i = 0; i < aiList.length; i++) {
        playersArr.push({
            nickname: aiList[i].nickname,
            point: aiList[i].point
        });
    }
    return playersArr;
}

// AI 배팅 방법
function easyAIBetting() {

}
function normalAIBetting() {

}
function hardAIBetting() {

}


function rankingCards(){ // 최종 족보 순위 비교
    let ranking = [];
    let jokbo = playersHands(); // 모든 플레이어의 족보 가져오기

    for(let i = 0; i < jokbo.length; i++){
        let current = jokbo[i][0];
        if (current === '38광땡') ranking[i] = 100;
        else if (current === '18광땡') ranking[i] = 41;
        else if (current === '13광땡') ranking[i] = 40;
        else if (current === '장땡') ranking[i] = 30;
        else if (current === '구땡') ranking[i] = 29;
        else if (current === '팔땡') ranking[i] = 28;
        else if (current === '칠땡') ranking[i] = 27;
        else if (current === '육땡') ranking[i] = 26;
        else if (current === '오땡') ranking[i] = 25;
        else if (current === '사땡') ranking[i] = 24;
        else if (current === '삼땡') ranking[i] = 23;
        else if (current === '이땡') ranking[i] = 22;
        else if (current === '삥땡') ranking[i] = 21;
        else if (current === '알리') ranking[i] = 20;
        else if (current === '독사') ranking[i] = 16;
        else if (current === '구삥') ranking[i] = 15;
        else if (current === '장삥') ranking[i] = 14;
        else if (current === '장사') ranking[i] = 13;
        else if (current === '세륙') ranking[i] = 12;
        else if (current === '갑오') ranking[i] = 11;
        else if (current === '망통') ranking[i] = 0;
        else if (current === '땡잡이'){
            let hasTtang = jokbo.some(hand => hand[0].endsWith('땡'));
            ranking[i] = hasTtang ? 45 : 0;
        }
        else if (current === '구사') {
            let isDraw = jokbo.some(hand =>
                ['알리', '독사', '구삥', '장삥', '장사', '세륙'].includes(hand[0])
            );
            ranking[i] = isDraw ? -2 : 3; // -2 (재경기)
        }
        else if (current === '멍텅구리 구사') {
            let isDraw = jokbo.some(hand =>
                !['13광땡', '18광땡', '38광땡', '장땡'].includes(hand[0])
            );
            ranking[i] = isDraw ? -2 : 3;
        }
        else if (current === '암행어사') {
            let hasKwang = jokbo.some(hand => (hand[0] === '13광땡' || hand[0] === '18광땡'));
            ranking[i] = hasKwang ? 50 : 1;
        }
        else if (current.endsWith('끗')) {
            ranking[i] = parseInt(current.replace('끗', ''));
        }
    }
    return ranking;
}


function resetBettingPoints(){ // 배팅 포인트 리셋
    return 100;
}

let deck;
function resetCards() { // 카드 리셋
    return [...cards];
}

function dealCards() { // 카드 분배
    if(betting()!=='다이'){
        let randomIndex = Math.floor(Math.random() * deck.length); // 랜덤한 인덱스 선택
        return deck.splice(randomIndex, 1)[0]; // 랜덤한 카드를 제거하고 반환
    }
}

let hands = new Array(playerCount).fill(null).map(() => []); // 플레이어들의 핸드 (카드 패)를 저장하는 배열

function getCard(){ // 받은 카드 hand 에 저장
    for(let i = 0; i < playerCount; i++) {
        hands[i].push(dealCards());
    }
}
function playersHands() {      // 플레이어들의 각각 카드 결과, 순서 정리
    for (let i = 0; i < playerCount; i++) {
        hands[i].sort((a, b) => a.num - b.num); // 카드 번호 기준 정렬
    }
    return hands;
}

function gameResult() { // 게임 결과
    // 데이터베이스에 승/패, 승률, 포인트 저장
    // 파산시 종료, 계속하기, 게임 종료, 재경기

}


function bettingChoose(){  // 다이, 따당, 콜, 쿼터, 하프, 올인 선택

}

function betting(playerIndex, totalPoint, bettingPoint, isAllIn, foldedPlayers) {
    let playersList = players(); // 현재 플레이어 목록 가져오기
    let player = playersList[playerIndex]; // 해당 플레이어 선택
    let choice = bettingChoose(); // 배팅 선택
    let newBettingPoint = 0;

    if (choice === '다이') {
        console.log(`${player.nickname} 다이!`);
        foldedPlayers.push(playerIndex); // 다이한 플레이어 추가
        return 0;
    } else if (choice === '따당' && bettingPoint < player.point && !isAllIn) {
        newBettingPoint = bettingPoint * 2;
    } else if (choice === '콜' && bettingPoint < player.point && !isAllIn) {
        newBettingPoint = bettingPoint;
    } else if (choice === '쿼터' && bettingPoint < player.point && totalPoint / 4 > bettingPoint && !isAllIn) {
        newBettingPoint = totalPoint / 4;
    } else if (choice === '하프' && bettingPoint < player.point && totalPoint / 2 > bettingPoint && !isAllIn) {
        newBettingPoint = totalPoint / 2;
    } else if (choice === '올인') {
        newBettingPoint = player.point;
        isAllIn = true; // 올인 상태 변경
    }
    player.point -= newBettingPoint;

    return newBettingPoint;
}

function gameStart() {
    let initialMode = mode; // mode 값 저장 (재경기 시 초기화)
    let totalBettingPoint = 0; // 전체 배팅 포인트
    let bettingPoint = resetBettingPoints(); // 배팅 초기값
    let isReplay = true; // 재경기 여부
    let isAllin = false; // 올인 여부
    let foldedPlayers = []; // 다이한 플레이어 목록

    deck = resetCards(); // 카트 리셋

    while (initialMode !== 0) {
        for (let i = 0; i < playerCount; i++) {
            if (!foldedPlayers.includes(i)) {
                getCard();
            }
        }
        for (let i = 0; i < playerCount; i++) {
            if (!foldedPlayers.includes(i)) {
                let bet = betting(i, totalBettingPoint, bettingPoint, isAllIn, foldedPlayers);
                totalBettingPoint += bet;
                bettingPoint = bet; // 다음 배팅 금액 기준 설정
            }
        }
        initialMode--;

        if (initialMode === 0) {
            gameResult();
        }
    }
}
