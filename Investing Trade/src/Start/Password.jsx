import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import paperplane from '../assets/paper-plane.png';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 백엔드 서버 주소 설정
axios.defaults.baseURL = 'http://52.78.151.56:8080';

const Password = () => {
  const navigate = useNavigate();
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "NewsPin - Password";
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: "onChange"
  });

  const newPasswordValue = watch("newPassword");
  const authRegex = /^[a-zA-Z가-힣\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;

  /// 비밀번호 재설정 통합 제출 핸들러
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      if (!isCodeSent) {
        // 1단계: 비밀번호 재설정 인증코드 발송
        const response = await axios.post('/user/password/send-reset-code', null, {
          params: { email: data.email }
        });

        const isSuccess =
          response.data?.status?.toUpperCase() === "SUCCESS" ||
          response.data?.code?.toUpperCase() === "SUCCESS";

        if (isSuccess) {
          alert(`입력하신 ${data.email}로 인증 코드가 발송되었습니다.`);
          setIsCodeSent(true);
        } else {
          alert(response.data?.message || "인증 코드 발송에 실패했습니다.");
        }
      } else {
        // 2단계: 인증코드 확인 후 비밀번호 재설정
        const response = await axios.post('/user/password/reset', {
          email: data.email,
          code: data.authCode,
          newPassword: data.newPassword
        });

        const isSuccess =
          response.data?.status?.toUpperCase() === "SUCCESS" ||
          response.data?.code?.toUpperCase() === "SUCCESS";

        if (isSuccess) {
          alert("비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.");
          navigate('/login');
        } else {
          alert(response.data?.message || "비밀번호 재설정에 실패했습니다.");
        }
      }
    } catch (error) {
      const errorData = error.response?.data;
      console.error("Error Detail:", errorData);

      const serverMessage =
        errorData?.message ||
        errorData?.error ||
        "통신 중 오류가 발생했습니다.";

      alert(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBorderStyle = (fieldName) => {
    if (errors[fieldName]) return 'border-red-500 bg-red-50 focus:ring-red-500';
    if (dirtyFields[fieldName] && !errors[fieldName]) return 'border-[#5D6DED] bg-blue-50 focus:ring-[#5D6DED]';
    return 'border-gray-200 bg-gray-50 focus:border-[#5D6DED]';
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white overflow-hidden">
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

            {!isCodeSent && (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 border border-white text-lg cursor-pointer text-white font-jua py-3 rounded-lg mt-4 shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all ${isSubmitting ? 'opacity-50' : ''}`}
              >
                {isSubmitting ? "발송 중..." : "📩 이메일로 인증 코드 전송"}
              </button>
            )}

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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex flex-row items-center justify-center gap-2 cursor-pointer bg-blue-600 text-white font-jua py-3 rounded-lg shadow-md hover:bg-blue-500 active:scale-[0.98] transition-all"
                >
                  <img src={paperplane} alt="plane" className="w-6 h-auto" />
                  <span className="leading-none">{isSubmitting ? "변경 중..." : "비밀번호 변경 및 완료"}</span>
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