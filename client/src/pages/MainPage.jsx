import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RankingList } from '../components/RankingList';

const FONT = "Inter, 'Noto Sans KR', sans-serif";

export default function MainPage() {
  const navigate = useNavigate();
  const [friendName, setFriendName] = useState('');
  const [dontRecord, setDontRecord] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    const res = await fetch('/api/ranking');
    const data = await res.json();
    setRankings(data.ranking);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResult(null);
      setSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?name=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      setSearchResult(data.result);
      setSearched(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleTranslate = async () => {
    if (!friendName.trim()) {
      alert('친구 이름을 입력해주세요!');
      return;
    }

    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: friendName.trim(), skipRanking: dontRecord }),
    });
    const data = await res.json();
    navigate('/result', { state: { ...data, skipRanking: dontRecord } });
  };

  return (
    <div className="marble-bg min-h-screen flex items-center justify-center p-6" style={{ fontFamily: FONT }}>
      {/* 메인 카드 — Figma: 885×389, rounded-30, bg-black */}
      <div className="bg-black rounded-[30px] flex flex-col md:flex-row w-full max-w-[885px] min-h-[389px] relative overflow-hidden">

        {/* ===== 왼쪽: 입력 영역 ===== */}
        {/* Figma 좌표: 왼쪽 패딩 97px, 상단 패딩 ~40px */}
        <div className="w-full md:w-[563px] shrink-0 pl-[97px] pr-[40px] py-[40px] flex flex-col justify-center">

          {/* 타이틀 — Figma: 큰 흰색 볼드 텍스트, 카드 상단 중앙 */}
          <h1
            className="text-white text-[45px] leading-tight mb-[42px]"
            style={{ fontFamily: "NeoDungGeunMo, monospace" }}
          >
            니,,, 공부할끼가?
          </h1>

          {/* 이름 입력 — Figma: 233×48, bg rgba(255,255,255,0.23), border #bfd1ff, rounded 5 */}
          <input
            type="text"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
            placeholder="친구 이름이 뭐고?"
            className="w-[233px] h-[48px] bg-[rgba(255,255,255,0.23)] border border-[#bfd1ff] rounded-[5px] px-[19px] text-white text-[20px] placeholder-[rgba(255,255,255,0.33)] focus:outline-none focus:border-[#9cb5ff]"
          />

          {/* 체크박스 — Figma: dot 8×8 rgba(255,255,255,0.92), text 12px rgba(255,255,255,0.33) */}
          <label className="flex items-center gap-[6px] cursor-pointer mt-[13px] mb-[48px]">
            <span
              className={`w-2 h-2 rounded-[2px] transition-colors ${dontRecord ? 'bg-[rgba(255,255,255,0.92)]' : 'bg-[rgba(255,255,255,0.3)]'}`}
            />
            <input
              type="checkbox"
              checked={dontRecord}
              onChange={(e) => setDontRecord(e.target.checked)}
              className="hidden"
            />
            <span className="text-[12px] text-[rgba(255,255,255,0.33)]">
              랭크에 기록 안 할란다
            </span>
          </label>

          {/* CTA 버튼 — Figma: 383×48, bg #9cb5ff, rounded 100 */}
          <button
            onClick={handleTranslate}
            className="w-[383px] max-w-full h-[48px] bg-[#9cb5ff] hover:bg-[#b0c5ff] rounded-[100px] text-white text-[20px] font-bold transition-all hover:scale-[1.02]"
          >
            속마음 번역 할래말래
          </button>

          {/* 이스터에그 — Figma: 12px, rgba(255,255,255,0.33), text-shadow 0 0 10px #b2caff, 버튼 아래 중앙 */}
          <p
            className="text-[12px] text-[rgba(255,255,255,0.33)] text-center w-[383px] max-w-full mt-[10px]"
            style={{ textShadow: '0px 0px 10px #b2caff' }}
          >
            이스터에그 숨겨뒀다잉
          </p>
        </div>

        {/* ===== 구분선 — Figma: x=563, vertical ===== */}
        <div className="hidden md:block w-px bg-[rgba(255,255,255,0.1)] absolute left-[563px] top-[32px] bottom-[32px]" />

        {/* ===== 오른쪽: 랭킹 영역 ===== */}
        {/* Figma: 검색바 시작 x=626 (카드 기준), 상단 패딩 45px */}
        <div className="flex-1 pl-[63px] pr-[40px] py-[45px] flex flex-col">

          {/* 검색바 — Figma: 201×48, bg rgba(255,255,255,0.23), border #fcbfff, rounded 5 */}
          <div className="relative mb-[24px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="임마 어딨노?"
              className="w-[201px] h-[48px] bg-[rgba(255,255,255,0.23)] border border-[#fcbfff] rounded-[5px] px-[19px] pr-[40px] text-white text-[20px] placeholder-[rgba(255,255,255,0.33)] focus:outline-none focus:border-[#ff9cee]"
            />
            {/* 돋보기 아이콘 — Figma: x=165 (input 기준 오른쪽), 17×16 */}
            <svg
              className="absolute left-[176px] top-1/2 -translate-y-1/2 w-[17px] h-[16px] text-[rgba(255,255,255,0.33)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* 검색 결과 */}
          {searched && (
            <div className="mb-[12px] p-[10px] bg-[rgba(255,255,255,0.08)] rounded-[5px] max-w-[220px]">
              {searchResult ? (
                <p className="text-white text-[14px]">
                  {searchResult.name} — {searchResult.rank}위 ·{' '}
                  <span className="text-[#ff9cee]" style={{ textShadow: '4px 0px 10px #e0f' }}>
                    딴짓 {searchResult.play_count}번 째!
                  </span>
                </p>
              ) : (
                <p className="text-[rgba(255,255,255,0.33)] text-[14px]">검색 결과가 없습니다.</p>
              )}
            </div>
          )}

          {/* 랭킹 리스트 — 6위까지 */}
          <RankingList rankings={rankings} />
        </div>
      </div>
    </div>
  );
}
