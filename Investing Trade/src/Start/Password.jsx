import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import paperplane from '../assets/paper-plane.png';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';

const Password = () => {
  // 1. 인증 메일 전송 여부를 확인하는 상태
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(""); // 생성된 코드 저장용 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // [수정] loading 대신 에러가 발생했던 이 변수명을 사용합니다.

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
  const onSubmit = async (data) => {
    if (!isCodeSent) {
      // [1단계] 인증 코드 생성 및 이메일 발송
      setIsSubmitting(true);
      
      // 6자리 무작위 코드 생성 (100000 ~ 999999)
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(randomCode);

      // EmailJS에 보낼 파라미터 (템플릿 변수명과 일치해야 함)
      const templateParams = {
        to_email: data.email,
        to_name: data.userId,
        auth_code: randomCode,
      };

      try {
        // 실제 발송 시 아래 주석을 해제하고 ID들을 입력하세요.
        /*
        await emailjs.send(
          'YOUR_SERVICE_ID', 
          'YOUR_TEMPLATE_ID', 
          templateParams, 
          'YOUR_PUBLIC_KEY'
        );
        */
        
        console.log("발송된 인증코드(테스트용):", randomCode);
        alert(`입력하신 ${data.email}로 인증 코드가 발송되었습니다.`);
        setIsCodeSent(true);
      } catch (error) {
        alert("이메일 전송에 실패했습니다. 다시 시도해 주세요.");
        console.error("EmailJS Error:", error);
      } finally {
        setIsSubmitting(false);
      }

    } else {
      // [2단계] 코드 검증 및 비밀번호 변경
      if (data.authCode !== generatedCode) {
        alert("인증 코드가 일치하지 않습니다. 다시 확인해 주세요.");
        return;
      }

      // 비밀번호 변경 성공 시뮬레이션 (DB 연동 지점)
      console.log("비밀번호 변경 완료:", {
        userId: data.userId,
        newPassword: data.newPassword
      });
      
      alert("비밀번호가 성공적으로 변경되었습니다! 로그인 화면으로 이동합니다.");
      window.location.href = "/login";
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
            <img src={predictiveAnalytics} alt="predictive" className="w-48 h-auto z-15 absolute left-2 bottom-30 drop-shadow-lg" />
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
          <h2 className="text-5xl font-jua text-center mb-8 text-gray-800">
            {isCodeSent ? "비밀번호 재설정" : "비밀번호 찾기"}
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* 아이디 필드 */}
            <div className="space-y-3">
              <p className='font-jua text-lg pb-1'>아이디</p>
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
              <p className='font-jua text-lg pb-1'>이메일</p>
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

            {!isCodeSent && <hr className='text-gray-500 my-8' />}

            {/* 인증 코드 전송 버튼 */}
            {!isCodeSent && (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full bg-blue-600 border border-white text-lg cursor-pointer text-white font-jua py-3 rounded-lg mt-4 shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all ${isSubmitting ? 'opacity-50' : ''}`}
              >
                {isSubmitting ? "발송 중..." : "📩 이메일로 인증 코드 전송"}
              </button>
            )}


            {/* --- 인증 코드 전송 후 나타나는 영역 --- */}
            {isCodeSent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className='font-bold font-jua text-lg pb-1 text-blue-600'>인증 코드 입력</p>
                  <input
                    type="text"
                    placeholder="인증 코드 6자리를 입력해주세요."
                    {...register("authCode", { required: "인증 코드를 입력해주세요." })}
                    className={`w-full px-4 py-3 border rounded-lg outline-none text-sm font-bold ${getBorderStyle('authCode')}`}
                  />
                </div>

                <div className="space-y-2">
                  <p className='font-jua text-lg pb-1'>새로운 비밀번호</p>
                  <input
                    type="password"
                    placeholder="새로운 비밀번호를 입력해주세요."
                    {...register("newPassword", {
                      required: "새 비밀번호를 입력해주세요.",
                      pattern: { value: authRegex, message: "8자 이상 입력해주세요. (영문, 한글, 숫자, 특수문자 조합 가능)" }
                    })}
                    className={`w-full px-4 py-3 border rounded-lg outline-none text-sm font-bold ${getBorderStyle('newPassword')}`}
                  />
                  {errors.newPassword && <p className="text-red-500 text-xs font-bold">{errors.newPassword.message}</p>}
                </div>

                <div className="space-y-2">
                  <p className='font-jua text-lg pb-1'>비밀번호 확인</p>
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

                {/* [수정] 중첩된 form 태그를 삭제하고 버튼만 남겼습니다 */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex flex-row items-center justify-center gap-2 cursor-pointer bg-blue-600 text-white font-jua py-3 rounded-lg shadow-md hover:bg-blue-500 active:scale-[0.98] transition-all"
                >
                  <img src={paperplane} alt="plane" className="w-6 h-auto" />
                  <span className="leading-none">{isSubmitting ? "변경 중..." : "비밀번호 변경 및 로그인 화면으로 이동"}</span>
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