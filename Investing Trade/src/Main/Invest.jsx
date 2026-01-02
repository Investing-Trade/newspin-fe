import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Invest = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "NewsPin - Invest";
    }, []);

    return (
        <div className="w-full min-h-screen bg-blue-700 flex flex-col items-center p-8 font-sans">

            {/* [상단 헤더 영역] 로고 및 상단 메뉴 */}
            <div className="w-full max-w-6xl flex justify-between items-start mb-14">
                <div className="flex items-center gap-4">

                    {/* 캐릭터 이미지와 로고 */}
                    <div className="relative w-108 h-24">
                        <img src={predictiveAnalytics} alt="analysis" className='w-20 absolute left-16 drop-shadow-md' />
                        <img src={businessMan} alt="man" className="absolute w-20 top-16 left-4 drop-shadow-md" />
                        <img src={webAnalytics} alt="chart" className="absolute pt-4 left-28 top-12 w-20 h-auto drop-shadow-md" />
                    </div>
                    <h1 className="text-white text-7xl font-agbalumo italic tracking-tight font-serif ml-4 justify-center items-center flex">NewsPin</h1>
                </div>

                <div className="text-white text-lg font-medium flex gap-4 pt-4">
                    <button onClick={() => navigate('/profile')} className="hover:underline font-jua cursor-pointer">내 정보</button>
                    <span className='font-bold mb-2'>|</span>
                    <button onClick={() => {/* 로그아웃 로직 */ }} className="hover:underline font-jua cursor-pointer">로그아웃</button>
                </div>
            </div>

            {/* [중앙 카드 섹션] 3개 컬럼 배치 */}
            <div className="w-full max-w-6xl  grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* 1. 뉴스 학습 카드 */}
                <div className="bg-white rounded-[2rem] p-10 flex flex-col items-center shadow-xl min-h-[550px] cursor-pointer">
                    <h2 className="text-4xl mb-8 text-black font-jua hover:bg-blue-700 active:scale-[0.98] transition-all">뉴스 학습</h2>
                    <div className="h-40 flex items-center mb-8">
                        {/* 전구 및 뉴스 아이콘 (예시) */}
                        <span className="text-8xl font-jua">💡📰</span>
                    </div>
                    <div className="space-y-4 text-left w-full text-xl px-2 mt-4 text-gray-800 break-keep cursor-pointer">
                        <p className='font-jua'>경제 뉴스로 주가 영향 요인을 분석</p>
                        <p className='font-jua'>기사에 대한 호재·악재 판단과 근거 작성</p>
                        <p className='font-jua'>AI 피드백으로 판단 정확도와 해석 능력 향상</p>
                    </div>
                </div>

                {/* 2. 모의 투자 카드 */}
                <div className="bg-white rounded-[2rem] p-10 flex flex-col items-center shadow-xl min-h-[550px] cursor-pointer">
                    <h2 className="text-4xl mb-8 text-black font-jua">모의 투자</h2>
                    <div className="h-40 flex items-center mb-8">
                        <img src={predictiveAnalytics} alt="invest" className="w-32 h-auto" />
                    </div>
                    <div className="space-y-4 text-left w-full text-xl text-gray-800 break-keep">
                        <p className='font-jua' >실제 주가 데이터를 활용한 가상 투자</p>
                        <p className='font-jua'>기간과 자금을 설정하고 종목 매수·매도</p>
                        <p className='font-jua'>AI가 투자 패턴과 뉴스 판단을 분석해 전략 개선 지원</p>
                    </div>
                </div>

                {/* 3. 내 포트폴리오 카드 */}
                <div className="bg-white rounded-[2rem] p-10 flex flex-col items-center shadow-xl min-h-[550px] cursor-pointer">
                    <h2 className="text-4xl mb-8 text-black font-jua">내 포트폴리오</h2>
                    <div className="h-40 flex items-center mb-8">
                        <span className="text-8xl">📊📈</span>
                    </div>
                    <div className="space-y-4 text-left w-full text-xl text-gray-800 break-keep">
                        <p className='font-jua'>누적 투자 기록과 거래 내역 관리, 성과 시각화</p>
                        <p className='font-jua'>보유 종목, 손익 현황, 수익률 및 뉴스 판단 분석 제공</p>
                        <p className='font-jua'>AI가 투자 성향을 분석하고 맞춤형 피드백 제공</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Invest;