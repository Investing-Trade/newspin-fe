import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react'; // useState 추가

const Password = () => {
  // 1. 인증 메일 전송 여부를 확인하는 상태
  const [isCodeSent, setIsCodeSent] = useState(false);

  // 페이지 접속 시 타이틀 변경
  useEffect(() => {
    document.title = "NewsPin - Password";
  }, []);

  // 2. useForm 초기화 (watch 추가)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: "onChange"
  });

  // 비밀번호 확인을 위한 값 감시
  const newPasswordValue = watch("newPassword");

  // 정규식 설정
  const authRegex = /^[a-zA-Z가-힣\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;

  // 3. 통합 제출 핸들러 (단계별 분기)
  const onSubmit = (data) => {
    if (!isCodeSent) {
      // [1단계] 이메일 인증 코드 전송
      console.log("인증 코드 전송 요청:", data.userId, data.email);
      alert("입력하신 이메일로 인증 코드가 전송되었습니다.");
      setIsCodeSent(true);
    } else {
      // [2단계] 비밀번호 재설정 (DB 전송)
      console.log("DB 비밀번호 업데이트 요청:", {
        userId: data.userId,
        authCode: data.authCode,
        newPassword: data.newPassword
      });
      alert("비밀번호가 성공적으로 변경되었습니다! 다시 로그인해주세요.");
      // window.location.href = "/login"; // 실제 로그인 페이지 이동 시 주석 해제
    }
  };

  // 실시간 테두리 스타일 결정 함수
  const getBorderStyle = (fieldName) => {
    if (errors[fieldName]) return 'border-red-500 bg-red-50 focus:ring-red-500';
    if (dirtyFields[fieldName] && !errors[fieldName]) return 'border-[#5D6DED] bg-blue-50 focus:ring-[#5D6DED]';
    return 'border-gray-200 bg-gray-50 focus:border-[#5D6DED]';
  };

  return (
<div className="w-screen h-screen flex items-center justify-center bg-white overflow-hidden">      
      {/* 부모 카드 (높이를 필드 수에 맞춰 조정) */}
      <div className="bg-white rounded-3xl border border-gray-200 flex flex-row items-stretch w-full max-w-5xl h-[750px] overflow-hidden shadow-2xl">
        
        {/* [왼쪽 섹션] */}
        <div className="flex-1 bg-blue-600 p-5 text-white flex flex-col justify-center items-center shrink-0">
          <h1 className="font-agbalumo text-6xl mb-40 pb-12 tracking-wider">NewsPin</h1>
          <div className="relative w-40 h-28 mb-6">
            <img src={predictiveAnalytics} alt="predictive" className="w-48 h-auto z-15 absolute left-2 bottom-24 drop-shadow-lg" />
            <img src={businessMan} alt="man" className="w-48 h-auto z-10 absolute right-26 drop-shadow-lg" />
            <img src={webAnalytics} alt="chart" className="w-48 h-auto z-10 absolute left-28 top-0" />
          </div>
          <div className='mt-12'>
            <p className="text-center text-lg font-semibold font-agbalumo leading-relaxed py-2">NewsPin은 뉴스 투자 학습 플랫폼입니다.</p>
            <p className="text-center text-lg font-semibold leading-relaxed py-1">경제 뉴스를 읽고 호재 및 악재를 판단하며,</p>
            <p className="text-center text-lg font-semibold leading-relaxed py-1">AI 피드백으로 분석 감각을 키워보세요.</p>
            <p className="text-center text-lg font-semibold leading-relaxed py-1">실제 데이터를 활용한 모의 투자로 안전한 학습을 경험할 수 있습니다.</p>            
          </div>
        </div>

        {/* [오른쪽 섹션] */}
        <div className="flex-1 p-12 flex flex-col justify-center bg-white shrink-0 ">
          <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">
            {isCodeSent ? "비밀번호 재설정" : "비밀번호 찾기"}
          </h2>
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* 아이디 필드 */}
            <div className="space-y-2">
              <p className='font-bold text-lg pb-1'>아이디</p>
              <input
                type="text"
                readOnly={isCodeSent}
                placeholder="아이디를 입력해주세요."
                {...register("userId", { required: "아이디를 입력해주세요." })}
                className={`w-full px-4 py-3 border rounded-lg outline-none text-sm transition-all font-bold ${getBorderStyle('userId')} ${isCodeSent ? 'bg-gray-100' : ''}`}
              />
              {errors.userId && <p className="text-red-500 text-xs font-bold">{errors.userId.message}</p>}
            </div>

            {/* 이메일 필드 */}
            <div className="space-y-2">
              <p className='font-bold text-lg pb-1'>이메일</p>
              <input
                type="text"
                readOnly={isCodeSent}
                placeholder="이메일을 입력해주세요."
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                  pattern: { value: emailRegex, message: "올바른 이메일 형식이 아닙니다. (@와 .com 포함)" }
                })}
                className={`w-full px-4 py-3 border rounded-lg outline-none text-sm transition-all font-bold ${getBorderStyle('email')} ${isCodeSent ? 'bg-gray-100' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs font-bold">{errors.email.message}</p>}
            </div>

            {/* 인증 코드 전송 버튼 */}
            {!isCodeSent && (
              <button type="submit" className="w-full bg-blue-600 border border-white text-lg cursor-pointer text-white font-bold py-3 rounded-lg mt-4 shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all">
                ✈️ 이메일로 인증 코드 전송
              </button>
            )}

            <hr className='text-gray-500 my-4' />

            {/* --- 인증 코드 전송 후 나타나는 영역 --- */}
            {isCodeSent && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className='font-bold text-lg pb-1 text-blue-600'>인증 코드 입력</p>
                  <input 
                    type="text" 
                    placeholder="인증 코드 6자리를 입력해주세요." 
                    {...register("authCode", { required: "인증 코드를 입력해주세요." })}
                    className={`w-full px-4 py-3 border rounded-lg outline-none text-sm font-bold ${getBorderStyle('authCode')}`}
                  />
                </div>

                <div className="space-y-2">
                  <p className='font-bold text-lg pb-1'>새로운 비밀번호</p>
                  <input 
                    type="password" 
                    placeholder="새로운 비밀번호를 입력해주세요." 
                    {...register("newPassword", { 
                      required: "새 비밀번호를 입력해주세요.",
                      pattern: { value: authRegex, message: "8자 이상 조합해주세요." }
                    })}
                    className={`w-full px-4 py-3 border rounded-lg outline-none text-sm font-bold ${getBorderStyle('newPassword')}`}
                  />
                  {errors.newPassword && <p className="text-red-500 text-xs font-bold">{errors.newPassword.message}</p>}
                </div>

                <div className="space-y-2">
                  <p className='font-bold text-lg pb-1'>새 비밀번호 확인</p>
                  <input 
                    type="password" 
                    placeholder="비밀번호를 다시 입력해주세요." 
                    {...register("newPasswordConfirm", { 
                      required: "확인을 위해 다시 입력해주세요.",
                      validate: (val) => val === newPasswordValue || "비밀번호가 일치하지 않습니다."
                    })}
                    className={`w-full px-4 py-3 border rounded-lg outline-none text-sm font-bold ${getBorderStyle('newPasswordConfirm')}`}
                  />
                  {errors.newPasswordConfirm && <p className="text-red-500 text-xs font-bold">{errors.newPasswordConfirm.message}</p>}
                </div>

                <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg mt-4 shadow-md hover:bg-green-700 active:scale-[0.98] transition-all">
                  ✅ 비밀번호 변경 완료
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Password;