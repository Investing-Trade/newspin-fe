import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import axios from 'axios';

// API 서버의 Base URL 설정
const API_BASE_URL = "http://52.78.151.56:8080";

const Login = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 함수 선언

  // 1. 페이지 접속 시 타이틀 변경
  useEffect(() => {
    document.title = "NewsPin - Login";
  }, []);

  // 2. useForm 초기화 (실시간 검증을 위해 mode: "onChange" 설정)
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields }, // dirtyFields로 입력 여부 확인
  } = useForm({
    mode: "onChange"
  });

  // [연동 수정] API 명세서 구조 반영
 const onSubmit = async (data) => {
    try {
      // 1. 요청 데이터 로그 확인 (스웨거의 데이터 형식과 일치하는지 확인용)
      console.log("전송 데이터:", { email: data.email, password: data.password });

      const response = await axios({
        method: 'post',
        url: `${API_BASE_URL}/user/sign-in`, // 주소 확인: http://52.78.151.56:8080/user/sign-in
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        data: {
          email: data.email,
          password: data.password
        }
      });

      const resData = response.data;

      // 2. 명세서에 따른 성공 조건 체크 (status: "SUCCESS")
      if (resData.status === "SUCCESS") {
        // 명세서 구조: data { jwtToken { grantType, accessToken, refreshToken } }
        const { grantType, accessToken, refreshToken } = resData.data.jwtToken;

        // 로컬 스토리지 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('grantType', grantType);

       // 3. 헤더 설정 시 공백 주의
      axios.defaults.headers.common['Authorization'] = `${grantType} ${accessToken}`;

      alert("로그인 성공!");
      navigate('/main');
    } else {
      alert(resData.message || "로그인 정보를 확인해주세요.");
    }
  } catch (error) {
    // 서버가 C999를 던질 때 에러 객체 구조 확인
    const serverMessage = error.response?.data?.message || "서버 내부 오류가 발생했습니다.";
    console.error("Login Error Details:", error.response?.data);
    alert(serverMessage);
  }
};

  const authRegex = /^[a-zA-Z가-힣\d@$!%*?&]{8,}$/;

const handleSendCode = async () => {
  const emailValue = getValues("email");
  if (!emailValue) {
    alert("이메일을 입력해주세요.");
    return;
  }

  try {
    // 1. 요청 직전 데이터 로그 확인
    console.log("인증번호 발송 요청 이메일:", emailValue);

    const response = await axios.post('http://52.78.151.56:8080/user/email/send-verification', 
      null, // Body가 비어있고 쿼리 파라미터로 보내는 경우일 수도 있으니 명세서 재확인 필요
      {
        params: { email: emailValue } // 만약 쿼리 파라미터 방식이라면 이렇게 변경
      }
    );

    // 만약 Body에 담아 보내는 방식이라면:
    // const response = await axios.post('http://52.78.151.56:8080/user/email/send-verification', {
    //   email: emailValue
    // });

    if (response.data.status === "SUCCESS") {
      alert("인증번호가 발송되었습니다.");
    }
  } catch (error) {
    console.error("인증번호 발송 에러 상세:", error.response?.data);
    alert(error.response?.data?.message || "인증번호 발송 중 서버 오류가 발생했습니다.");
  }
};

  // 실시간 테두리 스타일 결정 함수
  const getBorderStyle = (fieldName) => {
    if (errors[fieldName]) return 'border-red-500 bg-red-50 focus:ring-red-500';
    if (dirtyFields[fieldName]) return 'border-[#5D6DED] bg-blue-50 focus:ring-[#5D6DED]';
    return 'border-gray-200 bg-gray-50 focus:border-[#5D6DED]';
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-white-800 mx-2 px-4 py-3">

      {/* 부모 카드 */}
      <div className="bg-white rounded-3xl border border-gray-200 flex flex-row items-stretch w-full max-w-4xl h-[750px] overflow-hidden shadow-2xl">

        {/* [왼쪽 섹션] 브랜드 컬러와 서비스 소개 */}
        <div className="flex-1 bg-blue-600 p-10 text-white flex flex-col justify-center items-center shrink-0">
          <h1 className="font-agbalumo text-6xl mb-40 tracking-wider">NewsPin</h1>

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

          <div className='mt-12'>
            <p className="text-center text-lg font-semibold font-agbalumo leading-relaxed py-2">NewsPin은 뉴스 투자 학습 플랫폼입니다.</p>
            <p className="text-center text-lg font-semibold leading-relaxed py-1">경제 뉴스를 읽고 호재 및 악재를 판단하며,</p>
            <p className="text-center text-lg font-semibold leading-relaxed py-1">AI 피드백으로 분석 감각을 키워보세요.</p>
            <p className="text-center text-lg font-semibold leading-relaxed py-1">실제 데이터를 활용한 모의 투자로 안전한 학습을 경험할 수 있습니다.</p>
          </div>
        </div>

        {/* [오른쪽 섹션] 로그인 폼 */}
        <div className="flex-1 p-12 flex flex-col justify-center bg-white shrink-0">
          <h2 className="text-5xl font-jua text-center mb-20 text-gray-800">로그인</h2>
          <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
            {/* 상단: 로그인 ID용 이메일 */}
                        <div className="space-y-3">
                            <p className='font-jua text-lg'>이메일</p>
                            <input
                                type="text"
                                placeholder="newspin@naver.com"
                                {...register("email", { // 이름: email
                                    required: "이메일을 입력해주세요.",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.com$/, message: "형식 오류" }
                                })}
                                className={`w-full px-4 py-2 border rounded-lg outline-none text-sm font-bold ${getBorderStyle('email')}`}
                            />
              {errors.email && <p className="text-red-500 text-xs font-bold">{errors.email.message}</p>}
            </div>

            {/* 비밀번호 필드 */}
            <div className="space-y-2">
              <p className='font-jua text-lg pb-1'>비밀번호</p>
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
                className={`w-full px-4 py-3 border rounded-lg outline-none text-sm transition-all font-bold ${getBorderStyle('password')}`}
              />
              {errors.password && <p className="text-red-500 text-xs font-bold">{errors.password.message}</p>}
            </div>

            <button type="submit" className="w-full bg-blue-600 border border-white text-lg cursor-pointer text-white font-jua py-3 rounded-lg mt-4 shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all">
              ✈️ 투자 여정 시작하기
            </button>
            <div className="relative py-5">
              <hr className='text-gray-500 py-1' />
            </div>
          </form>

          <div className="flex justify-center gap-6 text-[10px] text-gray-400 font-medium">
            <p onClick={() => navigate('/signup')} className="active:scale-[0.98] transition-all hover:text-gray-600 hover:underline text-base mt-1 font-jua transition-colors cursor-pointer">회원가입</p>
            <span className="text-gray-500 text-lg">|</span>
            <p onClick={() => navigate('/password')} className="active:scale-[0.98] transition-all hover:text-gray-600 hover:underline text-base mt-1 font-jua transition-colors cursor-pointer">비밀번호 찾기</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;