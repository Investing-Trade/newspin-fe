import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import paperplane from '../assets/paper-plane.png';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 백엔드 서버 주소
axios.defaults.baseURL = 'http://52.78.151.56:8080';

const SignUp = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 함수 선언
    const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부
    const [timer, setTimer] = useState(0); // 타이머 (초)

    // 타이머 기능
    useEffect(() => {
        let interval;
        if (isCodeSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isCodeSent, timer]);

    // 인증번호 발송 함수: /user/email/send-verification 연동
    const handleSendCode = async () => {
        const vEmail = watch("verificationEmail");
        if (!vEmail || errors.verificationEmail) {
            alert("인증번호를 받을 이메일을 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post('/user/email/send-verification', null, {
                params: { email: vEmail }
            });

            // 수정: status가 "SUCCESS"가 아닐 경우 처리 강화
            if (response.data.status.toUpperCase() === "SUCCESS" || response.data.code === "200") {
                setIsCodeSent(true);
                setTimer(180);
                alert("인증번호가 발송되었습니다.");
            } else {
                // 서버에서 내려주는 구체적인 에러 메시지(C999 등) 표시
                alert(`[${response.data.code}] ${response.data.message}`);
            }
        } catch (error) {
            // [C999 에러 대응] 서버 에러 응답 객체에서 메시지 추출
            const errorData = error.response?.data;
            const errorMessage = errorData?.message || "이메일 전송 중 서버 오류가 발생했습니다.";
            const errorCode = errorData?.code ? `(${errorData.code})` : "";

            alert(`${errorMessage} ${errorCode}`);
            console.error("인증번호 발송 에러 상세:", errorData);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // 페이지 접속 시 타이틀 변경
    useEffect(() => {
        document.title = "NewsPin - SignUp";
    }, []);

    // 1. useForm 설정: mode를 "onChange"로 설정하여 실시간 검증 활성화
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, dirtyFields },
    } = useForm({
        mode: "onChange"
    });

    // [수정] 제출 핸들러: 인증 확인 후 회원가입 및 데이터 매핑 최적화
    const onSubmit = async (data) => {
        try {
            // 1. 인증 확인 (/user/email/verify)
            // 명세서 규격: EmailVerificationRequest { email, code }
            const verifyRes = await axios.post('/user/email/verify', {
                email: data.verificationEmail,
                code: data.authCode
            });

            const verifyResult = verifyRes.data.data; // data 필드에 접근

            if (verifyRes.data.status?.toUpperCase() !== "SUCCESS" || !verifyResult?.verified) {
                // 서버가 보내준 구체적인 인증 실패 사유 출력
                alert(verifyResult?.message || verifyRes.data.message || "인증번호가 올바르지 않습니다.");
                return;
            }

            // 2. 실제 회원가입 요청 (/user/sign-up)
            const signUpRes = await axios.post('/user/sign-up', {
                email: data.email,
                password: data.password
            });

            if (signUpRes.data.status === "SUCCESS") {
                // 가입 성공 시 토큰이 담겨온다면(SignInResponse와 동일 구조일 경우) 처리
                const authData = signUpRes.data.data?.jwtToken;
                if (authData) {
                    localStorage.setItem('accessToken', authData.accessToken);
                    localStorage.setItem('refreshToken', authData.refreshToken);
                    axios.defaults.headers.common['Authorization'] = `${authData.grantType} ${authData.accessToken}`;
                }

                alert("가입 완료! 로그인 후 투자 감각을 깨워보세요.");
                navigate('/main');
            }
        } catch (error) {
            // 400 Bad Request 발생 시 서버의 에러 응답 파싱
            const serverError = error.response?.data;
            const errorMsg = serverError?.message || "요청 형식이 잘못되었거나 인증에 실패했습니다.";
            const errorCode = serverError?.code ? `[${serverError.code}] ` : "";
            
            alert(`${errorCode}${errorMsg}`);
            console.error("인증/가입 실패 상세:", serverError);
        }
    };

    // 정규식 설정
    const authRegex = /^[a-zA-Z가-힣\d@$!%*?&]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;

    // 비밀번호 확인을 위한 값 감시
    const passwordValue = watch("password");

    // 실시간 테두리 색상 제어 함수
    const getBorderStyle = (fieldName) => {
        // 에러가 있는 경우 (빨간색)
        if (errors[fieldName]) {
            return 'border-red-500 bg-red-50 focus:ring-red-500';
        }
        // 에러가 없고, 사용자가 입력을 시작하여 값이 유효한 경우 (파란색)
        if (dirtyFields[fieldName] && !errors[fieldName]) {
            return 'border-[#5D6DED] bg-blue-50 focus:ring-[#5D6DED]';
        }
        // 기본 상태 (회색)
        return 'border-gray-200 bg-gray-50 focus:border-[#5D6DED]';
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-white-800 mx-2 px-4 py-2">

            {/* 부모 카드: 가로 배치 및 그림자 설정 */}
            <div className="bg-white rounded-3xl border border-gray-200 flex flex-row items-stretch w-full max-w-4xl h-[750px] overflow-hidden shadow-2xl">

                {/* [왼쪽 섹션] 브랜드 컬러와 서비스 소개 */}
                <div className="flex-1 bg-blue-600 p-10 text-white flex flex-col justify-center items-center shrink-0">
                    <h1 className="font-agbalumo text-6xl mb-40 tracking-wider">NewsPin</h1>

                    {/* 이미지 레이어링 */}
                    <div className="relative w-40 h-28 mb-6">
                        <img src={predictiveAnalytics} alt="predictiveanalytics" className="w-48 h-auto z-15 absolute left-2 bottom-24 drop-shadow-lg" />
                        <img src={businessMan} alt="man" className="w-48 h-auto z-10 absolute right-26 drop-shadow-lg" />
                        <img src={webAnalytics} alt="chart" className="w-48 h-auto z-10 absolute left-28 top-0" />
                    </div>

                    <div className='mt-16'>
                        <p className="text-center text-lg font-semibold font-agbalumo leading-relaxed py-2 px-2">NewsPin은 뉴스 투자 학습 플랫폼입니다.</p>
                        <p className="text-center text-lg font-semibold leading-relaxed py-1">경제 뉴스를 읽고 호재 및 악재를 판단하며,</p>
                        <p className="text-center text-lg font-semibold leading-relaxed py-1">AI 피드백으로 분석 감각을 키워보세요.</p>
                        <p className="text-center text-lg font-semibold leading-relaxed py-1">실제 데이터를 활용한 모의 투자로 안전한 학습을 경험할 수 있습니다.</p>
                    </div>
                </div>

                {/* [오른쪽 섹션] 회원가입 폼 */}
                <div className="flex-1 p-12 flex flex-col justify-center bg-white shrink-0">
                    <h2 className="text-5xl font-bold text-center mb-8 text-gray-800">회원가입</h2>

                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        {/* 상단: 로그인 ID용 이메일 */}
                        <div className="space-y-3">
                            <p className='font-bold text-lg'>이메일</p>
                            <input
                                type="text"
                                placeholder="newspin@naver.com"
                                {...register("email", { // 이름: email
                                    required: "이메일을 입력해주세요.",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.com$/, message: "형식 오류" }
                                })}
                                className={`w-full px-4 py-2 border rounded-lg outline-none text-sm font-bold ${getBorderStyle('email')}`}
                            />
                        </div>

                        {/* 비밀번호 필드 */}
                        <div className="space-y-3">
                            <p className='font-bold text-lg'>비밀번호</p>
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
                                className={`w-full px-4 py-2 border rounded-lg outline-none text-sm transition-all font-bold ${getBorderStyle('password')}`}
                            />
                            {errors.password && <p className="text-red-500 text-xs font-bold">{errors.password.message}</p>}
                        </div>

                        {/* 비밀번호 확인 필드 */}
                        <div className="space-y-3">
                            <p className='font-bold text-lg'>비밀번호 확인</p>
                            <input
                                type="password"
                                placeholder="비밀번호를 다시 입력해주세요."
                                {...register("passwordConfirm", {
                                    required: "비밀번호 확인을 입력해주세요.",
                                    validate: (value) => value === passwordValue || "비밀번호가 일치하지 않습니다."
                                })}
                                className={`w-full px-4 py-2 border rounded-lg outline-none text-sm transition-all font-bold ${getBorderStyle('passwordConfirm')}`}
                            />
                            {errors.passwordConfirm && <p className="text-red-500 text-xs font-bold">{errors.passwordConfirm.message}</p>}
                        </div>

                        {/* 하단: 인증번호 수령용 이메일 */}
                        <div className="space-y-3">
                            <p className='font-bold text-lg'>인증용 이메일</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="인증번호를 받을 이메일"
                                    {...register("verificationEmail", { // [수정] 이름을 verificationEmail로 변경
                                        required: "인증용 이메일을 입력해주세요.",
                                        pattern: { value: /^[^\s@]+@[^\s@]+\.com$/, message: "형식 오류" }
                                    })}
                                    className={`flex-1 px-4 py-2 border rounded-lg outline-none text-sm font-bold ${getBorderStyle('verificationEmail')}`}
                                />
                                <button
                                    type="button" // submit 방지
                                    onClick={handleSendCode}
                                    className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg text-xs font-bold hover:bg-blue-400 transition-all"
                                >
                                    {isCodeSent ? "재전송" : "인증번호 전송"}
                                </button>
                            </div>
                            {errors.verficationEmail && <p className="text-red-500 text-xs font-bold">{errors.email.message}</p>}
                        </div>

                        {/* 인증번호 입력 섹션 (인증번호 전송 시에만 표시) */}
                        {isCodeSent && (
                            <div className="space-y-3 mt-4">
                                <p className='font-bold text-lg'>인증번호 확인</p>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="인증번호 6자리를 입력해주세요."
                                        {...register("authCode", {
                                            required: "인증번호를 입력해주세요.",
                                            minLength: { value: 6, message: "6자리를 입력해주세요." }
                                        })}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none text-sm transition-all font-bold ${getBorderStyle('authCode')}`}
                                    />
                                    {/* 타이머 표시 */}
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-sm">
                                        {formatTime(timer)}
                                    </span>
                                </div>
                                {errors.authCode && <p className="text-red-500 text-xs font-bold">{errors.authCode.message}</p>}
                            </div>
                        )}

                        {/* 최종 제출 버튼 */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 border border-white text-sm cursor-pointer text-white font-bold py-3 rounded-lg mt-8 shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                        >
                            <img src={paperplane} alt="plane" className="w-5 h-5" />
                            <span>가입 완료! 로그인 후 투자 감각을 깨워보세요.</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;