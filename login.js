// 로그인 폼 제출 이벤트 핸들러
document.getElementById("login-form")?.addEventListener("submit", function(event) {
    event.preventDefault();

    const user_id = document.getElementById("user_id").value;
    const password = document.getElementById("password").value;

    // 입력받은 아이디와 비밀번호로 사용자 조회
    const stmt = db.prepare("SELECT * FROM users WHERE user_id = ? AND password = ?");
    stmt.bind([user_id, password]);

    if (stmt.step()) {
        const user = stmt.getAsObject();
        document.getElementById("loginResult").innerText =
            `로그인 성공! ${user.username} 님 환영합니다.`;
        // 로컬 스토리지에 로그인한 유저 정보를 저장 (메인 페이지에서 활용)
        localStorage.setItem("loggedUser", JSON.stringify(user));

        // 1초 후 메인 페이지로 이동
        setTimeout(() => {
            window.location.href = "select_mode.html";
        }, 1000);
    } else {
        document.getElementById("loginResult").innerText =
            "아이디 또는 비밀번호가 일치하지 않습니다.";
    }
});