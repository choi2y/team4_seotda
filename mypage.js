document.addEventListener("DOMContentLoaded", async function() {
    // SQL.js 초기화: locateFile 옵션은 필요한 wasm 파일의 위치를 지정합니다.
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    });

    // sample-db.sqlite 파일을 fetch로 불러와서 ArrayBuffer로 변환
    const response = await fetch("sample-db.sqlite");
    if (!response.ok) {
        console.error("데이터베이스 파일을 불러오지 못했습니다.");
        return;
    }
    const buffer = await response.arrayBuffer();
    // 불러온 파일 데이터를 이용해 데이터베이스 객체 생성
    const db = new SQL.Database(new Uint8Array(buffer));

    // 로그인 후 sessionStorage에 저장된 user_id 가져오기
    const storedUser = localStorage.getItem("loggedUser");

    const user = JSON.parse(storedUser);
    const user_id = user.user_id;
    console.log("localStorage에서 가져온 user_id:", user_id);

// 사용자 정보 및 기록을 불러오는 함수
    function loadUserProfile(user_id) {
        // users 테이블과 user_record 테이블을 LEFT JOIN 하여 승리, 패배 횟수를 포함
        const query = `
            SELECT 
                u.user_id, 
                u.username, 
                u.game_money, 
                COALESCE(ur.win_count, 0) AS win_count, 
                COALESCE(ur.lose_count, 0) AS lose_count
            FROM users u
            LEFT JOIN user_record ur ON u.user_id = ur.user_id
            WHERE u.user_id = ?
        `;
        const stmt = db.prepare(query);
        stmt.bind([user_id]);

        if (stmt.step()) {
            const user = stmt.getAsObject();
            console.log("조회된 사용자 데이터:", user);
            document.getElementById("username").innerText = user.username;
            document.getElementById("game_money").innerText = user.game_money;
            document.getElementById("win_count").innerText = user.win_count;
            document.getElementById("lose_count").innerText = user.lose_count;
        }else {
            console.log("해당 user_id로 조회된 데이터가 없습니다.");
        }
    }
    // 게임시작 기능
    window.start = function() {
        window.location.href = "select_mode.html";
    };

// 로그아웃 기능
    function logout() {
        localStorage.removeItem("loggedUser");
        window.location.href = "login.html";
    }
    window.logout = logout;
    loadUserProfile(user_id);
});
