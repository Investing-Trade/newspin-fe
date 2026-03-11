import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logout from '../assets/logout.png';
import correction from '../assets/correction-tape.png';
import trade from '../assets/trade.png';
import trading from '../assets/trading.png';
import selling from '../assets/selling.png';
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
import completion from '../assets/completion.png';
import stop from '../assets/stop-sign.png';
import house from '../assets/house.png';
import schedule from '../assets/schedule.png';

const api = axios.create({
    baseURL: "http://52.78.151.56:8080",
    withCredentials: false,
});

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

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//  403/401이면 토큰 제거 후 로그인으로 보내기(세션 API 포함 전부에 적용)
api.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("simulationSessionId");
            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

const Trade = () => {
    const navigate = useNavigate();

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // API 데이터 상태
    const [trades, setTrades] = useState([]);      // 거래 내역 목록
    const [tradesLoading, setTradesLoading] = useState(false);
    const [sessions, setSessions] = useState([]); // 내 시뮬레이션 세션 목록
    const [session, setSession] = useState(null); // 현재 사용 중인 세션
    const [dayData, setDayData] = useState(null); // 현재 날짜의 뉴스 및 자산 정보
    const [portfolio, setPortfolio] = useState(null); // 포트폴리오 응답
    const [report, setReport] = useState(null); //  투자 결과 및 피드백(report API 응답) 상태 추가
    const [selectedCategory, setSelectedCategory] = useState("bio"); // 현재 선택 카테고리
    const [currentFeedback, setCurrentFeedback] = useState(null); // 진행 중 세션에서 버튼 클릭 시 생성되는 현재 시점 피드백 상태
    const [hasRequestedFeedback, setHasRequestedFeedback] = useState(false); // 사용자가 "투자 결과 및 피드백" 버튼을 눌렀는지 여부, 이 값을 분리해서 초기 렌더링 시 자동 분석 문구가 뜨지 않게 막음
    const [userInfo, setUserInfo] = useState({ userId: "", email: "", password: "" });
    const [editData, setEditData] = useState({ userId: "", email: "", password: "" });

    // 내 정보 불러오기 (GET /user/me)
    // 입력 폼 상태
    const [config, setConfig] = useState({
        initialCapital: 1000000,
        startDate: '2020-01-01',
        endDate: '2020-03-31'
    });

    //  종목 및 수량 관리 상태 수정
    const [tradeOrder, setTradeOrder] = useState({
        stockCode: 'CELLTRION',
        quantity: 1,
    });

    //  1) STOCKS를 카테고리별로 분리 (기존 STOCKS 교체)
    const STOCK_CATEGORIES = {
        bio: [
            { label: "셀트리온", code: "CELLTRION", price: 58000 },
            { label: "한미약품", code: "HANMI", price: 300000 },
            { label: "유한양행", code: "YUHAN", price: 70000 },
            { label: "삼성바이오로직스", code: "SAMSUNG_BIO", price: 800000 },
        ],
        it: [
            { label: "네이버", code: "NAVER", price: 210000 },
            { label: "카카오", code: "KAKAO", price: 52000 },
            { label: "삼성전자", code: "SAMSUNG_ELEC", price: 71000 },
            { label: "SK하이닉스", code: "SK_HYNIX", price: 145000 },
        ],
        distribution: [
            { label: "신세계", code: "SHINSEGAE", price: 170000 },
            { label: "이마트", code: "EMART", price: 62000 },
            { label: "롯데쇼핑", code: "LOTTE_SHOP", price: 78000 },
            { label: "신세계푸드", code: "SHINSEGAE_FOOD", price: 45000 },
        ],
        travel: [
            { label: "대한항공", code: "KOREAN_AIR", price: 24000 },
            { label: "아시아나", code: "ASIANA", price: 11000 },
            { label: "하나투어", code: "HANA_TOUR", price: 52000 },
            { label: "모두투어", code: "MODE_TOUR", price: 18000 },
        ],
        franchise: [
            { label: "신세계푸드", code: "SHINSEGAE_FOOD", price: 45000 },
            { label: "CJ푸드빌", code: "CJ_FOODBILL", price: 26000 },
            { label: "SPC삼립", code: "SPC_SAM", price: 62000 },
            { label: "농심", code: "NONGSHIM", price: 380000 },
        ],
        entertainment: [
            { label: "CGV", code: "CGV", price: 60000 },
            { label: "SM", code: "SM", price: 110000 },
            { label: "JYP", code: "JYP", price: 85000 },
            { label: "하이브", code: "HYBE", price: 230000 },
        ],
    };

    // 세션과 관련된 진행/피드백/결과 상태를 모두 초기화
    const clearAllSessionState = () => {
        localStorage.removeItem("simulationSessionId");

        // 진행 중 세션 관련 상태 제거
        setSession(null);
        setDayData(null);
        setPortfolio(null);
        setTrades([]);

        // 투자 결과/피드백 상태 제거
        setReport(null);
        setCurrentFeedback(null);
        setHasRequestedFeedback(false);
    };

    // 진행 중 세션 정보만 비우고 완료 리포트 등은 유지할 때 사용
    const clearActiveProgressOnly = () => {
        localStorage.removeItem("simulationSessionId");
        setDayData(null);
        setPortfolio(null);
        setTrades([]);

        // 진행 중 피드백 상태 초기화
        setCurrentFeedback(null);
        setHasRequestedFeedback(false);
    };

    // 현재 세션 관련 상태를 전체 초기화
    const clearCurrentProgress = () => {
        localStorage.removeItem("simulationSessionId");
        setSession(null);
        setDayData(null);
        setPortfolio(null);
        setTrades([]);
        setReport(null);

        // 진행 중 피드백 상태 초기화
        setCurrentFeedback(null);
        setHasRequestedFeedback(false);
    };

    const currentStocks = STOCK_CATEGORIES[selectedCategory] ?? [];

    //  카테고리 바뀌었는데 현재 stockCode가 그 카테고리에 없으면 첫 종목으로 맞춤
    useEffect(() => {
        if (!currentStocks.length) return;

        const exists = currentStocks.some((s) => s.code === tradeOrder.stockCode);
        if (!exists) {
            setTradeOrder((prev) => ({ ...prev, stockCode: currentStocks[0].code }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    const selectedStock =
        currentStocks.find((s) => s.code === tradeOrder.stockCode) ?? currentStocks[0];

    const selectedLabel = selectedStock?.label ?? tradeOrder.stockCode;
    const selectedPrice = selectedStock?.price ?? 0;
    const totalPrice = (Number(tradeOrder.quantity) || 0) * (Number(selectedPrice) || 0);

    //  4) 카테고리 클릭 핸들러 추가 (아무 함수들 있는 곳에 추가)
    const handlePickCategory = (catKey) => {
        if (!session?.sessionId) return alert("먼저 투자를 시작해주세요.");

        const list = STOCK_CATEGORIES[catKey] ?? [];
        if (list.length === 0) return;

        setSelectedCategory(catKey);

        //  카테고리 바꾸면 첫 종목으로 자동 선택 + 수량 유지
        setTradeOrder((prev) => ({
            ...prev,
            stockCode: list[0].code,
        }));
    };

    const isSuccess = (data) => {
        const s = String(data?.status ?? "").toUpperCase();
        const c = String(data?.code ?? "").toUpperCase();
        return s === "SUCCESS" || s === "OK" || c === "SUCCESS" || c === "OK" || c === "200";
    };

    // 1)투자 시작 - 세션 생성
    const handleStartSimulation = async () => {
        if (config.initialCapital < 1000000 || config.initialCapital > 10000000) {
            alert("투자 금액은 100만 원에서 1,000만 원 사이여야 합니다.");
            return;
        }
        if (new Date(config.startDate) >= new Date(config.endDate)) {
            alert("종료 날짜는 시작 날짜보다 이후여야 합니다.");
            return;
        }

        try {
            const response = await api.post('/simulation/sessions', {
                initialCapital: config.initialCapital,
                startDate: config.startDate,
                endDate: config.endDate
            });

            console.log("세션 생성 응답:", response.data);

            if (!isSuccess(response.data)) {
                alert("세션 생성 실패/형식 불일치: " + JSON.stringify(response.data));
                return;
            }

            const sessionData = response.data.data;
            const sid = sessionData?.sessionId;
            if (!sid) {
                alert("세션 ID(sessionId)가 없습니다: " + JSON.stringify(sessionData));
                return;
            }

            // 새 세션 시작 시 현재 세션 정보 반영
            setSession(sessionData);

            // 이전 완료 리포트 제거
            setReport(null);

            // 이전 진행 피드백도 제거해서 초기 문구가 나오도록 설정
            setCurrentFeedback(null);
            setHasRequestedFeedback(false);

            // 현재 진행 중 세션 ID 저장
            localStorage.setItem("simulationSessionId", String(sid));

            await Promise.all([
                fetchDayData(sid),
                fetchPortfolio(sid),
                fetchTrades(sid)
            ]);

            await fetchSessions();
            alert("투자 세션이 시작되었습니다.");
        } catch (error) {
            console.error("투자 시작 실패:", error);
            alert("투자를 시작하지 못했습니다: " + (error.response?.data?.message || error.message || "서버 오류"));
        }
    };

    // 리포트 조회 (GET /simulation/sessions/{sessionId}/report)
    const fetchReport = async (sid) => {
        if (!sid) {
            setReport(null);
            return null;
        }

        try {
            const res = await api.get(`/simulation/sessions/${sid}/report`);
            console.log("report:", res.data);

            if (isSuccess(res.data)) {
                setReport(res.data.data); //  UI에서 바로 쓸 수 있게 상태 반영
                return res.data.data;
            } else {
                setReport(null);
            }
        } catch (e) {
            console.error("fetchReport error:", e);
            setReport(null);
        }

        return null;
    };

    // 7. 거래 내역 조회 (GET /simulation/sessions/{sessionId}/trades)
    const fetchTrades = async (sid) => {
        if (!sid) return;
        setTradesLoading(true);
        try {
            const res = await api.get(`/simulation/sessions/${sid}/trades`);
            console.log("trades:", res.data);

            if (isSuccess(res.data)) {
                setTrades(Array.isArray(res.data.data) ? res.data.data : []);
            } else {
                setTrades([]);
            }
        } catch (e) {
            console.error("trades error:", e);
            setTrades([]);
        } finally {
            setTradesLoading(false);
        }
    };

    // 내 세션 목록 조회 (GET /simulation/sessions)
    const fetchSessions = async () => {
        try {
            const res = await api.get('/simulation/sessions');
            if (isSuccess(res.data) && Array.isArray(res.data.data)) {
                const list = res.data.data;
                setSessions(list);
                return list;
            }
        } catch (e) {
            console.error("세션 목록 로드 실패:", e);
        }
        return [];
    };

    // 세션 상세 조회 (GET /simulation/sessions/{sessionId})
    const fetchSessionDetail = async (sid) => {
        if (!sid) return null;
        try {
            const res = await api.get(`/simulation/sessions/${sid}`);
            console.log("session detail:", res.data);

            if (isSuccess(res.data)) {
                const data = res.data.data;
                setSession(data); // 최신 세션정보로 갱신
                return data;
            }
        } catch (e) {
            console.error("fetchSessionDetail error:", e);
        }
        return null;
    };

    // 세션 완료 처리
    // 서버에는 완료 상태를 저장하고, 프론트에서는 진행 중 데이터가 더 이상 보이지 않도록 초기화
    const handleCompleteSession = async () => {
        const sid = session?.sessionId;
        if (!sid) return alert("세션이 없습니다.");

        try {
            // 서버에 세션 완료 요청 전달
            const res = await api.put(`/simulation/sessions/${sid}/complete`);
            console.log("complete session:", res.data);

            if (!isSuccess(res.data)) {
                alert("세션 완료 처리 실패: " + JSON.stringify(res.data));
                return;
            }

            // 완료된 세션은 더 이상 진행 중 세션이 아니므로 localStorage에서 제거
            localStorage.removeItem("simulationSessionId");

            // 프론트 진행 화면에 보이던 데이터 전부 초기화
            // Portfolio 페이지에서도 ACTIVE 세션 복구가 안 되도록 현재 상태를 명확히 비움
            setSession(null);
            setDayData(null);
            setPortfolio(null);
            setTrades([]);
            setReport(null);
            setCurrentFeedback(null);
            setHasRequestedFeedback(false);

            // 세션 목록 재조회
            await fetchSessions();

            alert("세션이 완료 처리되었고, 진행 정보는 초기화되었습니다.");
        } catch (e) {
            console.error("complete error:", e);
            alert("세션 완료 처리 중 오류가 발생했습니다.");
        }
    };

    // 목록에서 복구할 세션 선택(저장된 sid 우선 → ACTIVE 우선 → 최신)
    const pickSessionIdToRestore = (list) => {
        // ACTIVE 세션만 복구 대상으로 제한
        const activeList = Array.isArray(list)
            ? list.filter(s => String(s.status).toUpperCase() === "ACTIVE")
            : [];

        const savedSid = localStorage.getItem("simulationSessionId");

        // 저장된 sessionId도 ACTIVE일 때만 복구
        if (savedSid && activeList.some(s => String(s.sessionId) === String(savedSid))) {
            return Number(savedSid);
        }

        if (activeList.length === 0) return null;

        // ACTIVE 세션 중 최신 것만 복구
        const sortedActive = [...activeList].sort((a, b) => {
            const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            if (ad !== bd) return bd - ad;
            return (Number(b.sessionId) || 0) - (Number(a.sessionId) || 0);
        });

        return Number(sortedActive[0].sessionId);
    };

    // sid로 현재 세션 세팅 + 관련 데이터 로딩
    const restoreSession = async (sid, listForMeta = null) => {
        if (!sid) return;

        const currentSessionInfo = listForMeta?.find(s => Number(s.sessionId) === Number(sid));

        if (currentSessionInfo) {
            setSession(currentSessionInfo);
        } else {
            setSession({ sessionId: sid });
        }

        localStorage.setItem("simulationSessionId", String(sid));

        // 기본 데이터 복구
        await Promise.all([
            fetchDayData(sid),
            fetchPortfolio(sid),
            fetchTrades(sid)
        ]);

        // 세션이 완료 상태이면 report도 함께 조회
        const currentStatus = String(currentSessionInfo?.status || "").toUpperCase();
        if (currentStatus === "COMPLETED") {
            await fetchReport(sid);
        } else {
            setReport(null);
        }

        // 페이지 복구 시 자동 분석이 뜨지 않도록 초기화
        setCurrentFeedback(null);
        setHasRequestedFeedback(false);
    };

    const fetchUserInfo = async () => {
        try {
            const response = await api.get('/user/me');

            if (response.data.status?.toUpperCase() === "SUCCESS") {
                const { userId, email } = response.data.data;
                const savedPwd = localStorage.getItem("userPwd") || "";

                const fetchedInfo = {
                    userId,
                    email,
                    password: savedPwd,
                };

                setUserInfo(fetchedInfo);
                setEditData(fetchedInfo);
            }
        } catch (error) {
            console.error("내 정보 조회 실패:", error);
        }
    };

    const fetchDayData = async (sid) => {
        try {
            const response = await api.get(`/simulation/sessions/${sid}/daily-data`);
            console.log("daily-data:", response.data);

            if (isSuccess(response.data)) {
                setDayData(response.data.data);
            } else {
                setDayData(null);
            }
        } catch (error) {
            console.error("Fetch day data error", error);
            setDayData(null);
        }
    };
    // 내 포트폴리오/잔액 조회 (GET /simulation/sessions/{sessionId}/portfolio)
    const fetchPortfolio = async (sid) => {
        try {
            const response = await api.get(`/simulation/sessions/${sid}/portfolio`);
            console.log("portfolio:", response.data);

            if (isSuccess(response.data)) {
                setPortfolio(response.data.data);
            } else {
                setPortfolio(null);
            }
        } catch (error) {
            console.error("Portfolio fetch error", error);
            setPortfolio(null);
        }
    };

    // 세션 삭제 처리
    // 서버에는 삭제 요청을 보내고, 프론트에서는 관련 진행 데이터를 모두 제거
    const handleDeleteSession = async () => {
        const sid = session?.sessionId;
        if (!sid) return alert("세션이 없습니다.");

        const ok = window.confirm("정말 이 세션을 삭제할까요?");
        if (!ok) return;

        try {
            // 서버에 세션 삭제 요청 전달
            const res = await api.delete(`/simulation/sessions/${sid}`);
            console.log("delete session:", res.data);

            if (!isSuccess(res.data)) {
                alert("세션 삭제 실패: " + JSON.stringify(res.data));
                return;
            }

            // 삭제된 세션은 더 이상 복구되면 안 되므로 진행 상태 전체 초기화
            clearAllSessionState();

            // 세션 목록 재조회
            await fetchSessions();

            alert("세션이 삭제되었고, 관련 진행 정보도 초기화되었습니다.");
        } catch (e) {
            console.error("delete error:", e);
            alert("세션 삭제 중 오류가 발생했습니다.");
        }
    };

    // 다음 날짜로 이동 (POST /simulation/sessions/{sessionId}/next-day)
    const handleNextDay = async () => {
        if (!session?.sessionId) return alert("먼저 투자를 시작해주세요.");

        try {
            const response = await api.post(`/simulation/sessions/${session.sessionId}/next-day`);
            console.log("next-day:", response.data);

            if (isSuccess(response.data)) {
                setDayData(response.data.data);
                await Promise.all([
                    fetchPortfolio(session.sessionId),
                    fetchTrades(session.sessionId),
                    fetchSessionDetail(session.sessionId),
                ]);
            } else {
                alert("다음 날짜 진행 실패: " + JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("next-day error:", error);
            alert("더 이상 진행할 수 있는 날짜가 없습니다.");
        }
    };

    // ✅ 현재 진행 중인 날짜 기준으로 투자 평가/피드백 문구를 생성하는 함수
    // dayData + trades + portfolio 데이터를 조합해서 화면에 보여줄 피드백 객체를 만듦
    const buildCurrentFeedback = (day, tradeList, portfolioData) => {
        // ✅ 진행 데이터가 없으면 기본 문구 반환
        if (!day) {
            return {
                simulationDate: "-",
                totalTradeCount: 0,
                buyCount: 0,
                sellCount: 0,
                totalAsset: 0,
                currentCapital: 0,
                profitRate: 0,
                sentiment: "NEUTRAL",
                summary: "현재 진행 데이터가 없어 투자 결과 및 피드백을 생성할 수 없습니다.",
            };
        }

        // 현재 시뮬레이션 날짜
        const currentDate = String(day.simulationDate);

        // 현재 날짜 기준 매수/매도 내역만 필터링
        const todayTrades = Array.isArray(tradeList)
            ? tradeList.filter((trade) => String(trade.tradeDate) === currentDate)
            : [];

        // 현재 날짜 기준 매수/매도 횟수 계산
        const buyCount = todayTrades.filter(
            (trade) => String(trade.tradeType).toUpperCase() === "BUY"
        ).length;

        const sellCount = todayTrades.filter(
            (trade) => String(trade.tradeType).toUpperCase() === "SELL"
        ).length;

        // 현재 날짜 기준 주요 수치
        const sentiment = day.todayNews?.[0]?.sentiment || "NEUTRAL";
        const profitRate = Number(day.profitRate || 0);
        const totalAsset = Number(day.totalAsset || 0);
        const currentCapital = Number(portfolioData?.currentCapital || 0);

        // 뉴스 감성과 수익률을 바탕으로 현재 시점 평가 문구 생성
        let summary = `${currentDate} 기준 `;
        summary += `총 ${todayTrades.length}건의 거래가 있었습니다. `;
        summary += `(매수 ${buyCount}건 / 매도 ${sellCount}건) `;

        if (profitRate > 0) {
            summary += `현재 수익률은 ${profitRate}%로 양호한 흐름입니다. `;
        } else if (profitRate < 0) {
            summary += `현재 수익률은 ${profitRate}%로 손실 구간입니다. `;
        } else {
            summary += `현재 수익률은 0% 수준입니다. `;
        }

        if (sentiment === "POSITIVE") {
            summary += "뉴스 감성이 긍정적이므로 보유 종목 흐름을 점검하며 수익 실현 또는 추가 전략을 검토해보세요.";
        } else if (sentiment === "NEGATIVE") {
            summary += "뉴스 감성이 부정적이므로 무리한 추가 매수보다 리스크 관리와 보수적 대응을 우선 검토해보세요.";
        } else {
            summary += "뉴스 감성이 중립적이므로 성급한 추격 매수·매도보다 현재 포지션 점검을 우선해보세요.";
        }

        // 화면에서 바로 쓸 수 있게 결과 객체 반환
        return {
            simulationDate: currentDate,
            totalTradeCount: todayTrades.length,
            buyCount,
            sellCount,
            totalAsset,
            currentCapital,
            profitRate,
            sentiment,
            summary,
        };
    };

    // "투자 결과 및 피드백" 버튼 클릭 시 실행되는 함수
    // - 세션이 COMPLETED면 report API 결과를 보여줌
    // - 세션이 ACTIVE면 현재 날짜 기준 daily-data / trades / portfolio를 조회해서 피드백 생성
    const handleFetchCurrentFeedback = async () => {
        const sid = session?.sessionId;

        // 세션이 없으면 조회 불가
        if (!sid) {
            alert("조회할 세션이 없습니다.");
            return;
        }

        try {
            // 완료된 세션은 기존 최종 report를 그대로 사용
            if (String(session?.status).toUpperCase() === "COMPLETED") {
                await fetchReport(sid);
                setCurrentFeedback(null);
                setHasRequestedFeedback(true);
                return;
            }

            // 진행 중 세션은 현재 날짜 기준 데이터 재조회
            const [dayRes, tradeRes, portfolioRes] = await Promise.all([
                api.get(`/simulation/sessions/${sid}/daily-data`),
                api.get(`/simulation/sessions/${sid}/trades`),
                api.get(`/simulation/sessions/${sid}/portfolio`)
            ]);

            // 응답 데이터 검증 후 상태 반영
            const latestDayData = isSuccess(dayRes.data) ? dayRes.data.data : null;
            const latestTrades = isSuccess(tradeRes.data) && Array.isArray(tradeRes.data.data)
                ? tradeRes.data.data
                : [];
            const latestPortfolio = isSuccess(portfolioRes.data) ? portfolioRes.data.data : null;

            setDayData(latestDayData);
            setTrades(latestTrades);
            setPortfolio(latestPortfolio);

            // 현재 진행 기준 피드백 생성
            const feedback = buildCurrentFeedback(latestDayData, latestTrades, latestPortfolio);

            // 진행 중 피드백 상태 저장
            setCurrentFeedback(feedback);

            // 진행 중 조회에서는 최종 report를 비움
            setReport(null);

            // 사용자가 버튼을 눌렀다는 상태 저장
            setHasRequestedFeedback(true);
        } catch (error) {
            console.error("투자 결과 및 피드백 조회 실패:", error);
            alert("투자 결과 및 피드백을 불러오지 못했습니다.");
        }
    };

    // 매수/매도 실행 (POST /simulation/sessions/{sessionId}/trades)
    const handleTrade = async (type) => {
        if (!session?.sessionId) return alert("투자가 진행 중이 아닙니다.");

        const qty = Number(tradeOrder.quantity);
        if (!qty || qty <= 0) return alert("수량을 1 이상으로 입력하세요.");

        try {
            const response = await api.post(`/simulation/sessions/${session.sessionId}/trades`, {
                stockCode: tradeOrder.stockCode,
                tradeType: type,
                quantity: qty,
                price: selectedPrice, //  선택 종목 가격
            });

            if (isSuccess(response.data)) {
                alert(`${selectedLabel} ${qty}주 ${type === 'BUY' ? '매수' : '매도'} 완료!`);
                await Promise.all([
                    fetchPortfolio(session.sessionId),
                    fetchTrades(session.sessionId),
                ]);
            } else {
                alert("거래 실패: " + JSON.stringify(response.data));
            }
        } catch (error) {
            alert("거래 실패: " + (error.response?.data?.message || "잔액이나 수량을 확인하세요."));
        }
    };

    const handleUpdateInfo = async () => {
        const updatePayload = {
            ...editData,
            password: editData.password || userInfo.password
        };

        try {
            const response = await api.patch('/user/me', updatePayload);

            if (response.data.status?.toUpperCase() === "SUCCESS") {
                alert("내 정보가 성공적으로 수정되었습니다.");
                setUserInfo(updatePayload);

                if (editData.password) {
                    localStorage.setItem("userPwd", editData.password);
                }

                setIsEditing(false);
                setShowPassword(false);
            }
        } catch (error) {
            const msg = error.response?.data?.message || "수정 중 오류가 발생했습니다.";
            alert(msg);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("simulationSessionId");
        navigate("/login");
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
        (async () => {
            const token = getAccessToken();
            if (!token) return navigate("/login");

            await fetchUserInfo();

            // ACTIVE 세션만 복구
            const list = await fetchSessions();
            const sidToRestore = pickSessionIdToRestore(list);

            if (sidToRestore) {
                await restoreSession(sidToRestore, list);
            } else {
                // 진행 중 세션이 없으면 진행용 상태 초기화
                setDayData(null);
                setPortfolio(null);
                setTrades([]);
            }
        })();
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
                        onClick={() => {
                            setEditData(userInfo);
                            setIsProfileModalOpen(true);
                            setIsEditing(false);
                            setShowPassword(false);
                        }}
                        className="hover:underline font-jua cursor-pointer"
                    >
                        내 정보
                    </button>
                    <span className='font-bold mb-2'>|</span>
                    <button onClick={handleLogout} className="hover:underline font-jua cursor-pointer">로그아웃</button>
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
                                    현재 날짜 : {dayData?.simulationDate || '-'}
                                </div>
                            </div>

                            <div className="flex flex-1 gap-2 overflow-hidden mb-1">
                                <div className="flex-1 border-2 border-slate-700 rounded-lg flex items-end justify-around p-4 bg-gray-50 relative">
                                    {/* 가상 차트 (변동성 시각화) */}
                                    <div className="w-6 bg-green-500" style={{ height: `${Math.random() * 50 + 30}%` }}></div>
                                    <div className="w-6 bg-red-500" style={{ height: `${Math.random() * 50 + 20}%` }}></div>
                                    <div className="w-6 bg-green-500" style={{ height: `${Math.random() * 50 + 40}%` }}></div>
                                </div>
                                <div className="w-44 border border-gray-400 rounded p-1 text-[10px] font-jua leading-tight bg-gray-50">
                                    <p className="font-bold border-b ">← [정보 개요도]</p>
                                    <ul className="list-disc list-inside space-y-0.5">
                                        <li>수익률: <span className={dayData?.profitRate >= 0 ? 'text-red-500' : 'text-blue-500'}>{dayData?.profitRate || 0}%</span></li>
                                        <li>총 자산: {dayData?.totalAsset?.toLocaleString() || 0}원</li>
                                        <li>가용 잔액: {portfolio?.currentCapital?.toLocaleString() || 0}원</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-1 border-t pt-1 shrink-0">
                                {/* ===== 왼쪽 컬럼(카테고리 + 드롭다운) ===== */}
                                <div>
                                    <div className="flex items-center gap-2 text-[13px] font-bold">
                                        <img src={trade} alt="trade" className="w-7 h-7" />
                                        <span className="font-bold text-xs">매수 / 매도</span>
                                        <span className="text-sm ml-auto font-semibold">
                                            잔액
                                            <span className="border rounded-sm border-gray-400 px-2 py-0.5 ml-1">
                                                {portfolio?.currentCapital?.toLocaleString() || 0} 원
                                            </span>
                                        </span>
                                    </div>

                                    <div className="text-[13px] font-bold mb-3 mt-1">종목 선택</div>

                                    {/* 상단 4개 */}
                                    <div className="flex space-x-3 text-[12px] mb-2">
                                        {/* bio */}
                                        <div className="flex flex-col items-center">
                                            <button type="button" onClick={() => handlePickCategory("bio")} className="flex items-center gap-1">
                                                <img src={bio} alt="bio" className="w-5 h-5" />
                                                <span className="font-bold text-[12px] mt-1">바이오</span>
                                            </button>
                                            <select
                                                className="border text-[9px] font-bold rounded w-18 mt-1"
                                                value={selectedCategory === "bio" ? tradeOrder.stockCode : (STOCK_CATEGORIES.bio?.[0]?.code ?? "")}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    setSelectedCategory("bio");
                                                    setTradeOrder((prev) => ({ ...prev, stockCode: e.target.value }));
                                                }}
                                            >
                                                {STOCK_CATEGORIES.bio.map((s) => (
                                                    <option key={s.code} value={s.code}>{s.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* it */}
                                        <div className="flex flex-col items-center">
                                            <button type="button" onClick={() => handlePickCategory("it")} className="flex items-center gap-1">
                                                <img src={it} alt="it" className="w-5 h-5" />
                                                <span className="font-bold text-[12px] mt-1">IT/테크</span>
                                            </button>
                                            <select
                                                className="border text-[9px] font-bold rounded w-18 mt-1"
                                                value={selectedCategory === "it" ? tradeOrder.stockCode : (STOCK_CATEGORIES.it?.[0]?.code ?? "")}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    setSelectedCategory("it");
                                                    setTradeOrder((prev) => ({ ...prev, stockCode: e.target.value }));
                                                }}
                                            >
                                                {STOCK_CATEGORIES.it.map((s) => (
                                                    <option key={s.code} value={s.code}>{s.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* distribution */}
                                        <div className="flex flex-col items-center">
                                            <button type="button" onClick={() => handlePickCategory("distribution")} className="flex items-center gap-1">
                                                <img src={distribution} alt="distribution" className="w-5 h-5" />
                                                <span className="font-bold text-[12px] mt-1">유통</span>
                                            </button>
                                            <select
                                                className="border text-[9px] font-bold rounded w-18 mt-1"
                                                value={selectedCategory === "distribution" ? tradeOrder.stockCode : (STOCK_CATEGORIES.distribution?.[0]?.code ?? "")}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    setSelectedCategory("distribution");
                                                    setTradeOrder((prev) => ({ ...prev, stockCode: e.target.value }));
                                                }}
                                            >
                                                {STOCK_CATEGORIES.distribution.map((s) => (
                                                    <option key={s.code} value={s.code}>{s.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* travel */}
                                        <div className="flex flex-col items-center">
                                            <button type="button" onClick={() => handlePickCategory("travel")} className="flex items-center gap-1">
                                                <img src={globe} alt="globe" className="w-5 h-5 ml-2" />
                                                <span className="font-bold text-[12px] mt-1">여행</span>
                                            </button>
                                            <select
                                                className="border text-[9px] font-bold rounded w-18 mt-1"
                                                value={selectedCategory === "travel" ? tradeOrder.stockCode : (STOCK_CATEGORIES.travel?.[0]?.code ?? "")}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    setSelectedCategory("travel");
                                                    setTradeOrder((prev) => ({ ...prev, stockCode: e.target.value }));
                                                }}
                                            >
                                                {STOCK_CATEGORIES.travel.map((s) => (
                                                    <option key={s.code} value={s.code}>{s.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* 하단 2개 */}
                                    <div className="flex space-x-2 text-[8px] mt-2">
                                        {/* franchise */}
                                        <div className="flex flex-col items-center">
                                            <button type="button" onClick={() => handlePickCategory("franchise")} className="flex items-center gap-1">
                                                <img src={cutlery} alt="cutlery" className="w-5 h-5" />
                                                <span className="font-bold text-[12px] mt-1">외식 / 프랜차이즈</span>
                                            </button>
                                            <select
                                                className="border text-[9px] font-bold rounded w-20 mt-1"
                                                value={selectedCategory === "franchise" ? tradeOrder.stockCode : (STOCK_CATEGORIES.franchise?.[0]?.code ?? "")}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    setSelectedCategory("franchise");
                                                    setTradeOrder((prev) => ({ ...prev, stockCode: e.target.value }));
                                                }}
                                            >
                                                {STOCK_CATEGORIES.franchise.map((s) => (
                                                    <option key={s.code} value={s.code}>{s.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* entertainment */}
                                        <div className="flex flex-col items-center">
                                            <button type="button" onClick={() => handlePickCategory("entertainment")} className="flex items-center gap-1">
                                                <img src={enter} alt="enter" className="w-5 h-5" />
                                                <span className="font-bold text-[12px] mt-1">문화 / 엔터테인먼트</span>
                                            </button>
                                            <select
                                                className="border text-[9px] font-bold rounded w-20 mt-1"
                                                value={selectedCategory === "entertainment" ? tradeOrder.stockCode : (STOCK_CATEGORIES.entertainment?.[0]?.code ?? "")}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    setSelectedCategory("entertainment");
                                                    setTradeOrder((prev) => ({ ...prev, stockCode: e.target.value }));
                                                }}
                                            >
                                                {STOCK_CATEGORIES.entertainment.map((s) => (
                                                    <option key={s.code} value={s.code}>{s.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* ===== 오른쪽 컬럼(선택 종목 정보 + 매수/매도) ===== */}
                                <div className="flex flex-col ml-20 gap-1 items-end text-xs font-jua">
                                    <div className="flex w-full justify-between items-center">
                                        <span className="font-bold">종목</span>
                                        <span className="border border-gray-400 px-4 rounded bg-white">{selectedLabel}</span>
                                    </div>

                                    <div className="flex w-full justify-between items-center">
                                        <span className="font-bold">거래 대금</span>
                                        <span className="border border-gray-400 px-4 rounded bg-white font-mono">
                                            {selectedPrice.toLocaleString()} 원
                                        </span>
                                    </div>

                                    <div className="flex w-full justify-between items-center">
                                        <span className="font-bold">거래량</span>
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                min={1}
                                                value={tradeOrder.quantity}
                                                onChange={(e) => setTradeOrder((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                                                className="border border-gray-400 px-2 rounded bg-white w-16 text-right"
                                            />
                                            <span>주</span>
                                        </div>
                                    </div>

                                    <div className="flex w-full justify-between items-center">
                                        <span className="font-bold">총 가격</span>
                                        <span className="border border-gray-400 px-4 rounded bg-white font-mono">
                                            {totalPrice.toLocaleString()} 원
                                        </span>
                                    </div>

                                    <div className="flex gap-2 w-full mt-2">
                                        <button
                                            onClick={() => handleTrade("BUY")}
                                            className="mt-8 ml-9 w-[38%] px-1 cursor-pointer gap-2 flex hover:bg-blue-700 active:scale-[0.90] transition-all bg-blue-600 text-white rounded-md py-1 font-bold shadow-md hover:bg-blue-800"
                                        >
                                            <img src={buy} alt="buy" className="w-8 h-8" />
                                            <span className="mt-2 text-[16px] ml-1">매수</span>
                                        </button>

                                        <button
                                            onClick={() => handleTrade("SELL")}
                                            className="mt-8 w-[38%] px-1 cursor-pointer gap-2 flex hover:bg-red-700 active:scale-[0.90] transition-all bg-red-500 text-white rounded-md py-1 font-bold shadow-md hover:bg-red-700"
                                        >
                                            <img src={selling} alt="sell" className="w-8 h-8" />
                                            <span className="mt-2 text-[16px] ml-1">매도</span>
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
                                            <h4 className="font-bold text-sm text-blue-800">[{news.eventType}] {news.title}</h4>
                                            <p className="text-xs mt-1 text-gray-700 line-clamp-3">{news.content}</p>
                                            <div className="text-[10px] text-gray-400 mt-1">출처: {news.source} | 감성: {news.sentiment}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center mt-10">진행 중인 뉴스가 없습니다.</p>)}
                            </div>
                        </div>

                        {/* 4. 투자 결과 및 피드백 -> 추후 api 연동 */}
                        <div className="h-48 border-2 border-gray-400 rounded-lg p-3 bg-white flex flex-col overflow-hidden">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <img src={review} className="w-6" alt="review" /> 투자 결과 및 피드백
                            </h3>

                            <div className="flex-1 overflow-y-auto text-xs font-jua bg-yellow-50 p-2 rounded">
                                {report ? (
                                    // 완료된 세션이면 report API 기반 최종 보고서 표시
                                    <div className="space-y-2">
                                        <p>
                                            📈 총 수익률:
                                            <b className={report.totalProfitRate >= 0 ? 'text-red-500 ml-1' : 'text-blue-500 ml-1'}>
                                                {report.totalProfitRate}%
                                            </b>
                                        </p>

                                        <p>
                                            💰 최종 자산:
                                            <b className="ml-1">{report.finalAsset?.toLocaleString()}원</b>
                                        </p>

                                        <p>
                                            🔁 총 거래 횟수:
                                            <b className="ml-1">{report.totalTradeCount}회</b>
                                            <span className="ml-2">매수 {report.buyCount} / 매도 {report.sellCount}</span>
                                        </p>

                                        <p>🧠 종합 분석: {report.overallAnalysis}</p>
                                        <p>📰 뉴스 반응 분석: {report.newsResponseAnalysis}</p>
                                        <p>⚠️ 리스크 관리 분석: {report.riskManagementAnalysis}</p>
                                        <p>✅ 개선 제안: {report.improvementSuggestions}</p>
                                    </div>
                                ) : hasRequestedFeedback && currentFeedback ? (
                                    // 진행 중 세션에서 버튼 클릭 후 생성된 현재 날짜 기준 보고서 표시
                                    <div className="space-y-2">
                                        <p>
                                            📅 기준 날짜:
                                            <b className="ml-1">{currentFeedback.simulationDate}</b>
                                        </p>

                                        <p>
                                            📈 현재 수익률:
                                            <b className={currentFeedback.profitRate >= 0 ? 'text-red-500 ml-1' : 'text-blue-500 ml-1'}>
                                                {currentFeedback.profitRate}%
                                            </b>
                                        </p>

                                        <p>
                                            💰 현재 총 자산:
                                            <b className="ml-1">{currentFeedback.totalAsset?.toLocaleString()}원</b>
                                        </p>

                                        <p>
                                            💵 현재 가용 잔액:
                                            <b className="ml-1">{currentFeedback.currentCapital?.toLocaleString()}원</b>
                                        </p>

                                        <p>
                                            🔁 현재 날짜 거래 횟수:
                                            <b className="ml-1">{currentFeedback.totalTradeCount}회</b>
                                            <span className="ml-2">매수 {currentFeedback.buyCount} / 매도 {currentFeedback.sellCount}</span>
                                        </p>

                                        <p>
                                            📰 뉴스 감성:
                                            <b className="ml-1">{currentFeedback.sentiment}</b>
                                        </p>

                                        <p>💡 평가 및 피드백: {currentFeedback.summary}</p>
                                    </div>
                                ) : session?.status?.toUpperCase() === "COMPLETED" ? (
                                    // 완료 세션인데 report를 불러오지 못한 경우
                                    <p>세션은 완료되었지만 투자 결과 및 피드백을 불러오지 못했습니다.</p>
                                ) : (
                                    // 초기 진입 시 또는 버튼 클릭 전에는 항상 기본 안내 문구만 표시
                                    <p>투자를 시작하면 투자 결과 및 피드백이 제공됩니다.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 최하단 네비게이션 버튼 바 (위치 유지) */}
                <div className="flex justify-between items-center px-4 pt-2 border-t mt-auto shrink-0 font-jua">
                    <div className="flex gap-3">
                        <button onClick={handleNextDay} className="cursor-pointer bg-sky-500 text-white hover:bg-amber-200 active:scale-[0.90] transition-all px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:bg-cyan-400">
                            <img src={schedule} alt="다음 날짜" className="w-5 h-5" />
                            <p className="text-lg">다음 날짜</p>
                        </button>
                        <button onClick={() => navigate('/main')} className="cursor-pointer hover:bg-blue-700 active:scale-[0.90] transition-all bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:bg-violet-500">
                            <img src={house} alt="메인 화면 이동" className="w-5 h-5" />
                            <p className="text-lg">메인 화면</p>
                        </button>
                        <button onClick={handleCompleteSession} className="cursor-pointer bg-green-500 text-white hover:bg-green-400 active:scale-[0.90] transition-all px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:bg-cyan-400">
                            <img src={completion} alt="세션 종료" className="w-5 h-5" />
                            <p className="text-lg">세션 종료</p>
                        </button>

                        <button onClick={handleDeleteSession} className="cursor-pointer bg-red-500 text-white hover:bg-red-300 active:scale-[0.90] transition-all px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:bg-cyan-400">
                            <img src={stop} alt="세션 삭제" className="w-5 h-5" />
                            <p className="text-lg">세션 삭제</p>
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleFetchCurrentFeedback}
                            className="bg-slate-700 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-400 active:scale-[0.90] text-xs font-bold flex items-center gap-2 shadow-md"
                        >
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
                                    <span>닫기</span>
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