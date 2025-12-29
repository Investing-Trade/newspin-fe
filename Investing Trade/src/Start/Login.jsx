import React, { useState } from 'react';
import businessMan from '../assets/bussiness-man.png'; 
import webAnalytics from '../assets/web-analytics.png';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    // 전체 화면 고정 및 중앙 정렬
    <div className="h-screen w-full flex items-center justify-center p-8 md:p-12">
      
      {/* 메인 카드: flex-row를 통해 무조건 가로로 배치 */}
      <div className="bg-white rounded-[2rem] border border-gray-300 shadow-2xl flex flex-row w-full max-w-5xl h-full max-h-[750px] overflow-hidden">
        
        {/* 왼쪽 섹션: 서비스 소개 (너비 50% 고정) */}
        <div className="w-1/2 bg-gradient-to-b from-[#5D6DED] to-[#7199F1] p-10 text-white flex flex-col justify-between">
          <div className="text-center">
            <h1 className="text-5xl font-agbalumo italic mb-8 leading-none">NewsPin</h1>
            
            {/* 이미지 레이아웃: 크기 축소 및 정렬 */}
            <div className="relative flex justify-center items-center h-44 mt-4">
              <div className='relative w-full flex justify-center items-end h-full'>
                <img 
                  src={businessMan} 
                  alt="business" 
                  className="w-20 z-20 absolute left-8 bottom-0 drop-shadow-2xl"
                />
                <img 
                  src={webAnalytics} 
                  alt="graph" 
                  className="w-20 z-10 drop-shadow-2xl opacity-95 translate-x-4"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <p className="text-lg font-medium leading-snug">
              <span className="font-agbalumo">NewsPin</span>은 뉴스 기반 투자 학습 플랫폼입니다.
            </p>
            <div className="text-sm opacity-90 leading-relaxed font-light">
              <p>경제 뉴스를 읽고 호재·악재를 판단하며,</p>
              <p>
                <span className="font-bold text-yellow-300">AI 피드백</span>으로 분석 감각을 키워보세요.
              </p>
              <p className="mt-2 text-xs opacity-75">실제 데이터를 활용한 모의 투자로 안전한 실전 학습을 경험할 수 있습니다.</p>
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션: 로그인 폼 (너비 50% 고정) */}
        <div className="w-1/2 p-12 flex flex-col justify-center bg-white">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 tracking-tighter">로그인</h2>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">아이디</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="아이디를 입력해주세요." 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5D6DED] outline-none transition-all text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">👁️</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">비밀번호</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="비밀번호를 입력해주세요." 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5D6DED] outline-none transition-all text-sm"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
                   <span>👁️</span><span>|</span><span>🚫</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 mt-6">
              <button className="w-full bg-[#6C7EEB] hover:bg-[#5A6CD1] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform">
                <svg className="w-5 h-5 fill-current rotate-12" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                <span className="text-lg">투자 여정 시작하기</span>
              </button>
            </div>
          </form>

          <div className="mt-8 flex justify-center items-center gap-6 text-sm font-bold text-gray-500">
            <button className="hover:text-indigo-600">회원가입</button>
            <span className="w-[1px] h-3 bg-gray-300"></span>
            <button className="hover:text-indigo-600">비밀번호 찾기</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;