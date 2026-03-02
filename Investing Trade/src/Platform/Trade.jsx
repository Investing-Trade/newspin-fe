import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import dislike from '../assets/dislike.png';
import submit from '../assets/submit.png';
import logout from '../assets/logout.png';
import refresh from '../assets/re.png';
import correction from '../assets/correction-tape.png';
import trade from '../assets/trade.png';
import trading from '../assets/trading.png';
import selling from '../assets/selling.png';
import write from '../assets/write-review.png';
import it from '../assets/it.png';
import enter from '../assets/popcorn.png';
import cutlery from '../assets/cutlery.png';
import buy from '../assets/buy-button.png';
import bio from '../assets/bio-gas.png';
import earning from '../assets/earning.png';
import input from '../assets/input.png';
import start from '../assets/start.png';
import review from '../assets/write-review.png';
import distribution from '../assets/distribution.png';
import globe from '../assets/globe.png';
import axios from 'axios';
import save from '../assets/save.png';
import { Eye, EyeOff } from 'lucide-react';

axios.defaults.baseURL = "http://52.78.151.56:8080";

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const Trade = () => {
    const navigate = useNavigate();

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // API 데이터 상태
    const [session, setSession] = useState(null); // 현재 시뮬레이션 세션 정보
    const [dayData, setDayData] = useState(null); // 현재 날짜의 뉴스 및 자산 정보
    const [portfolio, setPortfolio] = useState(null); // setPortfolio 상태 추가
    const [userInfo, setUserInfo] = useState({ userId: '', email: '', password: '****' });
    const [editData, setEditData] = useState({ userId: '', email: '', password: '' });

    // 입력 폼 상태
    const [config, setConfig] = useState({
        initialCapital: 1000000,
        startDate: '2020-01-01',
        endDate: '2020-03-31'
    });
    const [tradeOrder, setTradeOrder] = useState({
        stockCode: 'CELLTRION',
        quantity: 1,
        tradeType: 'BUY'
    });

    // 2. 투자 시작 - 세션 생성 (POST /simulation/sessions)
    const handleStartSimulation = async () => {
        // 1. 유효성 검사: 금액 제한 (이미지 명세에 따라 최소 100만 원, 사용자 요청에 따라 최대 1000만 원)
        if (config.initialCapital < 1000000 || config.initialCapital > 10000000) {
            alert("투자 금액은 100만 원에서 1,000만 원 사이여야 합니다.");
            return;
        }

        // 2. 날짜 유효성 검사
        if (new Date(config.startDate) >= new Date(config.endDate)) {
            alert("종료 날짜는 시작 날짜보다 이후여야 합니다.");
            return;
        }
        try {
            const response = await axios.post('/simulation/sessions', {
                initialCapital: config.initialCapital,
                startDate: config.startDate,
                endDate: config.endDate
            });

            if (response.data.status === "SUCCESS") {
                const sessionData = response.data.data;
                setSession(sessionData);
                alert("투자 세션이 시작되었습니다.");

                // ✅ 첫날 데이터 조회
                await fetchDayData(sessionData.sessionId);
                await fetchPortfolio(sessionData.sessionId);

            } else {
                alert(response.data.message || "투자 세션 시작 실패");
            }
        } catch (error) {
            console.error("Simulation Start Error:", error);
            alert("투자를 시작하지 못했습니다: " + (error.response?.data?.message || "서버 오류"));
        }
    };

    const fetchUserInfo = async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            console.error("인증 토큰이 없습니다. 로그인이 필요합니다.");
            return;
        }

        try {
            const response = await axios.get('/user/me');
            if (response.data.status === "SUCCESS") {
                setUserInfo(response.data.data);
            }
        } catch (error) {
            console.error("User info error", error);
        }
    };

    const fetchDayData = async (sid) => {
        try {
            const response = await axios.get(`/simulation/sessions/${sid}/daily-data`);

            if (response.data.status === "SUCCESS") {
                setDayData(response.data.data);
            }

        } catch (error) {
            console.error("Fetch day data error", error);
        }
    }

    // 4. 내 포트폴리오/잔액 조회 (GET /simulation/sessions/{sessionId}/portfolio)
    const fetchPortfolio = async (sid) => {
        try {
            const response = await axios.get(`/simulation/sessions/${sid}/portfolio`);
            if (response.data.status === "SUCCESS") {
                setPortfolio(response.data.data);
            }
        } catch (error) {
            console.error("Portfolio fetch error", error);
        }
    }

    // 5. 다음 날짜로 이동 (POST /simulation/sessions/{sessionId}/next-day)
    const handleNextDay = async () => {
        if (!session) return alert("먼저 투자를 시작해주세요.");
        try {
            const response = await axios.post(`/simulation/sessions/${session.sessionId}/next-day`);
            if (response.data.status === "SUCCESS") {
                setDayData(response.data.data); // 업데이트된 날짜 및 뉴스 정보
                fetchPortfolio(session.sessionId); // 자산 정보 갱신
            }
        } catch (error) {
            console.error("Next day error", error);
            alert("더 이상 진행할 수 있는 날짜가 없습니다.");
        }
    };

    // 6. 매수/매도 실행 (POST /simulation/sessions/{sessionId}/trades)
    const handleTrade = async (type) => {
        if (!session) return alert("투자가 진행 중이 아닙니다.");
        try {
            const response = await axios.post(`/simulation/sessions/${session.sessionId}/trades`, {
                stockCode: tradeOrder.stockCode,
                tradeType: type, // "BUY" or "SELL"
                quantity: tradeOrder.quantity,
                price: 58000 // 실제 환경에서는 차트의 현재가 연동
            });

            if (response.data.status === "SUCCESS") {
                alert(`${tradeOrder.stockCode} ${tradeOrder.quantity}주 ${type === 'BUY' ? '매수' : '매도'} 완료!`);
                fetchPortfolio(session.sessionId); // 거래 후 잔액 갱신
            } else {
                alert(response.data.message || "거래 실패");
            }
        } catch (error) {
            alert("거래 실패: " + (error.response?.data?.message || "잔액이나 수량을 확인하세요."));
        }
    };

    const handleUpdateInfo = () => {
        setIsEditing(false);
        alert("정보가 수정되었습니다.");
    };

    const generateDateOptions = (start, end) => {
        const dates = [];
        let current = new Date(start);
        const stopDate = new Date(end);
        while (current <= stopDate) {
            dates.push(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 3);
        }
        return dates;
    };

    const dateOptions = generateDateOptions('2020-01-01', '2020-03-31');

    useEffect(() => {
        document.title = "NewsPin - Trading Dashboard";
        fetchUserInfo();
    }, []);

    return (
        <div className="w-full h-screen bg-blue-700 flex flex-col items-center md:p-2 font-agbalumo overflow-hidden">

            {/* [상단 헤더 영역] */}
            <div className="w-full max-w-4xl flex justify-between items-start mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="relative w-80 h-15">
                        <img src={predictiveAnalytics} alt="analysis" className='absolute w-16 -top-1 left-17 drop-shadow-md' />
                        <img src={businessMan} alt="man" className="absolute w-16 -bottom-5 left-3 drop-shadow-md" />
                        <img src={webAnalytics} alt="chart" className="absolute -bottom-5 left-33 w-16 drop-shadow-md" />
                    </div>
                    <h1 className="text-white text-6xl font-agbalumo italic tracking-tight font-serif ml-4 flex">NewsPin</h1>
                </div>

                <div className="text-white text-lg font-medium flex gap-4 pt-4">
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="hover:underline font-jua cursor-pointer"
                    >
                        내 정보
                    </button>
                    <span className='font-bold mb-2'>|</span>
                    <button onClick={() => navigate('/login')} className="hover:underline font-jua cursor-pointer">로그아웃</button>
                </div>
            </div>

            {/* [메인 컨텐츠 영역] */}
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-4 border-4 border-gray-400 flex-1 overflow-hidden">

                <div className="flex flex-1 gap-6 overflow-hidden">

                    {/* === [좌측 영역] 투자 설정(상) + 차트(하) === */}
                    <div className="flex-[1.2] flex flex-col gap-4 overflow-hidden">

                        {/* 1. 투자 환경 설정 */}
                        <div className="border-2 border-gray-300 rounded-lg p-2 relative bg-white shrink-0">
                            <div className="flex items-center gap-3 mb-3">
                                <img src={input} alt="input" className='w-8 h-8' />
                                <h3 className="text-lg font-semibold ">투자 환경 설정</h3>

                                <button onClick={handleStartSimulation} className="flex hover:bg-blue-600 active:scale-[0.90] transition-all bg-blue-400 border-1 border-black cursor-pointer shadow-lg font-semibold text-white text-sm px-2 py-1 rounded-md items-center gap-2">
                                    <img src={start} alt="start" className='w-5 h-5' />
                                    <span>투자 시작</span>
                                </button>
                                <div className="ml-auto flex items-center gap-1 text-sm font-bold">
                                    <img src={earning} alt="earn" className='w-8 h-8' />
                                    <span className='pl-1'>설정 금액:  {config.initialCapital.toLocaleString()}원</span>                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-jua text-sm">
                                <span className="font-bold">시작날짜</span>
                                <select
                                    value={config.startDate}
                                    onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                                    className="border border-gray-400 rounded px-1 w-30 text-center bg-white"
                                >
                                    {dateOptions.map(date => <option key={`start-${date}`} value={date}>{date}</option>)}
                                </select>

                                <span className="font-bold">종료날짜</span>
                                <select
                                    value={config.endDate}
                                    onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                                    className="border border-gray-400 rounded px-1 w-30 text-center bg-white"
                                >
                                    {dateOptions.map(date => <option key={`end-${date}`} value={date}>{date}</option>)}
                                </select>

                                <span className="font-bold">금액</span>
                                {/* p 태그 대신 사용자가 직접 입력 가능한 number 타입 input으로 변경 */}
                                <input
                                    type="number"
                                    min="1000000"
                                    max="10000000"
                                    step="100000"
                                    value={config.initialCapital}
                                    onChange={(e) => setConfig({ ...config, initialCapital: Number(e.target.value) })}
                                    className="border border-gray-400 rounded text-right px-1 w-24"
                                />
                                <span className="text-[12px] text-black"> 한도 : 100 ~ 1000만원</span>
                            </div>
                        </div>

                        {/* 3. 차트 정보 및 거래 */}
                        <div className="flex-1 border-2 border-gray-300 rounded-lg p-1 flex flex-col bg-white overflow-hidden">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <img src={trading} alt="dashboard" className='w-10 h-10' />
                                    <h3 className="font-bold text-lg">차트 정보 및 거래</h3>
                                </div>
                                <div className="border border-gray-400 rounded-sm px-3 py-1 text-sm font-bold bg-gray-50">
                                    현재 날짜 : {dayData ? dayData.simulationDate : session?.currentSimulationDate || '-'}
                                </div>
                            </div>

                            <div className="flex flex-1 gap-2 overflow-hidden mb-1">
                                <div className="flex-1 border-2 border-slate-700 rounded-lg flex items-end justify-around p-4 bg-gray-50 relative">
                                    {/* 차트 시각화 (Mock) */}
                                    <div className="w-6 bg-green-500 h-[60%] relative"></div>
                                    <div className="w-6 bg-red-500 h-[40%] relative"></div>
                                    <div className="w-6 bg-green-500 h-[75%] relative"></div>
                                    <div className="w-6 bg-red-500 h-[50%] relative"></div>
                                </div>
                                <div className="w-44 border border-gray-400 rounded p-1 text-[10px] font-jua leading-tight bg-gray-50">
                                    <p className="font-bold border-b ">← [정보 개요도]</p>
                                    <ul className="list-disc list-inside space-y-0.5">
                                        <li>수익률: {dayData ? dayData.profitRate : 0}%</li>
                                        <li>일일 변동: {dayData ? dayData.dailyProfitRate : 0}%</li>
                                        <li>총 자산: {dayData ? dayData.totalAsset.toLocaleString() : 0}</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-1 border-t pt-1 shrink-0">
                                <div>
                                    <div className="flex items-center gap-2 text-[13px] font-bold">
                                        <img src={trade} alt="trade" className='w-7 h-7' />
                                        <span className="font-bold text-xs">매수 / 매도</span>
                                        <span className="text-sm ml-auto font-semibold">잔액
                                            <span className="border rounded-sm border-gray-400 px-2 py-0.5 ml-1">    {portfolio?.currentCapital?.toLocaleString() || 0} 원
                                            </span></span>
                                    </div>
                                    <div className="text-[13px] font-bold mb-3 mt-1">종목 선택</div>
                                    <div className="flex space-x-3 text-[12px] mb-2">
                                        <img src={bio} alt="bio" className='w-5 h-5' />
                                        <span className='font-bold text-[12px] mt-1'>바이오</span>
                                        <img src={it} alt="it" className='w-5 h-5' />
                                        <span className='font-bold text-[12px] mt-1'>IT/테크</span>
                                        <img src={distribution} alt="distribution" className='w-5 h-5' />
                                        <span className='font-bold text-[12px] mt-1'>유통</span>
                                        <img src={globe} alt="globe" className='w-5 h-5 ml-2' />
                                        <span className='font-bold text-[12px] mt-1'>여행</span>
                                    </div>
                                    <div className="flex flex-row items-center space-x-3">
                                        <select className="border text-[9px] font-bold rounded w-18">
                                            <option>셀트리온</option>
                                            <option>한미약품</option>
                                            <option>유한양행</option>
                                            <option>삼성바이오로직스</option>
                                        </select>
                                        <select className="border text-[9px] font-bold rounded w-18">
                                            <option>셀트리온</option>
                                            <option>한미약품</option>
                                            <option>유한양행</option>
                                            <option>삼성바이오로직스</option>
                                        </select>
                                        <select className="border text-[9px] font-bold rounded w-18">
                                            <option>셀트리온</option>
                                            <option>한미약품</option>
                                            <option>유한양행</option>
                                            <option>삼성바이오로직스</option>
                                        </select>
                                        <select className="border text-[9px] font-bold rounded w-18">
                                            <option>셀트리온</option>
                                            <option>한미약품</option>
                                            <option>유한양행</option>
                                            <option>삼성바이오로직스</option>
                                        </select>
                                    </div>
                                    <div className="flex space-x-2 text-[8px] mt-2">
                                        <img src={cutlery} alt="cutlery" className='w-5 h-5' />
                                        <span className='font-bold text-[12px] mt-1'>외식 / 프랜차이즈</span>
                                        <img src={enter} alt="enter" className='w-5 h-5' />
                                        <span className='font-bold text-[12px] mt-1'>문화 / 엔터테인먼트</span>
                                    </div>
                                    <select className="border ml-1 text-[9px] font-bold rounded w-20">
                                        <option>CGV</option>
                                        <option>SM</option>
                                    </select>
                                    <select className="border ml-15 text-[9px] font-bold rounded w-20">
                                        <option>신세계푸드</option>
                                    </select>
                                </div>
                                <div className="flex flex-col ml-20 gap-1 items-end text-xs font-jua">
                                    <div className="flex w-full justify-between items-center"><span className="font-bold">종목</span> <span className="border border-gray-400 px-4 rounded bg-white">셀트리온</span></div>
                                    <div className="flex w-full justify-between items-center"><span className="font-bold">거래 대금</span> <span className="border border-gray-400 px-4 rounded bg-white font-mono">58,000 원</span></div>
                                    <div className="flex w-full justify-between items-center"><span className="font-bold">거래량</span> <div className="flex items-center gap-1"><span className="border border-gray-400 px-4 rounded bg-white">10</span><span>주</span></div></div>
                                    <div className="flex w-full justify-between items-center"><span className="font-bold">총 가격</span> <span className="border border-gray-400 px-4 rounded bg-white font-mono">580,000 원</span></div>
                                    <div className="flex gap-2 w-full mt-2">
                                        <button onClick={() => handleTrade('BUY')} className="mt-8 ml-9 w-[38%] px-1 cursor-pointer gap-2 flex hover:bg-blue-700 active:scale-[0.90] transition-all bg-blue-600 text-white rounded-md py-1 font-bold shadow-md hover:bg-blue-800"><img src={buy} alt="buy" className='w-8 h-8' />
                                            <span className='mt-2 text-[16px] ml-1'>매수</span>
                                        </button>
                                        <button onClick={() => handleTrade('SELL')} className="mt-8 w-[38%] px-1 cursor-pointer gap-2 flex hover:bg-red-700 active:scale-[0.90] transition-all bg-red-500 text-white rounded-md py-1 font-bold shadow-md hover:bg-red-700">
                                            <img src={selling} alt="sell" className='w-8 h-8' />
                                            <span className='mt-2 text-[16px] ml-1'>매도</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === [우측 영역] 뉴스 기사(상) + 피드백(하) === */}
                    <div className="flex-1 flex flex-col 2 overflow-hidden">

                        {/* 2. 뉴스 기사 -> 추후 api 연동 */}
                        <div className="flex-1 border-2 border-gray-400 rounded-lg p-1 flex flex-col bg-white overflow-hidden">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">📋</span>
                                <h3 className="font-bold text-lg">뉴스 기사</h3>
                                <span className="text-sm font-bold ml-auto truncate">코로나19에도 '위기가 곧 기회' 외친 국내 제약사들</span>
                            </div>
                            <div className="border border-gray-400 rounded-lg p-3 flex-1 overflow-y-auto text-xs leading-relaxed font-jua">
                                {dayData?.todayNews?.length > 0 ? (
                                    dayData.todayNews.map((news) => (
                                        <div key={news.newsId} className="mb-4 border-b pb-2">
                                            <h4 className="font-bold text-sm text-blue-800">{news.title}</h4>
                                            <p className="mt-1">{news.content}</p>
                                            <div className="text-[10px] text-gray-500 mt-1">출처: {news.source} | 감성: {news.sentiment}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center mt-10">투자를 시작하면 해당 날짜의 뉴스가 표시됩니다.</p>
                                )}
                            </div>
                        </div>

                        {/* 4. 투자 결과 및 피드백 -> 추후 api 연동 */}
                        <div className="flex-0.8 border-2 border-gray-400 rounded-lg p-2 bg-white flex flex-col overflow-hidden">
                            <div className="flex items-center gap-2 mb-2">
                                <img src={review} alt="review" className='w-10 h-10' />
                                <h3 className="font-bold text-lg">투자 결과 및 피드백</h3>
                            </div>
                            <div className="border border-gray-400 rounded-lg p-3 flex-1 overflow-y-auto text-[11px] leading-snug font-jua space-y-2">
                                {dayData ? (
                                    <>
                                        <p><span className="font-bold text-blue-700">현재 상태:</span> 시뮬레이션이 {dayData.status} 상태입니다.</p>
                                        <p><span className="font-bold text-green-700">정보:</span> 뉴스의 감성을 분석하여 매수/매도 타이밍을 잡아보세요.</p>
                                    </>
                                ) : (
                                    <p>투자를 시작하여 피드백을 확인하세요.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 최하단 네비게이션 버튼 바 (위치 유지) */}
                <div className="flex justify-between items-center px-4 pt-2 border-t mt-auto shrink-0 font-jua">
                    <div className="flex gap-3">
                        <button onClick={handleNextDay} className="cursor-pointer bg-sky-500 text-white hover:bg-amber-200 active:scale-[0.90] transition-all px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:bg-cyan-400">
                            <span className="text-lg">📅</span> 다음 날짜
                        </button>
                        <button onClick={() => navigate('/main')} className="cursor-pointer hover:bg-blue-700 active:scale-[0.90] transition-all bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:bg-violet-500">
                            <span className="text-lg">🏠</span> 메인 화면 이동
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => navigate(`/report/${session?.sessionId}`)} className="bg-slate-700 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-400 active:scale-[0.90] text-xs font-bold flex items-center gap-2 shadow-md">
                            <span className="text-lg">📊</span> 투자 결과 및 피드백
                        </button>
                        <button onClick={() => navigate('/portfolio')} className="bg-blue-600 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-600 active:scale-[0.90] text-xs font-bold flex items-center gap-2 shadow-md hover:bg-blue-800">
                            <span className="text-lg">📍</span> 내 포트폴리오로 이동
                        </button>
                    </div>
                </div>

                {/* [내 정보 모달] - API 연동 반영 */}
                {isProfileModalOpen && (
                    <div className="fixed inset-0 bg-white/60 flex justify-center items-center z-50">
                        <div className="bg-white rounded-3xl p-10 w-[500px] shadow-2xl flex flex-col font-jua">
                            <h2 className="text-5xl text-center mb-8">내 정보</h2>

                            <div className="space-y-6 mb-8 text-2xl">
                                {/* 아이디 필드 */}
                                <div>
                                    <label className="block mb-2">아이디</label>
                                    <input
                                        type="text"
                                        value={isEditing ? editData.userId : userInfo.userId}
                                        onChange={(e) => setEditData({ ...editData, userId: e.target.value })}
                                        readOnly={!isEditing}
                                        className={`w-full border-2 border-black rounded-xl p-3 font-jua font-bold ${isEditing ? 'bg-blue-50' : 'bg-white'}`}
                                    />
                                </div>

                                {/* 이메일 필드 */}
                                <div>
                                    <label className="block mb-2">이메일</label>
                                    <input
                                        type="email"
                                        value={isEditing ? editData.email : userInfo.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        readOnly={!isEditing}
                                        className={`w-full border-2 border-black rounded-xl p-3 font-jua font-bold ${isEditing ? 'bg-blue-50' : 'bg-white'}`}
                                    />
                                </div>

                                {/* 비밀번호 필드: lucide icon 토글 적용 */}
                                <div>
                                    <label className="block mb-2">비밀번호 {isEditing && "변경"}</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}

                                            // 수정 중일 때는 입력 중인 값(editData.password)을 보여줌
                                            value={isEditing ? editData.password
                                                : userInfo.password}

                                            onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                            readOnly={!isEditing}
                                            placeholder={isEditing ? "새 비밀번호 입력" : ""}
                                            className={`w-full border-2 border-black rounded-xl p-3 font-jua pr-12 ${isEditing ? 'bg-blue-50' : 'bg-gray-100'}`}
                                        />
                                        {/* 수정 중이 아닐 때도 비밀번호를 볼 수 있도록 버튼 상시 활성화 */}
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                        </button>
                                    </div>
                                </div>

                            </div>

                            <hr className="border-gray-300 mb-8" />

                            <div className="flex gap-4 space-x-6">
                                {isEditing ? (
                                    <button onClick={handleUpdateInfo} className="flex-1 bg-sky-500 text-white active:scale-[0.98] transition-all rounded-[1rem] border-solid border-white text-2xl cursor-pointer py-2 flex items-center justify-center gap-2 hover:bg-sky-600">
                                        <img src={save} alt="save" className='w-12' />
                                        <span>저장하기</span>
                                    </button>
                                ) : (
                                    <button onClick={() => { setIsEditing(true); setEditData({ ...userInfo, password: "" }) }} className="flex-1 bg-blue-600 text-white active:scale-[0.98] transition-all rounded-[1rem] border-solid border-white text-2xl cursor-pointer py-2 flex items-center justify-center gap-2 hover:bg-indigo-700">
                                        <img src={correction} alt="correct" className='w-12' />
                                        <span>수정하기</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => { setIsProfileModalOpen(false); setIsEditing(false); setShowPassword(false); }}
                                    className="flex-1 bg-blue-600 cursor-pointer text-white text-2xl active:scale-[0.98] transition-all rounded-[1rem] border-solid border-white py-1 flex items-center justify-center gap-2 hover:bg-indigo-700"
                                >
                                    <img src={logout} alt="logout" className='w-13' />
                                    <span>메인 페이지로</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Trade;