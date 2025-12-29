import React from 'react';
import businessMan from '../assets/bussiness-man.png'; 
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';

const Login = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white-800 py-3">
      
      {/* 부모 카드: 850px 너비 고정 및 가로 배치 */}
      <div className="bg-white rounded-3xl border border-gray-200 flex flex-row items-stretch w-full max-w-4xl h-[750px] overflow-hidden shadow-2xl">
        
        {/* [왼쪽 섹션] 브랜드 컬러와 서비스 소개 */}
        <div className="flex-1 bg-blue-600 p-10 text-white flex flex-col justify-center items-center shrink-0">
          <h1 className="text-6xl font-bold mb-40 tracking-wider">NewsPin</h1>
          
          {/* 이미지 레이어링: 상대 위치 조정 */}
          <div className="relative w-40 h-28 mb-6">
            <img src={predictiveAnalytics} alt="predictiveanalytics" className="w-48 h-auto z-15 absolute left-2 bottom-24 drop-shadow-lg" />
            <img 
              src={businessMan} 
              alt="man" 
              className="w-48 h-auto z-10 absolute right-26 drop-shadow-lg" 
            />
            <img 
              src={webAnalytics} 
              alt="chart" 
              className="w-48 h-auto z-10 absolute left-28 top-0" 
            />
          </div>

<div className='mt-8'>
            <p className="text-center text-lg font-semibold leading-relaxed py-2">NewsPin은 뉴스 기반 투자 학습 플랫폼입니다.</p>
            <p className="text-center text-lg font-semibold leading-relaxed py-1">경제 뉴스를 읽고 호재 및 악재를 판단하며,</p>
            <p className="text-center text-lg font-semibold leading-relaxed py-1">AI 피드백으로 분석 감각을 키워보세요.</p>            
            <p className="text-center text-lg font-semibold leading-relaxed py-1">실제 데이터를 활용한 모의 투자로 안전한 학습을 경험할 수 있습니다.</p>            
</div>
          
        </div>

        {/* [오른쪽 섹션] 로그인 폼 */}
        <div className="flex-1 p-12 flex flex-col justify-center bg-white shrink-0">
          <h2 className="text-5xl font-bold text-center mb-20 text-gray-800">로그인</h2>
          <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2 my-5">
                <p className='font-bold text-lg pb-1'>아이디</p>
              <label className=" font-bold text-gray-600 text-lg"> <input 
                type="text" 
                placeholder="아이디를 입력해주세요." 
                className="w-full px-4 py-3 text-2xl font-bold border border-gray-200 rounded-lg outline-none text-sm bg-gray-50 focus:border-[#5D6DED] focus:ring-1 focus:ring-[#5D6DED] transition-all"
              /></label>           
             
            </div>
            
            <div className="space-y-2">
            <p className='font-bold text-lg pb-1'>비밀번호</p>
              <label className="text-lg font-bold text-gray-600"><input 
                type="password" 
                placeholder="비밀번호를 입력해주세요." 
                className="w-full px-4 py-3 border font-bold border-gray-200 rounded-lg outline-none text-sm bg-gray-50 focus:border-[#5D6DED] focus:ring-1 focus:ring-[#5D6DED] transition-all"
              /></label>
              
            </div>

            <button className="w-full bg-blue-600 border border-white text-lg cursor-pointer text-white font-bold py-3 rounded-lg mt-4 shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all">
              ✈️ 투자 여정 시작하기
            </button>
            <div className="relative py-5">
          <hr className='text-gray-500 py-1' />
            </div>
          </form>

          <div className="flex justify-center gap-6 text-[10px]  text-gray-400 font-medium">
            <p className=" active:scale-[0.98] transition-all  hover:text-gray-600 hover:underline text-base mt-1 font-bold transition-colors cursor-pointer">회원가입</p>
            <span className="text-gray-500 text-lg">|</span>
            <p className=" active:scale-[0.98] transition-all  hover:text-gray-600 hover:underline text-base mt-1 font-bold transition-colors cursor-pointer">비밀번호 찾기</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;