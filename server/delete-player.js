require('dotenv').config();
const { execSync } = require('child_process');

const name = process.argv[2];
if (!name) {
  console.log('사용법: npm run delete-player -- "이름"');
  process.exit(1);
}

const { SSH_HOST, SSH_PORT, SSH_USER, SSH_KEY_PATH } = process.env;
if (!SSH_HOST || !SSH_PORT || !SSH_USER || !SSH_KEY_PATH) {
  console.error('server/.env 파일에 SSH 접속 정보를 설정해주세요.');
  process.exit(1);
}

const ssh = `ssh -i ${SSH_KEY_PATH} -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST}`;
const nameB64 = Buffer.from(name).toString('base64');

const nodeCmd = [
  "const Database = require('better-sqlite3');",
  "const db = new Database('/app/db/jjinmak.db');",
  `const name = Buffer.from('${nameB64}', 'base64').toString();`,
  "const row = db.prepare('SELECT * FROM players WHERE name = ?').get(name);",
  "if (row) {",
  "  db.prepare('DELETE FROM players WHERE name = ?').run(name);",
  "  console.log('삭제 완료: ' + row.name + ' (' + row.play_count + '판)');",
  "} else {",
  "  console.log('해당 이름이 없습니다: ' + name);",
  "}",
  "db.close();",
].join(' ');

try {
  const result = execSync(`${ssh} "docker exec jjinmak node -e \\"${nodeCmd}\\""`, { encoding: 'utf-8' });
  console.log(result.trim());
} catch (e) {
  console.error(e.stderr || e.message);
}
