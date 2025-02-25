let selectedDifficulty = null;
let selectedAiCount = null;

function selectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    document.getElementById("selected-difficulty").innerText = "선택된 난이도: " + difficulty;
}

function selectAiCount(aiCount) {
    selectedAiCount = aiCount;
    document.getElementById("selected-ai").innerText = "선택된 AI 수: " + aiCount + "명";
}

function startGame() {
    if (!selectedDifficulty) {
        alert("게임 난이도를 선택하세요.");
        return;
    }
    if (!selectedAiCount) {
        alert("AI 플레이어 수를 선택하세요.");
        return;
    }

    // localStorage에 선택한 설정 저장
    localStorage.setItem("difficulty", selectedDifficulty);
    localStorage.setItem("aiCount", selectedAiCount);

    // 게임 실행 페이지로 이동
    window.location.href = "play_game.html";
}
