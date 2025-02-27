document.addEventListener("DOMContentLoaded", async function () {
    try {
        // SQL.js 초기화
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/sql-wasm.wasm`
        });

        // 🎯 데이터베이스 로드 후 `db` 정의가 완료된 후 실행하도록 수정
        await loadDatabase(SQL);

        // 로그인된 사용자 정보 가져오기
        const storedUser = localStorage.getItem("loggedUser");
        if (!storedUser) {
            console.error("❌ 로그인된 사용자가 없습니다.");
            alert("로그인이 필요합니다.");
            window.location.href = "login.html";
            return;
        }

        const user = JSON.parse(storedUser);
        console.log("🔹 로그인된 사용자 ID:", user.user_id);

        // **데이터베이스 로드가 완료된 후 사용자 정보 불러오기**
        if (typeof db !== "undefined") {
            console.log("✅ 데이터베이스 로드 완료. 사용자 정보 불러오기...");
            loadUserProfile(user.user_id);
        } else {
            console.error("⚠️ 데이터베이스가 아직 초기화되지 않았습니다.");
        }

        window.start = function () {
            window.location.href = "select_mode.html";
        };

        window.logout = function () {
            localStorage.removeItem("loggedUser");
            window.location.href = "login.html";
        };
    } catch (error) {
        console.error("⚠️ 오류 발생:", error);
    }
});


// 데이터베이스 로드 함수
async function loadDatabase(SQL) {
    try {
        const savedDB = localStorage.getItem("savedDB");

        if (savedDB) {
            const response = await fetch(savedDB);
            const buffer = await response.arrayBuffer();
            db = new SQL.Database(new Uint8Array(buffer));
            console.log("✅ 로컬스토리지에서 데이터베이스를 불러왔습니다.");
        } else {
            console.warn("⚠️ 저장된 데이터베이스가 없습니다. 새로 초기화합니다.");
            db = new SQL.Database();

            // **users 테이블이 존재하는지 확인하고 없으면 생성**
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    game_money INTEGER NOT NULL DEFAULT 50000000
                );
                
                CREATE TABLE IF NOT EXISTS user_record (
                    user_id TEXT PRIMARY KEY,
                    win_count INTEGER NOT NULL DEFAULT 0,
                    lose_count INTEGER NOT NULL DEFAULT 0,
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
                );
            `);
            console.log("✅ 새 데이터베이스가 생성되었습니다.");
        }
    } catch (error) {
        console.error("❌ 데이터베이스 로드 중 오류 발생:", error);
    }
}


function loadUserProfile(user_id) {
    const storedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (storedUser) {
        console.log("✅ 로컬스토리지에서 사용자 데이터 불러옴:", storedUser);

        document.getElementById("username").innerText = storedUser.username;
        document.getElementById("game_money").innerText = storedUser.game_money.toLocaleString() + " 원";
        document.getElementById("win_count").innerText = storedUser.win_count || 0;
        document.getElementById("lose_count").innerText = storedUser.lose_count || 0;
    } else {
        console.warn("⚠️ 로그인된 사용자 정보를 찾을 수 없음.");
    }
}



