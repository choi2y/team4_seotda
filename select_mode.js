let selectedDifficulty = null;
let selectedAiCount = null;

// 난이도 선택
function selectDifficulty(difficulty, element) {
    selectedDifficulty = difficulty;
    document.getElementById("selected-difficulty").innerText =  difficulty;

    // 기존 선택된 버튼 스타일 제거 후 새 버튼에 추가
    document.querySelectorAll(".button-container button").forEach(btn => btn.classList.remove("selected"));
    element.classList.add("selected");
}
//

// AI 플레이어 수 선택
function selectAiCount(aiCount, element) {
    selectedAiCount = aiCount;
    document.getElementById("selected-ai").innerText = aiCount + "명";

    document.querySelectorAll(".button-container button").forEach(btn => btn.classList.remove("selected"));
    element.classList.add("selected");
}

// 게임 시작
function startGame() {
    if (!selectedDifficulty) {
        alert("게임 난이도를 선택하세요.");
        return;
    }
    if (!selectedAiCount) {
        alert("AI 플레이어 수를 선택하세요.");
        return;
    }

    localStorage.setItem("difficulty", selectedDifficulty);
    localStorage.setItem("aiCount", selectedAiCount);
    window.location.href = "play_game.html";
}
