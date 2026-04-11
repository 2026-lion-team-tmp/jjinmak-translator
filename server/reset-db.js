require('dotenv').config();
const { execSync } = require('child_process');

const { SSH_HOST, SSH_PORT, SSH_USER, SSH_KEY_PATH } = process.env;
if (!SSH_HOST || !SSH_PORT || !SSH_USER || !SSH_KEY_PATH) {
  console.error('server/.env 파일에 SSH 접속 정보를 설정해주세요.');
  process.exit(1);
}

const ssh = `ssh -i ${SSH_KEY_PATH} -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST}`;
const cmd = `${ssh} "docker stop jjinmak && rm -f ~/jjinmak-data/jjinmak.db ~/jjinmak-data/jjinmak.db-shm ~/jjinmak-data/jjinmak.db-wal && docker start jjinmak"`;

try {
  execSync(cmd, { encoding: 'utf-8', stdio: 'inherit' });
  console.log('DB 초기화 완료!');
} catch (e) {
  console.error('DB 초기화 실패:', e.message);
}
