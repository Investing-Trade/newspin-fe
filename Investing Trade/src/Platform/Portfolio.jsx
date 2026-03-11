import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import logout from '../assets/logout.png';
import correction from '../assets/correction-tape.png';
import dashboard from '../assets/dashboard.png';
import bio from '../assets/bio-gas.png';
import it from '../assets/it.png';
import enter from '../assets/popcorn.png';
import distribution from '../assets/distribution.png';
import plane from '../assets/globe.png';
import cutlery from '../assets/cutlery.png';
import stock from '../assets/stock-exchange.png';
import setting from '../assets/stock-market.png';
import process from '../assets/data-processing.png';
import clock from '../assets/clock.png';
import calendar from '../assets/calendar.png';
import stocks from '../assets/stock-exchange.png';
import axios from 'axios';
import save from '../assets/save.png';
import { Eye, EyeOff } from 'lucide-react';

const api = axios.create({
    baseURL: "http://52.78.151.56:8080",
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//  서버 응답이 { status: "success", code: "200" } 형태인 것 같아서 그 기준으로 처리
const isSuccess = (data) => {
    if (!data) return false;

    // status: "success" / "SUCCESS" 등 대응
    if (typeof data.status === "string" && data.status.toLowerCase() === "success") return true;

    // code가 "200" 문자열이거나 200 숫자인 케이스 대응
    if (data.code === 200 || data.code === "200") return true;

    // success: true 같은 형태까지 대응(있으면)
    if (data.success === true) return true;

    return false;
};

const getAccessToken = () => {
    const raw = localStorage.getItem("accessToken");
    if (!raw) return null;

    const normalize = (t) => {
        if (!t) return null;
        const s = String(t).trim();
        return s.toLowerCase().startsWith("bearer ") ? s.slice(7).trim() : s;
    };

    try {
        if (raw.startsWith('"') || raw.startsWith("{") || raw.startsWith("[")) {
            const parsed = JSON.parse(raw);
            if (typeof parsed === "string") return normalize(parsed);

            return normalize(
                parsed?.accessToken ??
                parsed?.access_token ??
                parsed?.token ??
                parsed?.data?.accessToken ??
                parsed?.data?.token
            );
        }
        return normalize(raw);
    } catch {
        return normalize(raw);
    }
};

const Portfolio = () => {
    const navigate = useNavigate();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // ===== 내 정보 모달 상태(기존 UI 유지 위해 추가) =====
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userInfo, setUserInfo] = useState({ userId: '', email: '', password: '****' });
    const [editData, setEditData] = useState({ userId: '', email: '', password: '' });
    const [hasActiveSession, setHasActiveSession] = useState(false); // 현재 복구 가능한 ACTIVE 세션이 있는지 여부, 이 값으로 보유 종목/거래 내역/투자 환경 정보를 렌더링할지 결정
    // ===== 시뮬레이션/포트폴리오/거래내역 상태 =====
    const [session, setSession] = useState(null);        // 세션 상세/메타
    const [portfolio, setPortfolio] = useState(null);    // 잔고 + 보유종목(가능하면)
    const [dayData, setDayData] = useState(null);        // 현재 날짜(가능하면)
    const [trades, setTrades] = useState([]);

    // ===== 카테고리/종목 메타(Trade 페이지와 동일한 코드 기준으로 매핑) =====
    const STOCK_META = useMemo(() => ({
        bio: {
            title: '바이오',
            icon: bio,
            items: [
                { name: '셀트리온', code: 'CELLTRION' },
                { name: '한미약품', code: 'HANMI' },
                { name: '유한양행', code: 'YUHAN' },
                { name: '삼성바이오로직스', code: 'SAMSUNG_BIO' },
            ],
        },
        it: {
            title: 'IT/테크',
            icon: it,
            items: [
                { name: '네이버', code: 'NAVER' },
                { name: '카카오', code: 'KAKAO' },
                { name: '삼성전자', code: 'SAMSUNG_ELEC' },
                { name: 'SK하이닉스', code: 'SK_HYNIX' },
            ],
        },
        distribution: {
            title: '유통',
            icon: distribution,
            items: [
                { name: '신세계', code: 'SHINSEGAE' },
                { name: '이마트', code: 'EMART' },
                { name: '롯데쇼핑', code: 'LOTTE_SHOP' },
                { name: '신세계푸드', code: 'SHINSEGAE_FOOD' },
            ],
        },
        travel: {
            title: '여행',
            icon: plane,
            items: [
                { name: '대한항공', code: 'KOREAN_AIR' },
                { name: '아시아나', code: 'ASIANA' },
                { name: '하나투어', code: 'HANA_TOUR' },
                { name: '모두투어', code: 'MODE_TOUR' },
            ],
        },
        franchise: {
            title: '외식/프랜차이즈',
            icon: cutlery,
            items: [
                { name: '신세계푸드', code: 'SHINSEGAE_FOOD' },
                { name: 'CJ푸드빌', code: 'CJ_FOODBILL' },
                { name: 'SPC삼립', code: 'SPC_SAM' },
                { name: '농심', code: 'NONGSHIM' },
            ],
        },
        entertainment: {
            title: '문화/엔터테인먼트',
            icon: enter,
            items: [
                { name: 'CGV', code: 'CGV' },
                { name: 'SM', code: 'SM' },
                { name: 'JYP', code: 'JYP' },
                { name: '하이브', code: 'HYBE' },
            ],
        },
    }), []);

    const dday = (end, current) => {
        if (!end || !current || end === '-' || current === '-') return null;

        const endDate = new Date(end);
        const currentDate = new Date(current);

        if (isNaN(endDate.getTime()) || isNaN(currentDate.getTime())) return null;

        const diff = endDate.getTime() - currentDate.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const formatMoney = (value) => {
        const n = Number(value);
        if (!Number.isFinite(n)) return '-';
        return n.toLocaleString('ko-KR');
    };

    const safeNum = (value, fallback = 0) => {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    };

    const codeToName = useMemo(() => {
        const map = {};
        Object.values(STOCK_META).forEach(sec => {
            sec.items.forEach(i => { map[i.code] = i.name; });
        });
        return map;
    }, [STOCK_META]);

    // ===== API 함수들 =====
    const fetchUserInfo = async () => {
        try {
            const res = await api.get('/user/me');
            if (isSuccess(res.data)) {
                const savedPwd = localStorage.getItem("userPwd") || "****";
                const info = {
                    ...(res.data.data ?? { userId: '', email: '' }),
                    password: savedPwd,
                };

                setUserInfo(info);
                setEditData(info);
            }
        } catch (e) {
            console.error("fetchUserInfo error:", e);
        }
    };

    const fetchSessions = async () => {
        try {
            const res = await api.get('/simulation/sessions');
            if (isSuccess(res.data) && Array.isArray(res.data.data)) {
                return res.data.data;
            }
        } catch (e) {
            console.error("fetchSessions error:", e);
        }
        return [];
    };

    const fetchSessionDetail = async (sid) => {
        if (!sid) return null;
        try {
            const res = await api.get(`/simulation/sessions/${sid}`);
            if (isSuccess(res.data)) {
                setSession(res.data.data);
                return res.data.data;
            }
        } catch (e) {
            console.error("fetchSessionDetail error:", e);
        }
        return null;
    };

    const fetchDayData = async (sid) => {
        if (!sid) return null;
        try {
            const res = await api.get(`/simulation/sessions/${sid}/daily-data`);
            if (isSuccess(res.data)) {
                setDayData(res.data.data);
                return res.data.data;
            }
        } catch (e) {
            console.error("fetchDayData error:", e);
        }
        setDayData(null);
        return null;
    };

    const fetchPortfolio = async (sid) => {
        if (!sid) return null;

        try {
            const res = await api.get(`/simulation/sessions/${sid}/portfolio`);

            if (isSuccess(res.data)) {
                console.log("portfolio response data:", res.data.data);
                setPortfolio(res.data.data);
                return res.data.data;
            }

            console.error("fetchPortfolio fail response:", res.data);
        } catch (e) {
            console.error("fetchPortfolio error detail:", {
                sid,
                url: e.config?.url,
                method: e.config?.method,
                status: e.response?.status,
                responseData: e.response?.data,
            });
        }

        setPortfolio(null);
        return null;
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("simulationSessionId");
        navigate('/login');
    };

    // Portfolio 화면에서 진행 중 세션 관련 표시 데이터를 모두 초기화, 세션 완료/삭제 후에는 사용자에게 이전 투자 정보가 보이지 않도록 처리
    // 진행 중 세션이 없을 때 투자 환경 관련 숫자 정보를 비우는 초기화 함수
    const clearCurrentProgress = () => {
        localStorage.removeItem("simulationSessionId");

        // ACTIVE 세션 없음 처리
        setHasActiveSession(false);

        // 세션/포트폴리오/거래 상태 초기화
        setSession(null);
        setDayData(null);
        setPortfolio(null);
        setTrades([]);
    };

    const fetchTrades = async (sid) => {
        if (!sid) return [];

        try {
            const res = await api.get(`/simulation/sessions/${sid}/trades`);

            if (isSuccess(res.data)) {
                const list = Array.isArray(res.data.data) ? res.data.data : [];
                setTrades(list);
                return list;
            }

            console.error("fetchTrades fail response:", res.data);
        } catch (e) {
            console.error("fetchTrades error detail:", {
                sid,
                url: e.config?.url,
                method: e.config?.method,
                status: e.response?.status,
                responseData: e.response?.data,
            });
        }

        setTrades([]);
        return [];
    };

    const pickSessionIdToRestore = (list) => {
        const activeList = Array.isArray(list)
            ? list.filter(s => String(s.status).toUpperCase() === "ACTIVE")
            : [];

        const savedSid = localStorage.getItem("simulationSessionId");
        if (savedSid && activeList.some(s => String(s.sessionId) === String(savedSid))) {
            return Number(savedSid);
        }

        if (activeList.length === 0) return null;

        const sortedActive = [...activeList].sort((a, b) => {
            const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            if (ad !== bd) return bd - ad;
            return (Number(b.sessionId) || 0) - (Number(a.sessionId) || 0);
        });

        return Number(sortedActive[0].sessionId);
    };

    // ACTIVE 세션이 존재할 때 Portfolio 화면에 진행 데이터를 복구
    // ACTIVE 세션이 있을 때만 투자 환경 숫자 정보를 복구
    const restoreSession = async (sid, listForMeta = null) => {
        if (!sid) return;

        // ACTIVE 세션 존재 표시
        setHasActiveSession(true);

        localStorage.setItem("simulationSessionId", String(sid));

        const meta = listForMeta?.find(s => Number(s.sessionId) === Number(sid));
        if (meta) setSession(meta);
        else setSession({ sessionId: sid });

        await fetchSessionDetail(sid);
        await fetchDayData(sid);
        await fetchPortfolio(sid);
        await fetchTrades(sid);
    };
    // ===== 내 정보 수정 저장(현재 서버 API가 명확하지 않아서 UI만 유지) =====
    const handleUpdateInfo = async () => {
        const updatePayload = {
            ...editData,
            password: editData.password || userInfo.password
        };

        try {
            // api는 Portfolio.jsx 상단에 정의된 axios 인스턴스
            const response = await api.patch('/user/me', updatePayload);

            if (isSuccess(response.data)) {
                alert("내 정보가 성공적으로 수정되었습니다.");
                setUserInfo(updatePayload);
                if (editData.password) {
                    localStorage.setItem('userPwd', editData.password);
                }
                setIsEditing(false);
                setShowPassword(false);
            }
        } catch (error) {
            alert(error.response?.data?.message || "수정 중 오류가 발생했습니다.");
        }
    };
    // ===== 섹션(보유종목) 데이터 구성: API 응답 형태가 달라도 최대한 맞춰서 표시 =====
    const holdingsMap = useMemo(() => {
        const rawItems = Array.isArray(portfolio?.items) ? portfolio.items : [];

        const map = {};
        rawItems.forEach((item) => {
            const code = item?.stockCode;
            if (!code) return;

            const quantity = safeNum(item?.quantity, 0);
            const averagePrice = safeNum(item?.averagePrice, 0);
            const currentPrice = safeNum(item?.currentPrice, 0);

            // 현재 응답에 실현손익 필드는 없으므로 보유 평가손익으로 계산
            const profit = (currentPrice - averagePrice) * quantity;

            map[code] = {
                quantity,
                currentPrice,
                profit,
                stockName: item?.stockName ?? codeToName[code] ?? code,
            };
        });

        return map;
    }, [portfolio, codeToName]);

    const sections = useMemo(() => {
        const keys = ["bio", "it", "distribution", "travel", "franchise", "entertainment"];

        return keys.map((k) => {
            const sec = STOCK_META[k];

            return {
                title: sec.title,
                icon: sec.icon,
                stocks: sec.items.map((it) => {
                    const h = holdingsMap[it.code];
                    const qty = h?.quantity ?? 0;
                    const cur = h?.currentPrice ?? 0;
                    const p = h?.profit ?? 0;

                    const profitText =
                        p === 0 ? "0" : (p > 0 ? `+${formatMoney(p)}` : `-${formatMoney(Math.abs(p))}`);

                    return {
                        name: h?.stockName ?? it.name,
                        count: qty ? `${qty}주` : '-',
                        current: cur ? formatMoney(cur) : '-',
                        profit: profitText,
                    };
                }),
            };
        });
    }, [STOCK_META, holdingsMap]);

    const tradeRows = useMemo(() => {
        const arr = Array.isArray(trades) ? [...trades] : [];

        arr.sort((a, b) => {
            const at = new Date(a?.tradeDate ?? a?.createdAt ?? 0).getTime() || 0;
            const bt = new Date(b?.tradeDate ?? b?.createdAt ?? 0).getTime() || 0;
            return bt - at;
        });

        return arr.slice(0, 30).map((t) => {
            const code = t?.stockCode ?? null;
            const name = t?.stockName ?? (code ? (codeToName[code] ?? code) : '-');

            const qty = safeNum(t?.quantity, 0);
            const totalAmount = safeNum(t?.totalAmount, 0);
            const dateStr = (t?.tradeDate ?? t?.createdAt ?? '').toString().slice(0, 10) || '-';

            return {
                name,
                amount: totalAmount ? formatMoney(totalAmount) : '-',
                qty: qty || '-',
                profitText: '-',   // 현재 거래 조회 응답에는 수익 필드 없음
                profitUp: false,
                dateStr,
            };
        });
    }, [trades, codeToName]);

    // ===== 투자 환경 표시값(세션/포트폴리오/일자) ===== 
    // ACTIVE 세션이 있을 때만 투자 환경 숫자 정보를 계산, 세션이 없으면 화면에는 빈 값('')만 표시되도록 처리
    const startDate = hasActiveSession
        ? (session?.startDate ?? session?.period?.startDate ?? '')
        : '';

    const endDate = hasActiveSession
        ? (session?.endDate ?? session?.period?.endDate ?? '')
        : '';

    const initialCapital = hasActiveSession
        ? (session?.initialCapital ?? session?.config?.initialCapital ?? '')
        : '';

    const currentCapital = hasActiveSession
        ? (portfolio?.currentCapital ?? portfolio?.cash ?? portfolio?.balance ?? '')
        : '';

    const currentDate = hasActiveSession
        ? (dayData?.simulationDate ?? session?.simulationDate ?? session?.currentDate ?? '')
        : '';

    const remain = hasActiveSession && endDate && currentDate
        ? dday(endDate, currentDate)
        : null;

    useEffect(() => {
        // 페이지 제목
        document.title = "NewsPin - Portfolio";

        const initPortfolioPage = async () => {
            const token = getAccessToken();
            if (!token) {
                navigate("/login");
                return;
            }

            // 사용자 정보 먼저 복구
            await fetchUserInfo();

            // 서버에서 현재 세션 목록 조회
            const list = await fetchSessions();

            // ACTIVE 세션만 복구 대상으로 선택
            const sidToRestore = pickSessionIdToRestore(list);

            // ACTIVE 세션이 있으면 진행 정보 복구
            if (sidToRestore) {
                await restoreSession(sidToRestore, list);
            } else {
                // ACTIVE 세션이 없으면 이전 투자 정보가 남지 않도록 전체 초기화
                clearCurrentProgress();
            }
        };

        initPortfolioPage();
    }, [navigate]);

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
                    <button onClick={() => setIsProfileModalOpen(true)} className="hover:underline font-jua cursor-pointer">내 정보</button>
                    <span className='font-bold mb-2'>|</span>
                    <button onClick={handleLogout} className="hover:underline font-jua cursor-pointer">로그아웃</button>                </div>
            </div>

            {/* [메인 컨텐츠 영역] */}
            <div className="w-full max-w-7xl bg-slate-50 rounded-2xl shadow-2xl p-4 flex flex-col gap-6 border-4 border-gray-400 flex-1 overflow-hidden font-jua">
                <div className="flex flex-1 gap-5 overflow-hidden">

                    {/* 1. 보유 종목 섹션 (좌측) */}
                    <div className="flex-[0.45] flex flex-col overflow-hidden bg-white rounded-xl border-2 border-gray-600 shadow-sm">
                        <div className="p-3 border-b border-gray-600 bg-blue-600">
                            <h2 className="text-2xl flex items-center gap-2">
                                <img src={dashboard} alt="dashboard" className='w-10 h-10' />
                                <span className='text-white'>보유 종목 현황 </span>
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-300">
                            {sections.map((section, idx) => (
                                <div key={idx} className="group transition-all">
                                    <div className="sticky top-0 rounded-lg shadow-md bg-white/95 backdrop-blur-sm py-2 px-3 flex items-center gap-2 z-10 border-b border-gray-600 mb-2">
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            <img src={section.icon} alt={section.title} className="w-full h-full object-contain" />
                                        </div>
                                        <span className="font-bold text-lg text-gray-800">{section.title}</span>
                                    </div>

                                    <div className="overflow-hidden rounded-lg border border-gray-100 shadow-sm px-1">
                                        <table className="w-full text-sm text-center">
                                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                                <tr className="h-9">
                                                    <th className="pl-3 text-left">종목</th>
                                                    <th>수량</th>
                                                    <th>현재가</th>
                                                    <th className="pr-3 text-right">실현손익</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {section.stocks.map((stock, sIdx) => (
                                                    <tr key={sIdx} className="h-11 hover:bg-blue-50/30 transition-colors">
                                                        <td className="pl-3 text-left font-semibold text-gray-800">{stock.name}</td>
                                                        <td className="text-gray-600">{stock.count || '-'}</td>
                                                        <td className="font-mono text-gray-700">{stock.current || '-'}</td>
                                                        <td className={`pr-3 text-right font-bold ${stock.profit?.includes('+') ? 'text-red-500' : 'text-blue-500'}`}>
                                                            {stock.profit || '0'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. 상세 정보 영역 (우측) */}
                    <div className="flex-[0.55] flex flex-col gap-4 overflow-hidden">

                        {/* 거래 내역 박스 */}
                        <div className="flex-[0.7] bg-white rounded-xl border-2 border-gray-400 shadow-md flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                                    <img src={stock} alt="stock-price" className='w-10 h-10' />
                                    <span> 거래 내역 </span>
                                </h2>
                                <span className="text-sm text-gray-500 font-medium">최근 30건 기준</span>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <table className="w-full text-center border-collapse">
                                    <thead className="sticky top-0 bg-white shadow-sm text-gray-600">
                                        <tr className="h-12 border-b">
                                            <th>종목명</th>
                                            <th>거래대금</th>
                                            <th>거래량</th>
                                            <th>손익</th>
                                            <th>날짜</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 cursor-pointer">
                                        {tradeRows.length > 0 ? (
                                            tradeRows.map((r, i) => (
                                                <tr key={i} className="h-14 hover:bg-gray-100 transition-colors">
                                                    <td className="font-bold text-gray-800">{r.name}</td>
                                                    <td className="font-mono">{r.amount}</td>
                                                    <td>{r.qty}</td>
                                                    <td className={`${r.profitText === '-' ? 'text-gray-400' : (r.profitUp ? 'text-red-500' : 'text-blue-500')} font-bold`}>
                                                        {r.profitText}
                                                    </td>
                                                    <td className="text-gray-400 text-xs font-mono">{r.dateStr}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="h-14 text-gray-300 italic"><td colSpan="5">추가 거래 내역이 없습니다.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 하단 투자 환경 대시보드 */}
                        <div className="flex-[0.35] flex gap-4">
                            <div className="flex-1 bg-white rounded-xl shadow-md border-2 border-gray-400 flex flex-col justify-between">
                                <h3 className="text-xl pl-2 pt-1 font-bold flex items-center gap-2 text-gray-700 space-y-1">
                                    <img src={setting} alt="stock-setting" className='w-8 h-8' />
                                    <span> 투자 환경</span>
                                </h3>
                                <div className="grid grid-cols-2 gap-x-8">
                                    <div className="space-y-2 ml-2 mt-3">
                                        {/*  항목명은 유지하고, ACTIVE 세션이 없으면 값만 빈칸으로 표시 */}
                                        <p className="text-[15px] text-black">시작 날짜 : {startDate}</p>
                                        <p className="text-[15px] text-black">종료 날짜 : {endDate}</p>

                                        <p className="text-[15px] text-black mt-5">초기 자본 :</p>
                                        <p className="text-md text-gray-500 mt-2 font-bold underline decoration-yellow-400 underline-offset-4">
                                            {initialCapital !== '' ? formatMoney(initialCapital) : ''}
                                        </p>

                                        <p className="text-md text-black mt-5">현재 잔고 :</p>
                                        <p className="text-lg font-bold text-indigo-600 underline underline-offset-4 decoration-indigo-200">
                                            {currentCapital !== '' ? formatMoney(currentCapital) : ''}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-4">
                                        <div className='flex'>
                                            <img src={process} alt="data-processing" className='w-10 h-10' />
                                            <p className="text-[20px] font-bold text-black mt-2 ml-4">진행 현황 </p>
                                        </div>

                                        <div className='flex'>
                                            <img src={clock} alt="clock" className='w-10 h-10' />
                                            <p className="text-[20px] font-bold text-black mt-2 ml-4">현재 날짜 </p>
                                        </div>
                                        <p className="text-[14px] text-black mr-15">{currentDate !== '-' ? currentDate : '-'}</p>

                                        <div className='flex'>
                                            <img src={calendar} alt="calendar" className='w-10 h-10' />
                                            <p className="text-[20px] font-bold text-black mt-2 ml-4">남은 기간 </p>
                                        </div>
                                        <p className="text-[20px] text-red-500 mr-25">
                                            {typeof remain === "number" ? `D-${remain}` : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 액션 버튼 그룹 */}
                            <div className="w-50 flex flex-col gap-16 mt-10">
                                <button onClick={() => navigate('/trade')} className="flex p-2 space-x-2 bg-green-500 cursor-pointer hover:bg-green-800 border-2 border-gray-400 text-white rounded-lg items-center justify-center transition-all active:scale-95 shadow-lg">
                                    <img src={setting} alt="stock" className='w-7 h-12' />
                                    <span className="text-xl font-jua">모의 투자로 이동</span>
                                </button>
                                <button onClick={() => navigate('/main')} className="flex space-x-2 p-2 bg-blue-600 cursor-pointer hover:bg-cyan-700 border-2 border-gray-400 text-white rounded-lg items-center justify-center transition-all active:scale-95 shadow-lg">
                                    <img src={stocks} alt="stock" className='w-7 h-12' />
                                    <span className="text-xl font-jua">메인으로 이동</span>
                                </button>
                            </div>
                        </div>
                    </div>
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
                                <span>닫기</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;