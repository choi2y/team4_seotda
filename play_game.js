const cards = [
    { num: 1, name: '소나무' , img: 'img/11.jpg'}, { num: 1, name: '광', img: 'img/1.jpg'},
    { num: 2, name: '휘파람새', img: 'img/2.jpg' }, { num: 2, name: '매화꽃', img: 'img/12.jpg' },
    { num: 3, name: '광', img: 'img/3.jpg'}, { num: 3, name: '벗꽃', img: 'img/13.jpg'},
    { num: 4, name: '두견새', img: 'img/4.jpg' }, { num: 4, name: '등나무 꽃' , img: 'img/14.jpg'},
    { num: 5, name: '다리', img: 'img/15.jpg'}, { num: 5, name: '창포꽃', img: 'img/5.jpg'},
    { num: 6, name: '나비', img: 'img/6.jpg' }, { num: 6, name: '모란' , img: 'img/16.jpg'},
    { num: 7, name: '멧돼지', img: 'img/7.jpg'}, { num: 7, name: '싸리 꽃', img: 'img/17.jpg'},
    { num: 8, name: '광', img: 'img/8.jpg' }, { num: 8, name: '기러기' , img: 'img/18.jpg'},
    { num: 9, name: '술잔', img: 'img/19.jpg'}, { num: 9, name: '국화', img: 'img/9.jpg'},
    { num: 10, name: '사슴', img: 'img/10.jpg' },  { num: 10, name: '단풍' , img: 'img/20.jpg'},
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

// let playerCount = parseInt(localStorage.getItem("aiCount")) + 1; // 플레이어 포함
// let aiDifficulty = localStorage.getItem("difficulty"); // 난이도 설정
let playerCount =4;
let hands = new Array(playerCount).fill(null).map(() => []); // 플레이어들의 핸드 (카드 패)를 저장하는 배열

let aiDifficulty = 'easy';
let deck;

const user = {
    nickname: "player", // 아이디 연동
    point: 1000,  // 포인트 연동
};

// AI 난이도 설정 (배팅 방식)
function AI() {
    return aiDifficulty === 'easy' ? easyAIBetting() : mediumAIBetting();
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

// AI 배팅 방법
function easyAIBetting() {
    let random = Math.floor(Math.random() * 6)%6;

    switch (random) {
        case 0: return bettingType("다이"); break;
        case 1: return bettingType("따당"); break;
        case 2: return bettingType("콜"); break;
        case 3: return bettingType("쿼터"); break;
        case 4: return bettingType("하프"); break;
        default: return bettingType("올인"); break;
    }
}
// 수정 ///////////////////
function mediumAIBetting() {
    return bettingType();
}


function rankingCards(playerGameInfo){ // 최종 족보 순위 비교
    let ranking = [];

    for(let i = 0; i < playerCount; i++){
        const jokbo = playerGameInfo[i].pairs;  // 모든 플레이어의 족보 가져오기
        switch (jokbo) {
            case "38광땡": ranking[i] = 100; break;
            case "18광땡": ranking[i] = 41; break;
            case "13광땡": ranking[i] = 40; break;
            case "장땡": ranking[i] = 30; break;
            case "구땡": ranking[i] = 29; break;
            case "팔땡": ranking[i] = 28; break;
            case "칠땡": ranking[i] = 27; break;
            case "육땡": ranking[i] = 26; break;
            case "오땡": ranking[i] = 25; break;
            case "사땡": ranking[i] = 24; break;
            case "삼땡": ranking[i] = 23; break;
            case "이땡": ranking[i] = 22; break;
            case "삥땡": ranking[i] = 21; break;
            case "알리": ranking[i] = 20; break;
            case "독사": ranking[i] = 16; break;
            case "구삥": ranking[i] = 15; break;
            case "장삥": ranking[i] = 14; break;
            case "장사": ranking[i] = 13; break;
            case "세륙": ranking[i] = 12; break;
            case "갑오": ranking[i] = 11; break;
            case "망통": ranking[i] = 0; break;
            case "땡잡이": // 땡이 있는지 확인
                let hasTtang = playerInfo.some(p => p.pairs.endsWith("땡"));
                ranking[i] = hasTtang ? 45 : 0;
                break;
            case "구사": // 재경기 여부 확인
                let isDraw1 = playerInfo.some(p => ["알리", "독사", "구삥", "장삥", "장사", "세륙"].includes(p.pairs));
                ranking[i] = isDraw1 ? -1 : 3;
                break;
            case "멍텅구리 구사": // 특정 족보 여부 확인
                let isDraw2 = playerInfo.some(p => !["13광땡", "18광땡", "38광땡", "장땡"].includes(p.pairs));
                ranking[i] = isDraw2 ? -1 : 3;
                break;
            case "암행어사": // 특정 광땡이 있는지 확인
                let hasKwang = playerInfo.some(p => ["13광땡", "18광땡"].includes(p.pairs));
                ranking[i] = hasKwang ? 50 : 1;
                break;
            default:
                if (jokbo.endsWith("끗")) {
                    ranking[i] = parseInt(jokbo.replace("끗", ""));
                } else {
                    ranking[i] = -2; // 다이 또는 오류 발생 시
                }
                break;
        }
    }
    return ranking;
}

// 맞는 족보 찾기
function findPair(player) {
    if (player.bettingType === "다이") {
        return;
    }
    let playerCards = player.cards.map(card => [card.num, card.name]);
    for (let [jokboName, combinations] of jokboList) {
        for (let combination of combinations) {
            // 플레이어 카드와 족보 리스트의 카드가 일치하는지 확인
            if (
                playerCards.length === combination.length &&
                playerCards.every(card =>
                    combination.some(jokboCard =>
                        card[0] === jokboCard[0] && card[1] === (jokboCard[1] || card[1])
                    )
                )
            )
            {
                player.pairs = jokboName; // 족보 저장
                console.log(`${player.nickname} 족보: ${jokboName}`);
                break;
            }
        }
    }
}

// 플레이어, ai -> 이름, 포인트 배열에 저장
function playerInfo() {
    let playerGameInfo = [];
    playerGameInfo.push({
        nickname: user.nickname,
        point: user.point,
        cards: [],
        pairs: "",
        bettingType: ""
    });

    // AI 추가
    playerGameInfo = playerGameInfo.concat(createAI());

    return playerGameInfo;
}
// 카드 분배
function dealCards() {
    let randomIndex = Math.floor(Math.random() * deck.length); // 랜덤한 인덱스 선택

    return deck.splice(randomIndex, 1)[0]; // 랜덤한 카드를 제거하고 반환
}
// 첫번째 카드 분배
function dealFirstCards(playerGameInfo) {
    for (let i = 0; i < playerCount; i++) {
        let card = dealCards();
        hands[i].push(card);
        playerGameInfo[i].cards.push(card);
        console.log(`플레이어 ${i + 1}에게 첫 번째 카드 배분됨:`, card);
    }
    console.log("첫 번째 카드 배분 완료!");
}
// 두번째 카드 분배 (다이 시 카드 분배 X)
function dealSecondCards(playerGameInfo) {
    for (let i = 0; i < playerCount; i++) {
        if (playerGameInfo[i].bettingType !== '다이') {
            let card = dealCards();
            hands[i].push(card);
            playerGameInfo[i].cards.push(card);
            console.log(`플레이어 ${i + 1}에게 두 번째 카드 배분됨:`, card);
        }
    }
    console.log("두 번째 카드 배분 완료!");
}

// 게임 결과 //////////////// 수정
function gameResult() {
    // 데이터베이스에 플레이어의 승/패 결과, 포인트 저장
    if(rankingCards)
        // rankingCards 값 중 -1 있는 지 확인 -> 있으면 재경기 (다이 제외)
        // 최대값이 같은지 확인 -> 있으면 최대값이 같은 플레이어 끼리 재경기
        // 최대값이 1개면 승/패 발표 ->
        // 파산시 -> stop, 선택 -> gameStart, stop



        console.log("게임 결과 계산 중...");
}

// 배팅 타입 선택   (다이, 따당, 콜, 쿼터, 하프, 올인 선택)
function bettingType(choice) {
    switch (choice) {
        case "다이": return "fold";
        case "따당": return "double";
        case "콜": return "call";
        case "쿼터": return "quarter";
        case "하프": return "half";
        case "올인": return "all-in";
        default: return "invalid";
    }
}

// 배팅 처리 //////////////// 수정
function betting(playerGameInfo, totalPoint, bettingPoint) {
    let player = playerGameInfo;
    let nextBettingPoint = 0;

    while (true) {
        let choice = bettingType(player.bettingType); // 배팅 선택
        switch (choice) {
            case "다이":
                console.log(`${player.nickname} 다이!`);
                return 0;
            case "따당":
                nextBettingPoint = bettingPoint * 2;
                break;
            case "콜":
                nextBettingPoint = bettingPoint;
                break;
            case "쿼터":
                nextBettingPoint = totalPoint / 4;
                break;
            case "하프":
                nextBettingPoint = totalPoint / 2;
                break;
            case "올인":
                nextBettingPoint = player.point;
                break;
        }

        // 배팅 금액이 이전 배팅 금액보다 작다면 다시 선택하도록 유도
        if (nextBettingPoint >= bettingPoint) {
            player.point -= nextBettingPoint;
            return nextBettingPoint;
        }
    }
}

// 게임 시작
function gameStart() {
    let totalBettingPoint = 0; // 총 배팅 포인트 초기화
    let bettingPoint = 100; // 배팅 초기화
    deck = [...cards]; // 덱 초기화

    let playerGameInfo = playerInfo();
    console.log("플레이어 및 AI 정보 초기화 완료", playerGameInfo);

    // 첫번째 카드 분배
    dealFirstCards(playerGameInfo);
    console.log("첫 번째 카드 분배 완료", playerGameInfo);

    // 첫번째 배팅
    for(let i = 0; i < playerCount; i++) {
        if(i===0) {
            betting(registerBettingButtons(), playerGameInfo);
            registerBettingButtons();
        }
        // 컴퓨터가 난이도에 따라서 해당 easyAI(), mediumAI() 배팅방식
        playerGameInfo[i].bettingType = AI();
    }

    // 두번째 카드 분배 (다이 시 카드 분배 X)
    dealSecondCards(playerGameInfo);
    console.log("두 번째 카드 분배 완료", playerGameInfo);
    // 두번째 배팅
    if(playerGameInfo[0].bettingType!=='다이') { // 다이가 아니라면 배팅 실행
        betting(registerBettingButtons());
    }
    for(let i = 0; i < playerCount; i++) {
        findPair(playerGameInfo[i]); // 족보 찾기
    }
    rankingCards(); // 족보 순위 찾기
    // 결과 오픈 (다이 시 오픈 X, 재경기, 승패) -> 새 게임, 파산으로 강제 종료, 그만하기
    gameResult();
}

// 배팅 버튼 이벤트 리스너 등록
function registerBettingButtons(callback) {
    console.log("배팅 버튼 대기 중...");
    const bettingButtons = document.querySelectorAll(".betting-btn");

    bettingButtons.forEach(button => {
        button.addEventListener("click", function onClick(event) {
            const choice = event.target.getAttribute("data-choice");
            console.log(`선택한 배팅 옵션: ${choice}`);

            bettingType(choice); // 배팅 실행

            // **한 번만 실행되도록 리스너 제거**
            bettingButtons.forEach(btn => btn.removeEventListener("click", onClick));

            // 배팅이 끝난 후 콜백 실행 (다음 단계 진행)
            callback();
        });
    });
}

// 게임 시작 버튼 이벤트 리스너 등록
document.addEventListener("DOMContentLoaded", () => {
    const gameStartBtn = document.getElementById("gameStartBtn");

    if (gameStartBtn) {
        gameStartBtn.addEventListener("click", () => {
            console.log("게임 시작!"); // 디버깅용
            gameStart(); // 버튼 클릭 시 게임 시작 함수 실행
        });
    }
});