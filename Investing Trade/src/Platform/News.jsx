import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import like from '../assets/thumb-up.png';
import dislike from '../assets/dislike.png';
import submit from '../assets/submit.png';
import logout from '../assets/logout-1.png';
import refresh from '../assets/re.png';
import correction from '../assets/correction-tape.png';
import axios from 'axios';

axios.defaults.baseURL = 'http://52.78.151.56:8080';

const News = () => {
    const navigate = useNavigate();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // --- API 연동을 위한 상태(State) 추가 ---
    const [newsData, setNewsData] = useState(null); // 뉴스 데이터 저장
    const [userComment, setUserComment] = useState(""); // 사용자의 판단 근거
    const [selectedSentiment, setSelectedSentiment] = useState(null); // 호재/악재 선택
    const [aiResult, setAiResult] = useState(null); // AI 분석 결과 저장
    const [loading, setLoading] = useState(false);

    // 1. 랜덤 뉴스 불러오기 함수 (GET /news/random)
    const fetchRandomNews = async () => {
    setLoading(true);
    try {
        // [수정] localStorage에서 저장된 토큰을 가져와 헤더에 넣습니다.
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('/news/random', {
            headers: {
                Authorization: `Bearer ${token}` // [중요] 403 에러 방지용 인증 헤더
            }
        });

        if (response.data.status === "SUCCESS") {
            setNewsData(response.data.data);
            setAiResult(null); 
            setUserComment(""); 
            setSelectedSentiment(null);
        }
    } catch (error) {
        console.error("뉴스 로딩 실패:", error);
        // 에러 상세 내용을 alert에 띄워 백엔드 개발자와 소통하기 좋습니다.
        alert(`뉴스를 불러오는 중 오류가 발생했습니다: ${error.response?.status || error.message}`);
    } finally {
        setLoading(false);
    }
};

    // [수정] 페이지 진입 시 뉴스를 자동으로 가져오도록 호출 추가
    useEffect(() => {
        document.title = "NewsPin - News";
        fetchRandomNews(); 
    }, []);

    // 2. 의견 제출 함수 (POST /news/{newsId}/analyze)
    const handleSubmitOpinion = async () => {
    if (!selectedSentiment || !userComment) {
        alert("호재/악재 선택과 코멘트를 모두 입력해주세요.");
        return;
    }

    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(`/news/${newsData.newsId}/analyze`, {
            sentiment: selectedSentiment, // 백엔드 명세서에 따라 POSITIVE/NEGATIVE로 보낼지 확인 필요
            reason: userComment
        }, {
            headers: {
                Authorization: `Bearer ${token}` // [중요] 제출 권한 인증
            }
        });

        if (response.data.status === "SUCCESS") {
            setAiResult(response.data.data); 
        }
    } catch (error) {
        console.error("의견 제출 실패:", error);
        alert("분석 제출 중 오류가 발생했습니다.");
    }
};

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
                    </button> <span className='font-bold mb-2'>|</span>
                    <button onClick={() => navigate('/login')} className="hover:underline font-jua cursor-pointer">로그아웃</button>
                </div>
            </div>

            <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-4 border-4 border-gray-400 flex-1 overflow-hidden">

                {/* 1. 뉴스 상단부: API 데이터 연동 */}
                <div className="flex flex-col border-2 rounded-lg border-black p-1 md:flex-row pb-1 gap-2 h-[50%] shrink-2">
                    <div className="w-full md:w-1/3 border-2 border-gray-300 rounded-lg flex items-center justify-center p-4 h-full bg-gray-50">
                        <div className="text-3xl font-bold flex items-center gap-2">
                            <span className="text-green-700 uppercase font-jua">NEWS SOURCE</span>
                        </div>
                    </div>
                    <div className="w-full md:w-9/10 flex flex-col h-full">
                        <h2 className="text-xl font-bold mb-2 truncate font-jua">
                            {loading ? "로딩 중..." : newsData?.title}
                        </h2>
                        <hr />
                        <div className="text-[15px] leading-relaxed text-gray-800 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 flex-1 font-jua mt-2">
                            <p className="whitespace-pre-wrap">{newsData?.content}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 overflow-hidden">
                    <div className="md:col-span-3 flex flex-col gap-3 h-full overflow-hidden">
                        <div className="flex gap-2 w-full items-center justify-center font-jua">
                            <button
                                onClick={() => setSelectedSentiment("호재")}
                                className={`flex-1 flex items-center justify-center gap-2 border-1 text-white active:scale-[0.98] transition-all rounded-lg font-semibold text-lg shadow-lg cursor-pointer ${selectedSentiment === "호재" ? "bg-blue-800 scale-105 ring-2 ring-blue-300" : "bg-blue-600 hover:bg-cyan-400"}`}
                            >
                                <img src={like} alt="like" className="w-8" />
                                <span>호재</span>
                            </button>

                            <button
                                onClick={() => setSelectedSentiment("악재")}
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
                                className="w-full active:scale-[0.98] transition-all rounded-lg bg-blue-600 text-white rounded-lg p-1 font-bold flex items-center justify-center shadow-md cursor-pointer hover:bg-cyan-400 shrink-0 font-jua"
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
                                <>
                                    <div className="mb-4">
                                        <p className="font-bold text-blue-800">AI 감성 분석 결과:</p>
                                        <ul className="list-disc list-inside ml-2 text-gray-800">
                                            <li>AI 판단: <span className="font-bold text-indigo-600">{aiResult.aiSentiment}</span></li>
                                            <li>정답 여부: <span className={`font-bold ${aiResult.correct ? "text-green-600" : "text-red-600"}`}>
                                                {aiResult.correct ? "일치" : "불일치"}
                                            </span></li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="font-bold text-blue-800">AI 피드백:</p>
                                        <p className="text-gray-800 text-[13.5px] whitespace-pre-wrap">
                                            {aiResult.aiFeedback}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* [수정] 재학습 버튼에 fetchRandomNews 함수를 연결함 */}
                        <div className="flex gap-20 mt-1 w-[50%] ml-60 items-center justify-center">
                            <button 
                                onClick={fetchRandomNews}
                                className="flex-1 flex items-center border-2 border-white justify-center gap-2 bg-blue-600 border-1 text-white active:scale-[0.98] transition-all rounded-lg font-semibold text-lg shadow-lg cursor-pointer hover:bg-cyan-500"
                            >
                                <img src={refresh} alt="like" className="w-8" />
                                <span>재학습</span>
                            </button>

                            <button onClick={() => navigate('/invest')} className="flex-1 flex items-center border-2 border-white justify-center gap-2 bg-red-500 border-1 text-white active:scale-[0.98] transition-all rounded-lg font-semibold text-lg shadow-lg cursor-pointer hover:bg-rose-600">
                                <img src={logout} alt="dislike" className="w-8" />
                                <span >학습종료</span>
                            </button>
                        </div>
                    </div>
                </div>
                {isProfileModalOpen && (
                    <div className="fixed inset-0 bg-white/60 flex justify-center items-center z-50">
                        <div className="bg-white rounded-3xl p-10 w-[500px] shadow-2xl flex flex-col font-jua">
                            <h2 className="text-5xl text-center mb-8">내 정보</h2>

                            <div className="space-y-6 mb-8 text-2xl">
                                <div>
                                    <label className="block mb-2">아이디</label>
                                    <input
                                        type="text"
                                        value="investingTrade"
                                        readOnly
                                        className="w-full border-2 border-black rounded-xl p-3 bg-white font-serif italic font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">비밀번호</label>
                                    <input
                                        type="password"
                                        value="password123" 
                                        readOnly
                                        className="w-full border-2 border-black rounded-xl p-3 bg-white font-serif italic font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">이메일</label>
                                    <input
                                        type="email"
                                        value="newsanalyst35144@gmail.com" 
                                        readOnly
                                        className="w-full border-2 border-black rounded-xl p-3 bg-white font-serif italic font-bold"
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-300 mb-8" />

                            <div className="flex gap-4 space-x-6">
                                <button className="flex-1 bg-blue-600 text-white active:scale-[0.98] transition-all rounded-[2rem] border-solid border-white text-2xl cursor-pointer py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700">
                                    <img src={correction} alt="correct" className='w-12' />
                                    <span>수정하기</span>
                                </button>
                                <button
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="flex-1 bg-blue-600 cursor-pointer text-white text-2xl active:scale-[0.98] transition-all rounded-[2rem] border-solid border-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700"
                                >
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