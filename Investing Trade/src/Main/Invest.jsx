import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import headline from '../assets/headline.png';
import video from '../assets/video-lesson.png';
import invest from '../assets/invest.png';
import stock from '../assets/stock-market.png';
import exchange from '../assets/stock-exchange.png';
import portfolio from '../assets/pie-chart.png';
import logout from '../assets/logout.png';
import correction from '../assets/correction-tape.png';

const Invest = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 함수 선언
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // 모달 상태 관리를 위한 state
    useEffect(() => {
        document.title = "NewsPin - Invest";
    }, []);

    return (
        <div className="w-full min-h-screen bg-blue-700 flex flex-col items-center p-8 font-sans">

            {/* [상단 헤더 영역] 로고 및 상단 메뉴 */}
            <div className="w-full max-w-6xl flex justify-between items-start mb-14">
                <div className="flex items-center gap-4">

                    {/* 캐릭터 이미지와 로고 */}
                    <div className="relative w-108">
                        <img src={predictiveAnalytics} alt="analysis" className='absolute w-20 -top-12 left-21 drop-shadow-md' />
                        <img src={businessMan} alt="man" className="absolute w-20 left-4 drop-shadow-md" />
                        <img src={webAnalytics} alt="chart" className="absolute left-40 w-20 drop-shadow-md" />
                    </div>
                    <h1 className="text-white text-7xl font-agbalumo italic tracking-tight font-serif ml-4 justify-center items-center flex">NewsPin</h1>
                </div>

                <div className="text-white text-lg font-medium flex gap-4 pt-4">
                    {/* 2. 내 정보 클릭 시 모달 열기 */}
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="hover:underline font-jua cursor-pointer"
                    >
                        내 정보
                    </button>                    <span className='font-bold mb-2'>|</span>
                    <button onClick={() => {/* 로그아웃 로직 - 추후 구현 백엔드 연동 및 구현 필요*/ }} className="hover:underline font-jua cursor-pointer">로그아웃</button>
                </div>
            </div>

            {/* [중앙 카드 섹션] 3개 컬럼 배치 */}
            <div className="w-full max-w-6xl  grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* 1. 뉴스 학습 카드 */}
                <div className="bg-white border-white border-4 border-solid hover:bg-red-500 active:scale-[0.98] transition-all rounded-[2rem] p-10 flex flex-col items-center shadow-xl flex-1 cursor-pointer">
                    <h2 className="text-4xl mb-8 text-black font-jua  ">뉴스 학습</h2>
                    <div className="h-40 flex items-center mb-8 space-x-6">
                        {/* 전구 및 뉴스 아이콘 */}
                        <img src={headline} alt="headline" className='w-36' />
                        <img src={video} alt="video" className='w-32' />
                    </div>
                    <div className="space-y-4 text-left w-full text-xl px-2 mt-4 text-gray-800 break-keep cursor-pointer">
                        <p className='font-jua'>경제 뉴스로 주가 영향 요인을 분석</p>
                        <p className='font-jua'>기사에 대한 호재·악재 판단과 근거 작성</p>
                        <p className='font-jua'>AI 피드백으로 판단 정확도와 해석 능력 향상</p>
                    </div>
                </div>

                {/* 2. 모의 투자 카드 */}
                <div className="bg-white rounded-[2rem] border-4 hover:bg-green-500 active:scale-[0.98] transition-all rounded-[2rem] border-white border-solid p-10 flex flex-col items-center shadow-xl min-h-[550px] cursor-pointer">
                    <h2 className="text-4xl mb-8 text-black font-jua">모의 투자</h2>
                    <div className="h-40 flex items-center mb-8 space-x-6">
                        <img src={invest} alt="investing-trade" className='w-32' />
                        <img src={stock} alt="stock-market" className='w-32' />
                    </div>
                    <div className="space-y-4 text-left w-full text-xl text-gray-800 break-keep">
                        <p className='font-jua' >실제 주가 데이터를 활용한 가상 투자</p>
                        <p className='font-jua'>기간과 자금을 설정하고 종목 매수·매도</p>
                        <p className='font-jua'>AI가 투자 패턴과 뉴스 판단을 분석해 전략 개선 지원</p>
                    </div>
                </div>

                {/* 3. 내 포트폴리오 카드 */}
                <div className="bg-white rounded-[2rem] border-4  hover:bg-blue-400 active:scale-[0.98] transition-all rounded-[2rem] border-solid border-white p-10 flex flex-col items-center shadow-xl min-h-[550px] cursor-pointer">
                    <h2 className="text-4xl mb-8 text-black font-jua">내 포트폴리오</h2>
                    <div className="h-40 flex items-center mb-8 space-x-6">
                        <img src={portfolio} alt="portfolio" className='w-32' />
                        <img src={exchange} alt="exchange" className='w-32' />
                    </div>
                    <div className="space-y-4 text-left w-full text-xl text-gray-800 break-keep">
                        <p className='font-jua'>누적 투자 기록과 거래 내역 관리, 성과 시각화</p>
                        <p className='font-jua'>보유 종목, 손익 현황, 수익률 및 뉴스 판단 분석 제공</p>
                        <p className='font-jua'>AI가 투자 성향을 분석하고 맞춤형 피드백 제공</p>
                    </div>
                </div>
            </div>

            {/* 4. 내 정보 모달 UI 구현 */}
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
                                    value="password123" // 추후 변경
                                    readOnly
                                    className="w-full border-2 border-black rounded-xl p-3 bg-white font-serif italic font-bold"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">이메일</label>
                                <input
                                    type="email"
                                    value="newsanalyst35144@gmail.com" // 추후 변경
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
    );
};

export default Invest;