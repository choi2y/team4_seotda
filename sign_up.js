let db;  // 데이터베이스 객체
const DB_FILE_URL = "sample-db.sqlite";  // 초기화할 DB 파일 경로

// SQLite 환경 초기화
async function initDatabase() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    });

    // 특정 DB 파일이 존재하면 불러오기
    try {
        const response = await fetch(DB_FILE_URL);
        if (!response.ok) throw new Error("DB 파일을 찾을 수 없습니다.");

        const data = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(data));
        console.log("✅ DB 파일에서 초기화 완료!");
    } catch (error) {
        console.warn("⚠️ DB 파일이 없어 새 데이터베이스를 생성합니다.");
        db = new SQL.Database();

        // 새 테이블 생성
        db.run(`
        CREATE TABLE users (
        user_id TEXT PRIMARY KEY, -- 아이디 (SQLite에서는 VARCHAR 대신 TEXT 사용)
        username TEXT NOT NULL UNIQUE, -- 닉네임
        password TEXT NOT NULL, -- 비밀번호
        game_money INTEGER NOT NULL DEFAULT 50000000 -- 신규 가입 시 기본 5천만원
        );

        CREATE TABLE user_settings (
        user_id TEXT PRIMARY KEY,
        volume INTEGER NOT NULL DEFAULT 50,  -- 기본 볼륨 값 (예: 0~100 범위)
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE);

        CREATE TABLE game_log (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT DEFAULT NULL,
        start_money INTEGER NOT NULL,
        final_money INTEGER DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE);
    `);
    }
    displayUsers();
}

// 회원 추가
document.getElementById("sign_up_form").addEventListener("submit", (event) => {
    event.preventDefault();
    const user_id = document.getElementById("user_id").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // user_id 중복 체크 (prepared statement 사용)
    const stmt = db.prepare("SELECT * FROM users WHERE user_id = ?");
    stmt.bind([user_id]);
    if (stmt.step()) {
        alert("중복된 ID입니다. 다른 ID를 사용해 주세요.");
        stmt.free();
        return;
    }

    // 중복이 없으면 회원 추가
    db.run("INSERT INTO users (user_id, username, password,game_money) VALUES (?, ?, ?,50000000)", [user_id, username, password]);
    displayUsers();
    document.getElementById("sign_up_form").reset();
});

// 회원 목록 표시
function displayUsers() {
    const result = db.exec("SELECT * FROM users");
    const tableBody = document.querySelector("#userTable tbody");
    tableBody.innerHTML = "";

    if (result.length > 0) {
        const rows = result[0].values;
        rows.forEach(row => {
            const [user_id, username,password] = row;
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td><input type="text" value="${user_id}" id="user_id-${user_id}"></td>
                <td><input type="text" value="${username}" id="username-${user_id}"></td>
                <td><input type="text" value="${password}" id="password-${user_id}"></td>
                <td><button onclick="updateUser(${user_id})">수정</button></td>
                <td><button onclick="deleteUser(${user_id})">삭제</button></td>
            `;

            tableBody.appendChild(tr);
        });
    }
}

// 회원 정보 수정
function updateUser(user_id) {
    const newID = document.getElementById(`user_id-${user_id}`).value;
    const newName = document.getElementById(`username-${user_id}`).value;
    const newPassword = document.getElementById(`password-${user_id}`).value;

    db.run("UPDATE users SET user_id = ?, username = ?, password = ? WHERE user_id = ?", [newID, newName, newPassword, user_id]);
    displayUsers();
}

// 회원 삭제
function deleteUser(user_id) {
    if (confirm("정말 삭제하시겠습니까?")) {
        db.run("DELETE FROM users WHERE user_id = ?", [user_id]);
        displayUsers();
    }
}

// 데이터베이스 파일 저장
function saveDatabase() {
    const data = db.export();
    const blob = new Blob([data], { type: "application/octet-stream" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "database.sqlite";
    link.click();
    alert("데이터베이스가 저장되었습니다.");
}
const dbSaveBtn = document.getElementById('saveDB')
dbSaveBtn?.addEventListener('click', saveDatabase)

// 데이터베이스 파일 불러오기
async function loadDatabase(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` });
        db = new SQL.Database(data);

        alert("데이터베이스가 불러와졌습니다.");
        displayUsers();
    };
    reader.readAsArrayBuffer(file);
}

const dbLoadBtn = document.getElementById('loadDB')
dbLoadBtn?.addEventListener('change', loadDatabase)

// 페이지 로딩 시 DB 초기화
window.onload = initDatabase;

//
