let db;
const DB_FILE_URL = "sample-db.sqlite";  // 초기 DB 파일

// SQLite 환경 초기화
async function initDatabase() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    });

    try {
        const response = await fetch(DB_FILE_URL);
        if (!response.ok) throw new Error("DB 파일을 찾을 수 없습니다.");

        const data = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(data));
        console.log("✅ DB 파일에서 초기화 완료!");
    } catch (error) {
        console.warn("⚠️ DB 파일이 없어 새 데이터베이스를 생성합니다.");
        db = new SQL.Database();

        // 테이블 생성
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                game_money INTEGER NOT NULL DEFAULT 50000000,
                win_count INTEGER NOT NULL DEFAULT 0,
                lose_count INTEGER NOT NULL DEFAULT 0
            );
        `);

        // 기본 사용자 추가
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", ["admin", "1234"]);
    }
}

// 로그인 처리
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            login();
        });
    }

    const user_id = sessionStorage.getItem("user_id");
    if (user_id && window.location.pathname.includes("mypage.html")) {
        loadUserProfile(user_id);
    }
});

// 로그인 함수
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const stmt = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
    stmt.bind([username, password]);

    if (stmt.step()) {
        const user = stmt.getAsObject();
        sessionStorage.setItem("user_id", user.user_id);
        window.location.href = "mypage.html";
    } else {
        document.getElementById("loginResult").innerText =
            "아이디 또는 비밀번호가 일치하지 않습니다.";
    }
}

// 마이페이지에서 사용자 정보 불러오기
function loadUserProfile(user_id) {
    const stmt = db.prepare("SELECT * FROM users WHERE user_id = ?");
    stmt.bind([user_id]);

    if (stmt.step()) {
        const user = stmt.getAsObject();
        document.getElementById("user_id").innerText = user.user_id;
        document.getElementById("username").innerText = user.username;
        document.getElementById("game_money").innerText = user.game_money;
        document.getElementById("win_count").innerText = user.win_count;
        document.getElementById("lose_count").innerText = user.lose_count;
    }
}

// 로그아웃 기능
function logout() {
    sessionStorage.removeItem("user_id");
    window.location.href = "index.html";
}

// DB 초기화 실행
window.onload = initDatabase;
