import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logout from '../assets/logout-1.png';
import refresh from '../assets/re.png';
import correction from '../assets/correction-tape.png';
import dashboard from '../assets/dashboard.png';
import bio from '../assets/bio-gas.png';
import it from '../assets/it.png';
import enter from '../assets/popcorn.png';
import distribution from '../assets/distribution.png';
import plane from '../assets/globe.png';
import cutlery from '../assets/cutlery.png';
const Portfolio = () => {
    const navigate = useNavigate();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // [추가] 정의되지 않았던 sections 데이터를 추가하여` 오류를 방지합니다. -> 추후 api 연동(?)
    const sections = [
        { title: '바이오', icon: <img src={bio} alt="bio" className='w-10 h-10' />, stocks: [{ name: '삼성바이오로직스', count: '10주', buy: '38,000', current: '48,800', profit: '+108,000' }, { name: '유한양행', profit: '0' }, { name: '한미약품', profit: '0' }, { name: '셀트리온', profit: '0' }] },
        { title: 'IT/테크', icon: <img src={it} alt="it" className='w-10 h-10' />, stocks: [{ name: '삼성전자', profit: '0' }, { name: '네이버', profit: '0' }, { name: 'LG CNS', profit: '0' }, { name: '삼성 SDS', profit: '0' }] },
        { title: '유통', icon: <img src={distribution} alt="" className='w-10 h-10' />, stocks: [{ name: 'SM 엔터테인먼트', profit: '0' }, { name: '롯데쇼핑', profit: '0' }, { name: '쇼박스', profit: '0' }, { name: '하이브', profit: '0' }] },
        { title: '여행', icon: <img src={plane} alt="plane" className='w-10 h-10' />, stocks: [{ name: '신세계푸드', profit: '0' }, { name: '교촌 F&B', profit: '0' }, { name: '더본코리아', profit: '0' }, { name: 'SPC 삼립', profit: '0' }] },
        { title: '외식/프랜차이즈', icon: <img src={cutlery} alt="cutlery" className='w-10 h-10' />, stocks: [{ name: '신세계푸드', profit: '0' }, { name: '교촌 F&B', profit: '0' }, { name: '더본코리아', profit: '0' }, { name: 'SPC 삼립', profit: '0' }] },
        { title: '문화/엔터테인먼트', icon: <img src={enter} alt="entertainment" className='w-10 h-10' />, stocks: [{ name: '신세계푸드', profit: '0' }, { name: '교촌 F&B', profit: '0' }, { name: '더본코리아', profit: '0' }, { name: 'SPC 삼립', profit: '0' }] }
    ];

    useEffect(() => {
        document.title = "NewsPin - Portfolio";
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
            <div className="w-full max-w-7xl bg-slate-50 rounded-2xl shadow-2xl p-4 flex flex-col gap-6 border-4 border-gray-400 flex-1 overflow-hidden font-jua">
                <div className="flex flex-1 gap-5 overflow-hidden">

                    {/* 1. 보유 종목 섹션 (좌측) */}
                    <div className="flex-[0.45] flex flex-col overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="p-3 border-b border-gray-600 bg-blue-600">
                            <h2 className="text-2xl flex items-center gap-2">
                                <img src={dashboard} alt="dashboard" className='w-10 h-10' />
                                <span className='text-white'>보유 종목 현황 </span>
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-300">
                            {sections.map((section, idx) => (
                                <div key={idx} className="group transition-all">
                                    <div className="sticky top-0 rounded-lg shadow-md bg-white/95 backdrop-blur-sm py-2 flex items-center gap-2 z-10 border-b border-gray-600 mb-2">
                                        <span className="text-xl">{section.icon}</span>
                                        <span className="font-bold text-lg text-gray-800">{section.title}</span>
                                    </div>

                                    <div className="overflow-hidden rounded-lg border border-gray-100 shadow-sm">
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
                    <div className="flex-[0.55] flex flex-col gap-6 overflow-hidden">

                        {/* 거래 내역 박스 */}
                        <div className="flex-[0.6] bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <span className="text-indigo-600">🔄</span> 최근 거래 내역
                                </h2>
                                <span className="text-sm text-gray-400 font-normal">최근 30일 기준</span>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <table className="w-full text-center border-collapse">
                                    <thead className="sticky top-0 bg-white shadow-sm text-gray-500">
                                        <tr className="h-12 border-b">
                                            <th>종목명</th>
                                            <th>거래대금</th>
                                            <th>거래량</th>
                                            <th>수익</th>
                                            <th>날짜</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="h-14 hover:bg-gray-50 transition-colors">
                                            <td className="font-bold">삼성바이오로직스</td>
                                            <td className="font-mono">53,000</td>
                                            <td>10</td>
                                            <td className="text-red-500 font-bold">+490,000</td>
                                            <td className="text-gray-400 text-xs font-mono">2021-03-03</td>
                                        </tr>
                                        <tr className="h-14 text-gray-300 italic"><td colSpan="5">추가 거래 내역이 없습니다.</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 하단 대시보드 */}
                        <div className="flex-[0.4] flex gap-6">
                            {/* 투자 환경 카드 */}
                            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-700 mb-4">
                                    <span className="p-1.5 bg-yellow-100 rounded-lg">📊</span> 투자 환경
                                </h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400">초기 자본</p>
                                        <p className="text-lg font-bold text-gray-800 underline decoration-yellow-300 underline-offset-4">5,000,000</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400">현재 잔고</p>
                                        <p className="text-lg font-bold text-indigo-600">5,490,000</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-400">남은 기간</p>
                                        <p className="text-lg font-bold text-red-500">D-50 <span className="text-xs font-normal text-gray-400">/ 90일</span></p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <div className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">운용 중</div>
                                    </div>
                                </div>
                            </div>

                            {/* 액션 버튼 그룹 */}
                            <div className="w-56 flex flex-col gap-3">
                                <button className="group flex-[1.2] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-100">
                                    <span className="text-2xl group-hover:rotate-180 transition-transform duration-500">📈</span>
                                    <span className="text-xl font-jua">투자하기</span>
                                </button>
                                <div className="flex flex-1 gap-2">
                                    <button className="flex-1 bg-white border-2 border-gray-200 hover:border-indigo-400 text-gray-600 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm">
                                        <img src={refresh} alt="reset" className="w-5 opacity-60" />
                                    </button>
                                    <button onClick={() => navigate('/main')} className="flex-[3] bg-gray-800 hover:bg-black text-white rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-gray-200">
                                        <span className="text-sm font-jua">🏠 홈으로</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 내 정보 모달 */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-white/60 flex justify-center items-center z-50">
                    <div className="bg-white rounded-3xl p-10 w-[500px] shadow-2xl flex flex-col font-jua">
                        <h2 className="text-5xl text-center mb-8">내 정보</h2>
                        <div className="space-y-6 mb-8 text-2xl">
                            <div>
                                <label className="block mb-2">아이디</label>
                                <input type="text" value="investingTrade" readOnly className="w-full border-2 border-black rounded-xl p-3 bg-white font-serif italic font-bold" />
                            </div>
                            <div>
                                <label className="block mb-2">비밀번호</label>
                                <input type="password" value="password123" readOnly className="w-full border-2 border-black rounded-xl p-3 bg-white font-serif italic font-bold" />
                            </div>
                            <div>
                                <label className="block mb-2">이메일</label>
                                <input type="email" value="newsanalyst35144@gmail.com" readOnly className="w-full border-2 border-black rounded-xl p-3 bg-white font-serif italic font-bold" />
                            </div>
                        </div>
                        <hr className="border-gray-300 mb-8" />
                        <div className="flex gap-4">
                            <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700">
                                <img src={correction} alt="correct" className='w-12' />
                                <span>수정하기</span>
                            </button>
                            <button onClick={() => setIsProfileModalOpen(false)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700">
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

export default Portfolio;