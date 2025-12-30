import businessMan from '../assets/bussiness-man.png'; 
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import {useForm} from 'react-hook-form';

const Password = () => {
  // 1. useForm 초기화
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 2. 로그인 제출 핸들러
  const onSubmit = (data) => {
    console.log("로그인 시도 데이터:", data);
    alert("로그인 성공!");
  };

  /*정규식 설명:
   [a-zA-Z가-힣\d@$!%*?&] : 영문, 한글, 숫자, 지정된 특수문자 허용
   * {8,} : 위 글자들의 조합으로 8자 이상
   */

  const authRegex = /^[a-zA-Z가-힣\d@$!%*?&]{8,}$/;
  return (
    <div className="w-full h-full flex items-center justify-center bg-white-800 mx-2 px-4  py-3">
      
      {/* 부모 카드: 850px 너비 고정 및 가로 배치 */}
      <div className="bg-white rounded-3xl border border-gray-200 flex flex-row items-stretch w-full max-w-4xl h-[750px] overflow-hidden shadow-2xl">
        
        {/* [왼쪽 섹션] 브랜드 컬러와 서비스 소개 */}
        <div className="flex-1 bg-blue-600 p-10 text-white flex flex-col justify-center items-center shrink-0">
          <h1 className="font-agbalumo text-6xl mb-40 tracking-wider">NewsPin</h1>
          
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

<div className='mt-16'>
            <p className="text-center text-lg font-semibold  font-agbalumo leading-relaxed py-2 px-2">NewsPin은 뉴스 기반 투자 학습 플랫폼입니다.</p>
            <p className="text-center text-lg font-semibold leading-relaxed py-1">경제 뉴스를 읽고 호재 및 악재를 판단하며,</p>
            <p className="text-center text-lg font-semibold leading-relaxed py-1">AI 피드백으로 분석 감각을 키워보세요.</p>            
            <p className="text-center text-lg font-semibold leading-relaxed py-1">실제 데이터를 활용한 모의 투자로 안전한 학습을 경험할 수 있습니다.</p>            
</div>
          
        </div>

        {/* [오른쪽 섹션] 로그인 폼 */}
        <div className="flex-1 p-12 flex flex-col justify-center bg-white shrink-0">
          <h2 className="text-5xl font-bold text-center mb-20 text-gray-800">로그인</h2>
          <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
            {/* 아이디 필드 */}
            <div className="space-y-2 my-5">
              <p className='font-bold text-lg pb-1'>아이디</p>
              <input 
                type="text" 
                placeholder="아이디를 입력해주세요." 
                {...register("userId", { 
                  required: "아이디를 입력해주세요.",
                  pattern: {
                    value: authRegex,
                    message: "8자 이상 입력해주세요. (영문, 한글, 숫자, 특수문자 조합 가능)"
                  }
                })}
                className={`w-full px-4 py-3 border rounded-lg outline-none text-sm transition-all font-bold ${
                  errors.userId ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-[#5D6DED]'
                }`}
              />
              {errors.userId && <p className="text-red-500 text-xs font-bold">{errors.userId.message}</p>}
            </div>
            
            {/* 비밀번호 필드 */}
            <div className="space-y-2">
              <p className='font-bold text-lg pb-1'>비밀번호</p>
              <input 
                type="password" 
                placeholder="비밀번호를 입력해주세요." 
                {...register("password", { 
                  required: "비밀번호를 입력해주세요.",
                  pattern: {
                    value: authRegex,
                    message: "8자 이상 입력해주세요. (영문, 한글, 숫자, 특수문자 조합 가능)"
                  }
                })}
                className={`w-full px-4 py-3 border rounded-lg outline-none text-sm transition-all font-bold ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-[#5D6DED]'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs font-bold">{errors.password.message}</p>}
            </div>

            <button type="submit" className="w-full bg-blue-600 border border-white text-lg cursor-pointer text-white font-bold py-3 rounded-lg mt-4 shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all">
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

export default Password;