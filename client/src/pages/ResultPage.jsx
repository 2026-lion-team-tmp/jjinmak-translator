import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: shareData } = useParams();

  // 공유 링크로 접속한 경우 Base64 디코딩
  const shared = shareData
    ? JSON.parse(atob(shareData))
    : null;

  const stateData = location.state || shared;
  const { name, phrase, playCount, skipRanking } = stateData || {};

  const [displayPhrase, setDisplayPhrase] = useState('');
  const [isAnimating, setIsAnimating] = useState(!shared);

  const dummyPhrases = [
    '두근두근...',
    '읽는 중...',
    '해석 중...',
    '거의 다 됐어...',
  ];

  useEffect(() => {
    if (!phrase) return;

    // 공유 링크로 온 경우 애니메이션 스킵
    if (shared) {
      setDisplayPhrase(phrase);
      return;
    }

    let count = 0;
    const interval = setInterval(() => {
      if (count < 8) {
        setDisplayPhrase(dummyPhrases[count % dummyPhrases.length]);
        count++;
      } else {
        setDisplayPhrase(phrase);
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [phrase]);

  if (!stateData) {
    navigate('/');
    return null;
  }

  const handleRetry = async () => {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, skipRanking: skipRanking || false }),
    });
    const data = await res.json();
    navigate('/result', { state: { ...data, skipRanking }, replace: true });
    window.location.reload();
  };

  const handleShare = () => {
    const payload = btoa(JSON.stringify({ name, phrase, playCount }));
    const url = `${window.location.origin}/share/${payload}`;
    if (navigator.share) {
      navigator.share({ url });
    } else {
      navigator.clipboard.writeText(url);
      alert('링크가 복사되었습니다!');
    }
  };

  return (
    <div className="result-page">
      <h2>'{name}'의 속마음은…</h2>
      <div className={`phrase-display ${isAnimating ? 'animating' : 'revealed'}`}>
        "{displayPhrase}"
      </div>
      <p className="play-count">현재 {playCount}판 째</p>
      <div className="result-buttons">
        <button onClick={handleShare}>공유하기</button>
        <button onClick={handleRetry}>다시 돌리기</button>
        <button onClick={() => navigate('/')}>돌아가기</button>
      </div>
    </div>
  );
}

export default ResultPage;
