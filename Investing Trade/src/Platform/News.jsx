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

const News = () => {
    const navigate = useNavigate();
    const API_BASE_URL = 'http://52.78.151.56:8080';
    const token = localStorage.getItem('accessToken');

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [newsData, setNewsData] = useState(null);
    const [userComment, setUserComment] = useState("");
    const [selectedSentiment, setSelectedSentiment] = useState(null);
    const [aiResult, setAiResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const [userInfo, setUserInfo] = useState({ userId: "", email: "", password: "" });
    const [editData, setEditData] = useState({ userId: "", email: "", password: "" });

    // 내 정보 불러오기 (GET /user/me)
    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status.toLowerCase() === "success") {
                const { userId, email } = response.data.data;
                const savedPwd = localStorage.getItem('userPwd') || "";
                const fetchedInfo = { userId, email, password: savedPwd };
                setUserInfo(fetchedInfo);
                setEditData(fetchedInfo);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    // 내 정보 수정하기 연동 (PATCH /user/me)
    const handleUpdateInfo = async () => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/user/me`, editData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status.toLowerCase() === "success") {
                alert("정보가 수정되었습니다.");
                setUserInfo({ ...editData });
                localStorage.setItem('userPwd', editData.password);
                setIsEditing(false);
                setShowPassword(false);
            }
        } catch (error) {
            alert(error.response?.data?.message || "수정 중 오류가 발생했습니다.");
        }
    };

    // 랜덤 뉴스 불러오기 (GET /news/random)
    const fetchRandomNews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/news/random`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status.toLowerCase() === "success") {
                setNewsData(response.data.data);

                // 새 뉴스를 가져올 때 이전 분석 결과 초기화
                setAiResult(null);
                setUserComment("");
                setSelectedSentiment(null);
            }
        } catch (error) {
            console.error("뉴스 로딩 에러:", error);
            alert("뉴스를 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 의견 제출 및 AI 분석 (POST /news/{newsId}/analyze)
    const handleSubmitOpinion = async () => {
        if (!newsData?.newsId) return;
        if (!selectedSentiment || !userComment.trim()) {
            alert("호재 or 악재 선택과 판단 근거를 모두 입력해주세요.");
            return;
        }

        const requestData = {
            sentiment: selectedSentiment, // 'POSITIVE' 또는 'NEGATIVE'
            reason: userComment.trim()
        };
        try {
            const response = await axios.post(
                `${API_BASE_URL}/news/${newsData.newsId}/analyze`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.status.toLowerCase() === "success") {
                setAiResult(response.data.data);
            }
        } catch (error) {
            alert(error.response?.data?.message || "분석 요청에 실패했습니다.");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/user/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (e) {
            console.error("로그아웃 API 호출 실패", e);
        } finally {
            localStorage.clear();
            navigate('/login');
        }
    };

    useEffect(() => {
        document.title = "NewsPin - News";
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUserInfo();
        fetchRandomNews();
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
                            setIsProfileModalOpen(true);
                            setIsEditing(false);
                        }}
                        className="hover:underline font-jua cursor-pointer"
                    >
                        내 정보
                    </button>
                    <span className='font-bold mb-2'>|</span>
                    <button onClick={handleLogout} className="hover:underline font-jua cursor-pointer">로그아웃</button>
                </div>
            </div>

            {/* 뉴스 및 분석 컨텐츠 영역 */}
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-4 border-4 border-gray-400 flex-1 overflow-hidden">
                {/* 뉴스 상단부 */}
                <div className="flex flex-col border-2 rounded-lg border-black p-1 md:flex-row pb-1 gap-2 h-[50%] shrink-2">
                    <div className="w-full md:w-1/3 border-2 border-gray-300 rounded-lg flex items-center justify-center p-4 h-full bg-gray-50">
                        <div className="text-3xl font-bold flex items-center gap-2">
                            <span className="text-green-700 uppercase font-jua">
                                {loading ? "LOADING..." : (newsData?.source || "NEWS SOURCE")}
                            </span>
                            <span className="text-sm text-gray-500 font-jua">{newsData?.articleDate}</span>
                        </div>
                    </div>
                    <div className="w-full md:w-9/10 flex flex-col h-full p-2">
                        <h2 className="text-xl font-bold mb-2 truncate font-jua">
                            {loading ? "뉴스를 가져오는 중입니다..." : newsData?.title || "뉴스가 없습니다."}
                        </h2>
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
                                className={`flex-1 flex items-center justify-center gap-2 border-1 text-white active:scale-[0.98] transition-all rounded-lg font-semibold text-lg shadow-lg cursor-pointer ${selectedSentiment === "호재" ? "bg-blue-800 scale-105 ring-2 ring-blue-300" : "bg-blue-600 hover:bg-cyan-400"}`}
                            >
                                <img src={like} alt="like" className="w-8" />
                                <span>호재</span>
                            </button>

                            <button
                                onClick={() => setSelectedSentiment("NEGATIVE")}
                                className={`flex-1 flex items-center justify-center gap-2 border-1 text-white active:scale-[0.98] transition-all rounded-lg font-semibold text-lg shadow-lg cursor-pointer ${selectedSentiment === "악재" ? "bg-red-800 scale-105 ring-2 ring-red-300" : "bg-red-500 hover:bg-rose-700"}`}
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
                                className="w-full active:scale-[0.98] transition-all rounded-lg bg-blue-600 text-white p-1 font-bold flex items-center justify-center shadow-md cursor-pointer hover:bg-cyan-400 shrink-0 font-jua"
                            >
                                <img src={submit} alt="submit" className="w-6 mr-2" />
                                <p className='font-semibold'>의견 제출</p>
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
                                onClick={fetchRandomNews}
                                className="flex-1 flex items-center border-2 border-white justify-center gap-2 bg-blue-600 text-white active:scale-[0.98] transition-all rounded-lg font-semibold text-lg shadow-lg cursor-pointer hover:bg-cyan-500"
                            >
                                <img src={refresh} alt="refresh" className="w-8" />
                                <span>다음 뉴스</span>
                            </button>

                            <button onClick={() => navigate('/main')} className="flex-1 flex items-center border-2 border-white justify-center gap-2 bg-red-500 text-white active:scale-[0.98] transition-all rounded-lg font-semibold text-lg shadow-lg cursor-pointer hover:bg-rose-600">
                                <img src={exit} alt="exit" className="w-8" />
                                <span >학습종료</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* [내 정보 모달] - API 및 가시화 로직 연동 */}

                {isProfileModalOpen && (
                    <div className="fixed inset-0 bg-white/60 flex justify-center items-center z-50">
                        <div className="bg-white rounded-3xl p-10 w-[500px] shadow-2xl flex flex-col font-jua">
                            <h2 className="text-5xl text-center mb-8">내 정보</h2>
                            <div className="space-y-6 mb-8 text-2xl">
                                <div>
                                    <label className="block mb-2">이메일(아이디)</label>
                                    <input
                                        type="text"
                                        value={userInfo.email}
                                        readOnly
                                        className="w-full border-2 border-black rounded-xl p-3 bg-white font-serif italic font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">비밀번호</label>
                                    <input
                                        type="password"
                                        value={userInfo.password}
                                        readOnly
                                        className="w-full border-2 border-black rounded-xl p-3 bg-white font-serif italic font-bold"
                                    />
                                </div>
                            </div>
                            <hr className="border-gray-300 mb-8" />
                            <div className="flex gap-4 space-x-6">
                                <button className="flex-1 bg-blue-600 text-white active:scale-[0.98] transition-all rounded-xl border-solid border-white text-2xl cursor-pointer py-2 flex items-center justify-center gap-2 hover:bg-indigo-700">
                                    <img src={correction} alt="correct" className='w-12' />
                                    <span>수정하기</span>
                                </button>
                                <button onClick={() => setIsProfileModalOpen(false)} className="flex-1 bg-blue-600 cursor-pointer text-white text-2xl active:scale-[0.98] transition-all rounded-xl border-solid border-white py-2 flex items-center justify-center gap-2 hover:bg-indigo-700">
                                    <img src={logout} alt="logout" className='w-12' />
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

export default News;