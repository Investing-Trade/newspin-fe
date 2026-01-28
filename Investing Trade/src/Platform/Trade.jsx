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
import trade from '../assets/trade.png';
import trading from '../assets/trading.png';
import selling from '../assets/selling.png';
import write from '../assets/write-review.png';
import it from '../assets/it.png';
import popcorn from '../assets/popcorn.png';
import cutlery from '../assets/cutlery.png';
import buy from '../assets/buy-button.png';
import bio from '../assets/bio-gas.png';
import earning from '../assets/earning.png';
import input from '../assets/input.png';
import start from '../assets/start.png';
import review from '../assets/write-review.png';

const Trade = () => {
    const navigate = useNavigate();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    useEffect(() => {
        document.title = "NewsPin - Trading Dashboard";
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

                {/* --- 레이아웃 배치 수정 영역 시작 --- */}
                <div className="flex flex-1 gap-6 overflow-hidden">

                    {/* === [좌측 영역] 투자 설정(상) + 차트(하) === */}
                    <div className="flex-[1.2] flex flex-col gap-4 overflow-hidden">

                        {/* 1. 투자 환경 설정 */}
                        <div className="border-2 border-gray-300 rounded-lg p-2 relative bg-white shrink-0">
                            <div className="flex items-center gap-3 mb-3">
                                <img src={input} alt="input" className='w-8 h-8' />
                                <h3 className="text-lg font-semibold ">투자 환경 설정</h3>
                                <button className="flex hover:bg-blue-600 active:scale-[0.90] transition-all bg-blue-400 border-1 border-black cursor-pointer shadow-lg font-semibold text-white text-sm px-2 py-1 rounded-md items-center gap-2">
                                    <img src={start} alt="start" className='w-5 h-5' />
                                    <span>투자 시작</span>
                                </button>
                                <div className="ml-auto flex items-center gap-1 text-sm font-bold">
                                    <img src={earning} alt="earn" className='w-8 h-8' />
                                    <span>금액 - 최대 1000만원까지</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 font-jua text-sm">
                                <span className="font-bold">시작날짜</span>
                                <input type="text" value="2021-03-01" readOnly className="border border-gray-400 rounded px-2 w-28 text-center" />
                                <span className="font-bold">종료날짜</span>
                                <input type="text" value="2021-05-31" readOnly className="border border-gray-400 rounded px-2 w-28 text-center" />
                                <span className="font-bold">금액</span>
                                <input type="text" value="5,000,000" readOnly className="border border-gray-400 rounded px-2 w-24 text-right" />
                            </div>
                        </div>

                        {/* 3. 차트 정보 및 거래 -> 추후 api 연동 */}
                        <div className="flex-1 border-2 border-gray-300 rounded-lg p-3 flex flex-col bg-white overflow-hidden">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <img src={trading} alt="dashboard" className='w-10 h-10' />
                                    <h3 className="font-bold text-lg">차트 정보 및 거래</h3>
                                </div>
                                <div className="border border-gray-400 rounded-sm px-3 py-1 text-sm font-bold bg-gray-50">
                                    현재 날짜 : 2021-03-03
                                </div>
                            </div>

                            <div className="flex flex-1 gap-4 overflow-hidden mb-3">
                                <div className="flex-1 border-2 border-slate-700 rounded-lg flex items-end justify-around p-4 bg-gray-50 relative">
                                    <div className="w-6 bg-green-500 h-[60%] relative"><div className="absolute -top-4 left-1/2 w-px h-[120%] bg-green-500 -translate-x-1/2 -z-0"></div></div>
                                    <div className="w-6 bg-red-500 h-[40%] relative"><div className="absolute -top-2 left-1/2 w-px h-[140%] bg-red-500 -translate-x-1/2 -z-0"></div></div>
                                    <div className="w-6 bg-green-500 h-[75%] relative"><div className="absolute -top-6 left-1/2 w-px h-[110%] bg-green-500 -translate-x-1/2 -z-0"></div></div>
                                    <div className="w-6 bg-red-500 h-[50%] relative"><div className="absolute -top-3 left-1/2 w-px h-[130%] bg-red-500 -translate-x-1/2 -z-0"></div></div>
                                </div>
                                <div className="w-44 border border-gray-400 rounded p-2 text-[10px] font-jua leading-tight bg-gray-50">
                                    <p className="font-bold border-b mb-1">← [차트 정보 및 거래 - 정보 개요도]</p>
                                    <ul className="list-disc list-inside space-y-0.5">
                                        <li>종목명</li><li>주문 가격</li><li>거래 대금</li><li>거래량</li><li>거래 수량</li><li>총 거래 금액</li><li>현재가 및 등락률</li><li>거래 일자 (현재 날짜)</li><li>평가 손익</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t pt-2 shrink-0">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <img src={trade} alt="trade" className='w-8 h-8' />
                                        <span className="font-bold text-xs">매수 / 매도</span>
                                        <span className="text-sm ml-auto font-semibold">잔액
                                            <span className="border rounded-sm border-gray-400 px-2 py-0.5 ml-1">3,950,000 원</span></span>
                                    </div>
                                    <div className="text-[12px] font-bold mb-3 mt-5">종목 선택</div>
                                    <div className="flex gap-3 text-[8px] mb-2">
                                        <img src={bio} alt="bio" className='w-7 h-7' /><span className='font-bold text-[10px] mt-1'>바이오</span>
                                        <img src={it} alt="it" className='w-7 h-7' /><span className='font-bold text-[10px] mt-1'>IT/테크</span>
                                        <img src={popcorn} alt="popcorn" className='w-7 h-7' /><span className='font-bold text-[10px] mt-1'>엔터</span>
                                        <img src={cutlery} alt="cutlery" className='w-7 h-7' /><span className='font-bold text-[10px] mt-1'>외식</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1">
                                        <select className="border text-[9px] font-bold rounded">
                                            <option>셀트리온</option>
                                            <option>한미약품</option>
                                            <option>유한양행</option>
                                            <option>삼성바이오로직스</option>
                                        </select>
                                        <select className="border text-[9px] font-bold rounded">
                                            <option>삼성전자</option>
                                            <option>네이버</option>
                                            <option>LG CNS</option>
                                            <option>삼성 SDS</option>
                                        </select>
                                        <select className="border text-[9px] font-bold rounded">
                                            <option>CGV</option>
                                            <option>SM</option>
                                        </select>
                                        <select className="border text-[9px] font-bold rounded">
                                            <option>신세계푸드</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col ml-20 gap-1 items-end text-xs font-jua">
                                    <div className="flex w-full justify-between items-center"><span className="font-bold">종목</span> <span className="border border-gray-400 px-4 rounded bg-white">셀트리온</span></div>
                                    <div className="flex w-full justify-between items-center"><span className="font-bold">거래 대금</span> <span className="border border-gray-400 px-4 rounded bg-white font-mono">58,000 원</span></div>
                                    <div className="flex w-full justify-between items-center"><span className="font-bold">거래량</span> <div className="flex items-center gap-1"><span className="border border-gray-400 px-4 rounded bg-white">10</span><span>주</span></div></div>
                                    <div className="flex w-full justify-between items-center"><span className="font-bold">총 가격</span> <span className="border border-gray-400 px-4 rounded bg-white font-mono">580,000 원</span></div>
                                    <div className="flex gap-2 w-full mt-2">
                                        <button className="ml-9 w-[38%] px-1 cursor-pointer gap-2 flex hover:bg-blue-700 active:scale-[0.90] transition-all bg-blue-600 text-white rounded-md py-1 font-bold shadow-md hover:bg-blue-800"><img src={buy} alt="buy" className='w-8 h-8' /><span className='mt-2 text-[16px] ml-1'>매수</span></button>
                                        <button className="w-[38%] px-1 cursor-pointer gap-2 flex hover:bg-red-700 active:scale-[0.90] transition-all bg-red-500 text-white rounded-md py-1 font-bold shadow-md hover:bg-red-700"><img src={selling} alt="sell" className='w-8 h-8' /><span className='mt-2 text-[16px] ml-1'>매도</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === [우측 영역] 뉴스 기사(상) + 피드백(하) === */}
                    <div className="flex-1 flex flex-col gap-4 overflow-hidden">

                        {/* 2. 뉴스 기사 -> 추후 api 연동 */}
                        <div className="flex-1 border-2 border-gray-400 rounded-lg p-1 flex flex-col bg-white overflow-hidden">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">📋</span>
                                <h3 className="font-bold text-lg">뉴스 기사</h3>
                                <span className="text-sm font-bold ml-auto truncate">코로나19에도 '위기가 곧 기회' 외친 국내 제약사들</span>
                            </div>
                            <div className="border border-gray-400 rounded-lg p-3 flex-1 overflow-y-auto text-xs leading-relaxed font-jua">
                                <div className="flex gap-4 mb-3 pb-2">
                                    <div className="w-full md:w-1/3 border-2 border-gray-300 rounded-lg flex items-center justify-center p-4 h-full bg-gray-50">
                                        <div className="text-2xl font-bold flex items-center">
                                            <span className="text-green-600 uppercase">GC Biopharma</span>
                                        </div>
                                    </div>
                                    <p className="font-bold text-lg mt-2">국내 주요 제약사들이 2021년 신축년 새해 다짐을 예년과 달리 온라인으로 간소화했지만 혁신과 성장을 향한 외침에는 변함이 없었다.</p>
                                </div>
                                <p className="mb-3">국내 주요 제약사들이 2021년 신축년 새해 다짐을 예년과 달리 별도의 행사 없이 온라인으로 간소화했지만 혁신과 성장을 위한 외침에는 변함이 없었다.</p>
                                <p className="mb-3">지난해에 이어 올해도 코로나19(COVID-19) 팬데믹이 여전하지만 '위기가 곧 기회'라는 자세로 성장동력 발굴, 스마트 경영, 제약강국 실현 등의 의지 다진 것이다.</p>
                                <p className="mb-3">단, 코로나19의 여파로 대부분의 제약사가 온라인으로 신년인사를 대체한 것이 올해 시무식 공통적인 특징이다. GC녹십자는 '어려울 때 꼭 필요한 회사가 되자'는 다짐을 통해 올해 첫 근무를 시작했다.</p>
                                <p>GC녹십자 허은철 사장은 "예고 없이 찾아오는 위기에 대응하고 기회를 놓치지 않기 위해 늘 성실히 준비하는 행동을 바탕으로 내실 있는 회사가 돼야 한다"며 "포스트 코로나 시대를 대비하고 시대적 요청에 부응하는 회사가 되도록 항상 깨어 있어야 한다"고 강조했다.</p>
                            </div>
                        </div>

                        {/* 4. 투자 결과 및 피드백 -> 추후 api 연동 */}
                        <div className="flex-0.8 border-2 border-gray-400 rounded-lg p-2 bg-white flex flex-col overflow-hidden">
                            <div className="flex items-center gap-2 mb-2">
                                <img src={review} alt="review" className='w-10 h-10' />
                                <h3 className="font-bold text-lg">투자 결과 및 피드백</h3>
                            </div>
                            <div className="border border-gray-400 rounded-lg p-3 flex-1 overflow-y-auto text-[11px] leading-snug font-jua space-y-2">
                                <p><span className="font-bold text-blue-700">뉴스 감성 vs 시장 현실:</span> GC녹십자의 신년사는 '위기 극복 및 성장 의지'라는 장기적 호재성 메시지를 담았으나, 당시 시장은 연말 급등에 대한 부담을 반영한 것으로 분석됩니다.</p>
                                <hr />
                                <p><span className="font-bold text-green-700">학습 교훈:</span> 제약/바이오 업종은 경영 비전보다 임상 결과, 백신/치료제 개발 진척도 등 단기 재료에 더 민감하게 반응합니다.</p>
                                <hr />
                                <p><span className="font-bold text-orange-600">다음 투자 제언:</span> 이 뉴스의 장기적 비전이 실제로 실현되는지 확인하기 위해 3개월 또는 6개월 후의 주가 변화를 재검증하거나 관련 연구 성과 기사를 찾아보세요.</p>
                            </div>
                        </div>
                    </div>

                </div>
                {/* --- 레이아웃 배치 수정 영역 끝 --- */}

                {/* 최하단 네비게이션 버튼 바 (위치 유지) */}
                <div className="flex justify-between items-center px-4 pt-2 border-t mt-auto shrink-0 font-jua">
                    <div className="flex gap-3">
                        <button className="cursor-pointer bg-sky-500 text-white hover:bg-amber-200 active:scale-[0.90] transition-all px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:bg-cyan-400">
                            <span className="text-lg">📅</span> 다음 날짜
                        </button>
                        <button onClick={() => navigate('/invest')} className="cursor-pointer hover:bg-blue-700 active:scale-[0.90] transition-all bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:bg-violet-500">
                            <span className="text-lg">🏠</span> 메인 화면 이동
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-slate-700 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-400 active:scale-[0.90] text-xs font-bold flex items-center gap-2 shadow-md">
                            <span className="text-lg">📊</span> 투자 결과 및 피드백
                        </button>
                        <button onClick={() => navigate('/portfolio')} className="bg-blue-600 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-600 active:scale-[0.90] text-xs font-bold flex items-center gap-2 shadow-md hover:bg-blue-800">
                            <span className="text-lg">📍</span> 내 포트폴리오로 이동
                        </button>
                    </div>
                </div>

                {/* 내 정보 모달 UI 유지 */}
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
                            <div className="flex gap-4 space-x-6">
                                <button className="flex-1 bg-blue-600 text-white active:scale-[0.98] transition-all rounded-[2rem] border-solid border-white text-2xl cursor-pointer py-2 rounded-xl flex items-center justify-center gap-2 hover:indigo-700">
                                    <img src={correction} alt="correct" className='w-12' />
                                    <span>수정하기</span>
                                </button>
                                <button onClick={() => setIsProfileModalOpen(false)} className="flex-1 bg-blue-600 cursor-pointer text-white text-2xl active:scale-[0.98] transition-all rounded-[2rem] border-solid border-white py-2 rounded-xl flex items-center justify-center gap-2 hover:indigo-700">
                                    <img src={logout} alt="logout" className='w-12' />
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