import React, { useState } from 'react';
import businessMan from '../assets/bussiness-man.png'; 
import webAnalytics from '../assets/web-analytics.png';

const Login = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      
      {/* 카드 높이를 200px까지 더 줄여서 안정성을 극대화했습니다. */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-md flex flex-row w-full max-w-lg h-[200px] overflow-hidden">
        
        {/* 왼쪽 섹션: 이미지 비중을 줄이고 텍스트를 위로 올림 */}
        <div className="w-1/3 bg-gradient-to-b p-3 text-white flex flex-col justify-center items-center">
          <h1 className=" font-agbalumo italic">NewsPin</h1>
          
          {/* 이미지 영역: 아이콘 수준(h-4)으로 축소 */}
          <div className="relative w-8 h-4 my-4">
            <img 
              src={businessMan} 
              alt="man" 
              className="w-4 z-20 left-0 bottom-0 drop-shadow-sm" 
            />
            <img 
              src={webAnalytics} 
              alt="chart" 
              className="w-7 z-10 opacity-70 translate-x-1.5" 
            />
          </div>

          <p className="text-bold opacity-90 text-center font-light leading-tight">
            NewsPin은 뉴스 기반 투자 학습 플랫폼입니다.
            <br />
            경제 뉴스를 읽고 호제 및 악재를 판단하며,
            <br />
            AI 피드백으로 분석 감각을 키워보세요.
            <br />
            실제 데이터를 활용한 모의 투자로 안전한 실전 학습을 경험할 수 있습니다.
          </p>
        </div>

        {/* 오른쪽 섹션: 입력 폼의 패딩과 여백을 최소화 */}
        <div className="w-2/3 p-4 flex flex-col justify-center bg-white">
          <h2 className="text-sm font-bold text-center mb-3 text-gray-800 tracking-tighter">LOGIN</h2>
          
          <form className="space-y-1" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="아이디" 
              className="w-full px-2 py-1 border border-gray-100 rounded outline-none text-[9px] bg-gray-50 focus:border-[#5D6DED]"
            />
            <input 
              type="password" 
              placeholder="비밀번호" 
              className="w-full px-2 py-1 border border-gray-100 rounded outline-none text-[9px] bg-gray-50 focus:border-[#5D6DED]"
            />
            <button className="w-full bg-[#6C7EEB] text-white font-bold py-1.5 rounded text-[9px] mt-1 hover:bg-[#5A6CD1] active:scale-95 transition-transform">
              시작하기
            </button>
          </form>

          {/* 하단 보조 링크 */}
          <div className="mt-2.5 flex justify-center gap-2 text-[6px] text-gray-400">
            <button className="hover:underline">회원가입</button>
            <span className="text-gray-200">|</span>
            <button className="hover:underline">정보 찾기</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;