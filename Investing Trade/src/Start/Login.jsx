import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://52.78.151.56:8080';

// 로그인 전 api
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json'
  }
});

// 로그인 후 api
const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json'
  }
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "NewsPin - Login";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: "onChange"
  });

  const onSubmit = async (data) => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('grantType');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');

      delete publicApi.defaults.headers.common['Authorization'];
      delete authApi.defaults.headers.common['Authorization'];

      const requestBody = {
        email: data.email.trim(),
        password: data.password
      };

      console.log("[sign-in] 최종 요청 body:", requestBody);

      const signInResponse = await publicApi.post('/user/sign-in', requestBody);

      const resData = signInResponse.data;

      console.log("서버 응답 데이터:", resData);

      const tokenData = resData?.data?.jwtToken;
      const isSuccess = String(resData?.status || '').toLowerCase() === 'success';

      if (
        !isSuccess ||
        !tokenData ||
        !tokenData.grantType ||
        !tokenData.accessToken ||
        !tokenData.refreshToken
      ) {
        console.error("로그인 응답 구조 또는 상태 이상:", resData);
        alert(resData?.message || "로그인에 실패했습니다.");
        return;
      }

      const { grantType, accessToken, refreshToken } = tokenData;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('grantType', grantType);

      // 이후 모든 API 요청에 사용할 공통 인증 헤더 설정
      authApi.defaults.headers.common['Authorization'] = `${grantType} ${accessToken}`;

      // 로그인 성공 후 사용자 정보 조회
      try {
        const meResponse = await authApi.get('/user/me', {
          headers: {
            Authorization: `${grantType} ${accessToken}`
          }
        });
        const userData = meResponse?.data?.data;

        if (userData?.userId && userData?.email) {
          localStorage.setItem('userId', String(userData.userId));
          localStorage.setItem('email', userData.email);
        }
      } catch (meError) {
        console.error("사용자 정보 조회 실패:", meError.response?.data || meError);

        const meErrorData = meError.response?.data;
        console.warn("user/me 응답 메시지:", meErrorData?.message || meError.message);
      }

      alert("로그인 성공!");
      navigate('/main');

    } catch (error) {
      // 서버 에러(C999 등) 및 네트워크 오류 처리
      console.error("[sign-in] 예외 발생:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      const errorData = error.response?.data;

      const msg =
        errorData?.message ||
        errorData?.data?.message ||
        error.message ||
        `로그인 요청 실패 (${error.response?.status || 'unknown'})`;

      alert(msg);
    }
  };

  const authRegex = /^[a-zA-Z가-힣\d@$!%*?&]{8,}$/;

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
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "올바른 이메일 형식을 입력해주세요!" }
                })}
                className={`w-full px-4 py-2 border rounded-lg outline-none text-sm font-bold ${getBorderStyle('email')}`}
              />
              {errors.email && <p className="text-red-500 text-xs font-bold">{errors.email.message}</p>}
            </div>

            {/* 비밀번호 필드 */}
            <div className="space-y-2">
              <p className='font-jua text-lg pb-1'>비밀번호</p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요."
                  {...register("password", {
                    required: "비밀번호를 입력해주세요.",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg outline-none text-sm transition-all font-bold ${getBorderStyle('password')}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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