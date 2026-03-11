import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import like from '../assets/thumb-up.png';
import dislike from '../assets/dislike.png';
import submit from '../assets/submit.png';
import logout from '../assets/logout.png';
import refresh from '../assets/re.png';
import correction from '../assets/correction-tape.png';
import axios from 'axios';
import exit from '../assets/exit.png';
import save from '../assets/save.png';
import { Eye, EyeOff } from 'lucide-react';

let newsPageInitialized = false;

const api = axios.create({
    baseURL: "http://52.78.151.56:8080",
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (error) => Promise.reject(error)
);

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

const isSuccess = (data) => {
    if (!data) return false;

    if (typeof data.status === "string" && data.status.toLowerCase() === "success") return true;
    if (data.code === 200 || data.code === "200") return true;
    if (data.success === true) return true;

    return false;
};
const News = () => {
    const navigate = useNavigate();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [newsData, setNewsData] = useState(null);
    const [userComment, setUserComment] = useState("");
    const [selectedSentiment, setSelectedSentiment] = useState(null);
    const [aiResult, setAiResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submittingOpinion, setSubmittingOpinion] = useState(false);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState({ userId: "", email: "", password: "" });
    const [editData, setEditData] = useState({ userId: "", email: "", password: "" });

    // 내 정보 불러오기 (GET /user/me)
    const fetchUserInfo = async () => {
        try {
            const response = await api.get('/user/me');

            if (isSuccess(response.data)) {
                const { userId, email } = response.data.data ?? {};
                const savedPwd = localStorage.getItem("userPwd") || "";

                const fetchedInfo = {
                    userId: userId ?? "",
                    email: email ?? "",
                    password: savedPwd,
                };

                setUserInfo(fetchedInfo);
                setEditData(fetchedInfo);
            }
        } catch (error) {
            console.error("내 정보 조회 실패:", error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("인증이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    const getCurrentSessionId = async () => {
        const sessions = await fetchSessions();
        if (!sessions.length) {
            setError("진행 중인 시뮬레이션 세션이 없습니다.");
            return null;
        }

        const sessionId = pickSessionIdToUse(sessions);
        if (!sessionId) {
            setError("사용할 수 있는 시뮬레이션 세션이 없습니다.");
            return null;
        }

        return sessionId;
    };

    const loadInitialNews = async () => {
        setLoading(true);
        setError(null);

        try {
            const loaded = await fetchTodayNewsFromSession();

            if (!loaded) {
                setNewsData(null);
                setAiResult(null);
                setUserComment("");
                setSelectedSentiment(null);
                setError("오늘 표시할 뉴스가 없습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchSessions = async () => {
        try {
            const response = await api.get('/simulation/sessions');

            if (isSuccess(response.data) && Array.isArray(response.data.data)) {
                return response.data.data;
            }
        } catch (error) {
            console.error("세션 목록 조회 실패:", error);
        }

        return [];
    };

    const pickSessionIdToUse = (list) => {
        const savedSid = localStorage.getItem("simulationSessionId");

        if (savedSid && list.some(s => String(s.sessionId) === String(savedSid))) {
            return Number(savedSid);
        }

        const active = list.find(s => String(s.status).toUpperCase() === "ACTIVE");
        if (active?.sessionId) return Number(active.sessionId);

        const sorted = [...list].sort((a, b) => {
            const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            if (ad !== bd) return bd - ad;
            return (Number(b.sessionId) || 0) - (Number(a.sessionId) || 0);
        });

        return sorted[0]?.sessionId ? Number(sorted[0].sessionId) : null;
    };

    const handleLogout = async () => {
        try {
            await api.post('/user/logout');
        } catch (e) {
            console.error("로그아웃 API 호출 실패", e);
        } finally {
            newsPageInitialized = false;
            localStorage.clear();
            navigate('/login');
        }
    };

    const handleNextNews = async () => {
        const token = getAccessToken();
        if (!token) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const sessionId = await getCurrentSessionId();
            if (!sessionId) return;

            const response = await api.post(`/simulation/sessions/${sessionId}/next-day`);

            if (isSuccess(response.data)) {
                // 날짜가 하루 넘어갔으므로 새 날짜의 뉴스 재조회
                const loaded = await fetchTodayNewsFromSession();

                if (!loaded) {
                    setNewsData(null);
                    setAiResult(null);
                    setUserComment("");
                    setSelectedSentiment(null);
                    setError("다음 날짜의 뉴스가 없습니다.");
                }
            } else {
                setError(response.data?.message || "다음 날짜로 이동하지 못했습니다.");
            }
        } catch (error) {
            console.error("next-day 호출 실패:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("인증이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.clear();
                navigate('/login');
            } else {
                setError(error.response?.data?.message || "다음 날짜 이동 중 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteLearning = async () => {
        const token = getAccessToken();
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const sessionId = await getCurrentSessionId();
            if (!sessionId) return;

            const response = await api.put(`/simulation/sessions/${sessionId}/complete`);

            if (isSuccess(response.data)) {
                navigate('/main');
            } else {
                alert(response.data?.message || "학습 종료 처리에 실패했습니다.");
            }
        } catch (error) {
            console.error("complete 호출 실패:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("인증이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.clear();
                navigate('/login');
            } else {
                alert(error.response?.data?.message || "학습 종료 중 오류가 발생했습니다.");
            }
        }
    };

    // 내 정보 수정하기 연동 (PATCH /user/me)
    const handleUpdateInfo = async () => {
        const updatePayload = {
            ...editData,
            password: editData.password || userInfo.password
        };

        try {
            const response = await api.patch('/user/me', updatePayload);

            if (isSuccess(response.data)) {
                alert("내 정보가 성공적으로 수정되었습니다.");
                setUserInfo(updatePayload);

                if (editData.password) {
                    localStorage.setItem("userPwd", editData.password);
                }

                setIsEditing(false);
                setShowPassword(false);
            }
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("인증이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.clear();
                navigate('/login');
                return;
            }

            const msg = error.response?.data?.message || "수정 중 오류가 발생했습니다.";
            alert(msg);
        }
    };

    const fetchTodayNewsFromSession = async () => {
        try {
            const sessions = await fetchSessions();
            if (!sessions.length) return false;

            const sessionId = pickSessionIdToUse(sessions);
            if (!sessionId) return false;

            const response = await api.get(`/simulation/sessions/${sessionId}/daily-data`);

            if (isSuccess(response.data)) {
                const todayNews = Array.isArray(response.data?.data?.todayNews)
                    ? response.data.data.todayNews
                    : [];

                // 현재 날짜에 표시할 뉴스가 없으면 false 반환
                if (todayNews.length === 0) {
                    console.warn("daily-data는 성공했지만 todayNews가 비어 있음");
                    return false;
                }

                // 이번 요구사항에서는 "현재 날짜의 대표 뉴스 1개 표시"만 유지
                // 따라서 첫 번째 뉴스만 사용
                const pickedNews = todayNews[0];

                if (pickedNews) {
                    setError(null);
                    setNewsData(pickedNews);
                    setAiResult(null);
                    setUserComment("");
                    setSelectedSentiment(null);
                    return true;
                }
            }
        } catch (error) {
            console.error("daily-data 뉴스 조회 실패:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        }
        return false;
    };

    // 1) newsData가 없을 때 조용히 return하지 말고 사용자에게 알려줘야 함
    // 2) 제출 중 상태를 따로 둬서 중복 클릭을 막아야 함
    // 3) 401/403이면 다른 API들과 동일하게 로그인 만료 처리 맞춰야 함
    // 4) 실패 로그에 newsId, status, data를 같이 찍어야 실제 디버깅 가능
    // AI 분석 제출 (POST /news/{newsId}/analyze)
    const handleSubmitOpinion = async () => {
        // 현재 표시 중인 뉴스가 없으면 제출 불가
        if (!newsData?.newsId) {
            alert("현재 분석할 뉴스가 없습니다.");
            return;
        }
        // 사용자가 호재(POSITIVE) 또는 악재(NEGATIVE)를 선택했는지 확인
        if (!selectedSentiment) {
            alert("호재 또는 악재를 먼저 선택해주세요.");
            return;
        }
        // 판단 근거 코멘트를 입력했는지 확인
        if (!userComment.trim()) {
            alert("판단 근거를 입력해주세요.");
            return;
        }
        // 로그인 토큰 확인 (없으면 로그인 페이지 이동)

        const token = getAccessToken();
        if (!token) {
            navigate('/login');
            return;
        }
        // 서버로 보낼 요청 데이터 생성
        // sentiment : 사용자가 선택한 호재/악재
        // reason : 사용자가 작성한 판단 근거
        const requestData = {
            sentiment: selectedSentiment,
            reason: userComment.trim()
        };

        try {
            // 의견 제출 진행 상태로 변경 (버튼 중복 클릭 방지)
            setSubmittingOpinion(true);

            // 뉴스 분석 API 호출
            // POST /news/{newsId}/analyze
            const response = await api.post(
                `/news/${newsData.newsId}/analyze`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 토큰
                        Accept: '*/*',
                        'Content-Type': 'application/json'
                    }
                }
            );
            // 서버 응답이 성공이면 AI 분석 결과 화면에 표시

            if (isSuccess(response.data)) {
                // AI 분석 결과 화면 반영
                setAiResult(response.data.data);
            } else {
                alert(response.data?.message || "분석에 실패했습니다.");
            }
        } catch (error) {
            // API 호출 실패 시 오류 정보 출력

            console.error("분석 실패:", {
                newsId: newsData?.newsId,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            // 인증 오류 발생 시 로그인 페이지 이동
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("인증이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.clear();
                navigate('/login');
            } else {
                alert(error.response?.data?.message || "분석 중 오류가 발생했습니다.");
            }
        } finally {
            // 제출 완료 후 제출 상태 해제
            setSubmittingOpinion(false);
        }
    };

    useEffect(() => {
        document.title = "NewsPin - News";

        const token = getAccessToken();
        if (!token) {
            navigate('/login');
            return;
        }

        fetchUserInfo();

        if (!newsPageInitialized) {
            newsPageInitialized = true;

            // 초기 진입 시 현재 세션의 daily-data 뉴스만 조회
            loadInitialNews();
        }
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

            {/* 뉴스 컨텐츠 */}
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-4 border-4 border-gray-400 flex-1 overflow-hidden">
                <div className="flex flex-col border-2 rounded-lg border-black p-1 md:flex-row pb-1 gap-2 h-[50%] shrink-2">
                    <div className="w-full md:w-1/3 border-2 border-gray-300 rounded-lg flex items-center justify-center p-4 h-full bg-gray-50">
                        <div className="text-3xl font-bold flex flex-col items-center gap-2">
                            <span className="text-green-700 uppercase font-jua">
                                {loading ? "LOADING..." : (newsData?.source || "NEWS SOURCE")}
                            </span>
                            <span className="text-sm text-gray-500 font-jua">{newsData?.articleDate}</span>
                        </div>
                    </div>
                    <div className="w-full md:w-9/10 flex flex-col h-full p-2">
                        <h2 className="text-xl font-bold mb-2 truncate font-jua">
                            {loading ? "뉴스를 가져오는 중입니다..." : (error ? error : newsData?.title || "데이터가 존재하지 않습니다.")}                        </h2>
                        <hr />
                        <div className="text-[15px] leading-relaxed text-gray-800 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 flex-1 font-jua mt-2">
                            <p className="whitespace-pre-wrap">
                                {loading ? "" : newsData?.content || "본문 내용을 불러올 수 없습니다."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 하단 분석 영역 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 overflow-hidden">
                    {/* 왼쪽: 입력부 */}
                    <div className="md:col-span-3 flex flex-col gap-3 h-full overflow-hidden">
                        <div className="flex gap-2 w-full items-center justify-center font-jua">
                            <button
                                onClick={() => setSelectedSentiment("POSITIVE")}
                                className={`flex-1 flex items-center justify-center gap-2 border-1 text-white active:scale-[0.98] transition-all rounded-lg font-semibold text-lg shadow-lg cursor-pointer ${selectedSentiment === "POSITIVE" ? "bg-blue-800 scale-105 ring-2 ring-blue-300" : "bg-blue-600 hover:bg-cyan-400"}`}
                            >
                                <img src={like} alt="like" className="w-8" />
                                <span>호재</span>
                            </button>

                            <button
                                onClick={() => setSelectedSentiment("NEGATIVE")}
                                className={`flex-1 flex items-center justify-center gap-2 border-1 text-white active:scale-[0.98] transition-all rounded-lg font-semibold text-lg shadow-lg cursor-pointer ${selectedSentiment === "NEGATIVE" ? "bg-red-800 scale-105 ring-2 ring-red-300" : "bg-red-500 hover:bg-rose-700"}`}
                            >
                                <img src={dislike} alt="dislike" className="w-8" />
                                <span>악재</span>
                            </button>
                        </div>

                        <div className="border-2 border-black rounded-lg p-1 bg-white flex-1 overflow-y-auto font-jua">
                            <div className="flex items-center gap-1 font-bold text-sm shrink-0">
                                💡 판단 근거 코멘트
                            </div>
                            <hr className='mt-1 pb-1' />
                            <textarea
                                value={userComment}
                                onChange={(e) => setUserComment(e.target.value)}
                                placeholder="판단 근거를 입력해주세요..."
                                className="w-full h-[80%] text-[13px] leading-snug text-gray-700 outline-none resize-none"
                            />
                        </div>
                        <div>
                            <button
                                onClick={handleSubmitOpinion}
                                disabled={submittingOpinion || !newsData?.newsId}
                                className={`w-full active:scale-[0.98] transition-all rounded-lg text-white p-1 font-bold flex items-center justify-center shadow-md shrink-0 font-jua
                                    ${submittingOpinion || !newsData?.newsId
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 cursor-pointer hover:bg-cyan-400'
                                    }`}
                            >
                                <img src={submit} alt="submit" className="w-6 mr-2" />
                                <p className='font-semibold'>
                                    {submittingOpinion ? '제출 중...' : '의견 제출'}
                                </p>
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-9 border-2 border-black rounded-lg p-1 bg-white flex flex-col h-full overflow-hidden font-jua">
                        <div className="flex items-center gap-1 shrink-0">
                            <img src={webAnalytics} alt="icon" className="w-6 h-6" />
                            <h3 className="font-bold text-xl">AI 분석 결과</h3>
                        </div>

                        <div className="border-2 border-gray-300 p-2 rounded-lg text-sm leading-relaxed flex-1 overflow-y-auto">
                            {!aiResult ? (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    의견을 제출하면 AI 분석 결과를 확인할 수 있습니다.
                                </div>
                            ) : (
                                <div className="animate-fadeIn">
                                    <div className="mb-6 p-3 bg-white rounded-lg border shadow-sm">
                                        <p className="font-bold text-blue-800 text-base mb-2">감성 분석 비교</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-2 rounded bg-blue-50">
                                                <p className="text-xs text-gray-500">나의 판단</p>
                                                <p className={`font-bold ${selectedSentiment === 'POSITIVE' ? 'text-blue-600' : 'text-red-600'}`}>
                                                    {selectedSentiment === 'POSITIVE' ? '호재' : '악재'}
                                                </p>
                                            </div>
                                            <div className="text-center p-2 rounded bg-indigo-50">
                                                <p className="text-xs text-gray-500">AI 판단</p>
                                                <p className={`font-bold ${aiResult.aiSentiment === 'POSITIVE' ? 'text-blue-600' : 'text-red-600'}`}>
                                                    {aiResult.aiSentiment === 'POSITIVE' ? '호재' : aiResult.aiSentiment === 'NEGATIVE' ? '악재' : '중립'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-center">
                                            <span className={`px-4 py-1 rounded-full text-white font-bold ${aiResult.correct ? "bg-green-500" : "bg-orange-500"}`}>
                                                {aiResult.correct ? "분석 일치!" : "분석 불일치"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg border shadow-sm">
                                        <p className="font-bold text-blue-800 text-base mb-2">AI 피드백</p>
                                        <p className="text-gray-800 text-[14px] whitespace-pre-wrap leading-relaxed">
                                            {aiResult.aiFeedback}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-20 mt-1 w-[50%] ml-60 items-center justify-center">
                            <button
                                // 버튼 클릭은 다음 뉴스 조회 의도이므로 true 전달
                                onClick={handleNextNews}
                                className="flex-1 flex items-center border-2 border-white justify-center gap-2 bg-blue-600 text-white active:scale-[0.98] transition-all rounded-lg font-semibold text-lg shadow-lg cursor-pointer hover:bg-cyan-500"
                            >
                                <img src={refresh} alt="refresh" className="w-8" />
                                <span>다음 뉴스</span>
                            </button>

                            <button onClick={handleCompleteLearning} className="flex-1 flex items-center border-2 border-white justify-center gap-2 bg-red-500 text-white active:scale-[0.98] transition-all rounded-lg font-semibold text-lg shadow-lg cursor-pointer hover:bg-rose-600">
                                <img src={exit} alt="exit" className="w-8" />
                                <span >학습종료</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* [내 정보 모달] - API 및 가시화 로직 연동 */}

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

                                {/* 비밀번호 필드 */}
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

export default News;