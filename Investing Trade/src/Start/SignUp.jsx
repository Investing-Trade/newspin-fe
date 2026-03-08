import businessMan from '../assets/bussiness-man.png';
import webAnalytics from '../assets/web-analytics.png';
import predictiveAnalytics from '../assets/predictive-chart.png';
import paperplane from '../assets/paper-plane.png';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

// 백엔드 서버 주소 설정
const API_BASE_URL = 'http://52.78.151.56:8080';

const publicApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
    headers: {
        Accept: '*/*'
    }
});

const SignUp = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 함수 선언
    const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부
    const [timer, setTimer] = useState(0); // 타이머 (초)

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [verifiedEmail, setVerifiedEmail] = useState("");
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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

    // 인증번호 발송 함수: /user/email/send-verification

    const handleSendCode = async () => {
        const rawEmail = watch("verificationEmail");
        const isEmailValid = await trigger("verificationEmail");
        const email = (rawEmail || "").trim().toLowerCase();
        const signUpEmail = (watch("email") || "").trim().toLowerCase();

        console.log("[send-verification] 입력 원본 email:", rawEmail);
        console.log("[send-verification] 정규화 후 email:", email);
        console.log("[send-verification] 이메일 유효성 결과:", isEmailValid);
        console.log("[send-verification] email 길이:", email.length);
        console.log("[send-verification] email 문자코드:", [...email].map(ch => ({
            char: ch,
            code: ch.charCodeAt(0)
        })));

        if (!email || !isEmailValid) {
            console.log("[send-verification] 요청 중단 - 이메일 형식 오류 또는 빈값");
            alert("인증번호를 받을 이메일을 올바르게 입력해주세요.");
            return;
        }
        if (signUpEmail && signUpEmail !== email) {
            alert("회원가입 이메일과 인증용 이메일을 동일하게 입력해주세요.");
            return;
        }
        if (isSendingCode) {
            console.log("[send-verification] 요청 중단 - 이미 전송 중");
            return;
        }

        try {
            setIsSendingCode(true);
            setEmailVerified(false);
            setVerifiedEmail("");
            setIsCodeSent(false);
            setTimer(0);
            clearErrors("authCode");
            setValue("authCode", "");

            console.log("[send-verification] 최종 요청 params:", { email });
            console.log("[send-verification] 요청 방식:", {
                method: "POST",
                url: "/user/email/send-verification",
                params: { email },
                headers: {
                    Accept: "*/*"
                }
            });

            const sendRes = await publicApi.post(
                '/user/email/send-verification',
                null,
                {
                    params: { email },
                    headers: {
                        Accept: '*/*'
                    }
                }
            );

            const result = sendRes.data;

            console.log("[send-verification] HTTP 상태코드:", sendRes.status);
            console.log("[send-verification] 전체 응답:", result);

            if (
                sendRes.status === 200 &&
                result?.status?.toLowerCase() === "success"
            ) {
                console.log("[send-verification] 인증번호 발송 성공 처리 진입");
                setIsCodeSent(true);
                setTimer(180);
                setEmailVerified(false);
                clearErrors("authCode");
                setValue("authCode", "");
                alert(result?.message || "인증번호가 발송되었습니다.");
            } else {
                console.log("[send-verification] 인증번호 발송 실패 처리 진입");
                console.log("[send-verification] 실패 원인 분석용 데이터:", {
                    statusCode: sendRes.status,
                    resultStatus: result?.status,
                    resultCode: result?.code,
                    resultMessage: result?.message,
                    resultData: result?.data
                });

                setIsCodeSent(false);
                setTimer(0);

                alert(
                    `[${result?.code || sendRes.status}] ${result?.message || "인증번호 발송에 실패했습니다."}`
                );
            }
        } catch (error) {
            const errorData = error.response?.data;

            console.log("[send-verification] 예외 응답:", {
                status: error.response?.status,
                data: errorData,
                message: error.message
            });

            setIsCodeSent(false);
            setTimer(0);
            setEmailVerified(false);
            setVerifiedEmail("");

            alert(
                `[${errorData?.code || error.response?.status || 'Error'}] ${errorData?.message || "인증번호 발송 중 오류가 발생했습니다."}`
            );
        } finally {
            setIsSendingCode(false);
        }
    };

    // [보완] 인증번호 확인 함수: API 응답 결과(verified)를 상태에 엄격히 반영
    const handleVerifyCode = async () => {
        const isEmailValid = await trigger("verificationEmail");
        const isCodeValid = await trigger("authCode");
        const email = (vEmail || "").trim().toLowerCase();
        const authCode = (watch("authCode") || "").trim();

        console.log("[email-verify] verificationEmail 원본:", vEmail);
        console.log("[email-verify] authCode 원본:", watch("authCode"));
        console.log("[email-verify] 이메일 유효성:", isEmailValid);
        console.log("[email-verify] 코드 유효성:", isCodeValid);
        console.log("[email-verify] 정규화 후 email:", email);
        console.log("[email-verify] email 길이:", email.length);
        console.log("[email-verify] email 문자코드:", [...email].map(ch => ({
            char: ch,
            code: ch.charCodeAt(0)
        })));

        if (!email || !isEmailValid || !isCodeValid) {
            console.log("[email-verify] 요청 중단 - 입력값 검증 실패");
            alert("입력 정보를 다시 확인해주세요.");
            return;
        }

        try {
            setIsVerifyingCode(true);

            console.log("[email-verify] 최종 요청 body:", {
                email,
                code: authCode
            });

            const verifyRes = await publicApi.post('/user/email/verify', {
                email,
                code: authCode
            });

            console.log("[email-verify] HTTP 상태코드:", verifyRes.status);
            console.log("[email-verify] 전체 응답:", verifyRes.data);

            const verifyResult = verifyRes.data?.data;

            if (
                verifyRes.status === 200 &&
                verifyResult?.verified === true
            ) {
                console.log("[email-verify] 이메일 인증 성공");
                setEmailVerified(true);
                setVerifiedEmail(email);
                clearErrors("authCode");
                alert(verifyResult?.message || "이메일 인증이 완료되었습니다.");
            } else {
                console.log("[email-verify] 이메일 인증 실패", {
                    status: verifyRes.data?.status,
                    code: verifyRes.data?.code,
                    message: verifyRes.data?.message,
                    data: verifyRes.data?.data
                });

                setEmailVerified(false);
                setVerifiedEmail("");
                setError("authCode", {
                    type: "manual",
                    message: verifyResult?.message || "인증번호가 올바르지 않습니다."
                });
                alert(verifyResult?.message || "인증에 실패했습니다.");
            }
        } catch (error) {
            const errorData = error.response?.data;
            console.log("[email-verify] 예외 응답:", {
                status: error.response?.status,
                data: errorData,
                message: error.message
            });

            setEmailVerified(false);
            setVerifiedEmail("");
            setError("authCode", {
                type: "manual",
                message: errorData?.message || "인증 확인 중 오류가 발생했습니다."
            });
        } finally {
            setIsVerifyingCode(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        document.title = "NewsPin - SignUp";
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        setError,
        clearErrors,
        setValue,
        formState: { errors, dirtyFields },
    } = useForm({
        mode: "onChange"
    });

    const passwordValue = watch("password");
    const vEmail = watch("verificationEmail");

    // 최종 회원가입 제출 함수: UML의 '회원가입 요청' 흐름 
    const onSubmit = async (data) => {
        const normalizedSignUpEmail = (data.email || "").trim().toLowerCase();
        const normalizedVerificationEmail = (data.verificationEmail || "").trim().toLowerCase();

        console.log("[sign-up] 제출 원본 데이터:", data);
        console.log("[sign-up] emailVerified 상태:", emailVerified);
        console.log("[sign-up] 정규화 후 회원가입 email:", normalizedSignUpEmail);
        console.log("[sign-up] 정규화 후 인증용 email:", normalizedVerificationEmail);
        console.log("[sign-up] verifiedEmail 상태값:", verifiedEmail);

        if (!emailVerified) {
            console.log("[sign-up] 중단 - 이메일 인증 미완료");
            alert("이메일 인증을 먼저 완료해주세요.");
            return;
        }

        if (normalizedSignUpEmail !== normalizedVerificationEmail) {
            console.log("[sign-up] 중단 - 회원가입 이메일과 인증용 이메일 불일치", {
                signUpEmail: normalizedSignUpEmail,
                verificationEmail: normalizedVerificationEmail
            });
            alert("회원가입 이메일과 인증용 이메일이 일치해야 합니다.");
            return;
        }

        if (normalizedSignUpEmail !== verifiedEmail) {
            console.log("[sign-up] 중단 - 인증 완료된 이메일과 회원가입 이메일 불일치", {
                signUpEmail: normalizedSignUpEmail,
                verifiedEmail
            });
            alert("인증 완료된 이메일과 회원가입 이메일이 일치해야 합니다.");
            return;
        }

        try {
            setIsSubmitting(true);

            const requestBody = {
                email: normalizedSignUpEmail,
                password: (data.password || "").trim()
            };

            console.log("[sign-up] 최종 요청 body:", requestBody);

            const signUpRes = await publicApi.post('/user/sign-up', requestBody);

            console.log("[sign-up] HTTP 상태코드:", signUpRes.status);
            console.log("[sign-up] 전체 응답:", signUpRes.data);

            if (signUpRes.status === 200) {
                alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
                navigate('/login');
            } else {
                alert(signUpRes.data.message || "회원가입에 실패했습니다.");
            }
        } catch (error) {
            const serverError = error.response?.data;
            console.log("[sign-up] 예외 응답:", {
                status: error.response?.status,
                data: serverError,
                message: error.message
            });

            alert(`[${serverError?.code || 'Error'}] ${serverError?.message || "오류가 발생했습니다."}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 정규식 설정
    const authRegex = /^.{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
                                {...register("email", {
                                    required: "이메일을 입력해주세요.",
                                    pattern: { value: emailRegex, message: "형식 오류" }
                                })}
                                className={`w-full px-4 py-2 border rounded-lg outline-none text-sm font-bold ${getBorderStyle('email')}`}
                            />
                        </div>

                        {/* 비밀번호 필드 */}
                        <div className="space-y-3">
                            <p className='font-bold text-lg'>비밀번호</p>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="비밀번호를 입력해주세요."
                                    {...register("password", {
                                        required: "비밀번호를 입력해주세요.",
                                        pattern: {
                                            value: authRegex,
                                            message: "8자 이상 입력해주세요. (영문, 한글, 숫자, 특수문자 조합 가능)"
                                        }
                                    })}
                                    className={`w-full px-4 py-2 pr-12 border rounded-lg outline-none text-sm transition-all font-bold ${getBorderStyle('password')}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs font-bold">{errors.password.message}</p>}
                        </div>

                        {/* 비밀번호 확인 필드 */}
                        <div className="space-y-3">
                            <p className='font-bold text-lg'>비밀번호 확인</p>
                            <div className="relative">
                                <input
                                    type={showPasswordConfirm ? "text" : "password"}
                                    placeholder="비밀번호를 다시 입력해주세요."
                                    {...register("passwordConfirm", {
                                        required: "비밀번호 확인을 입력해주세요.",
                                        validate: (value) => value === passwordValue || "비밀번호가 일치하지 않습니다."
                                    })}
                                    className={`w-full px-4 py-2 pr-12 border rounded-lg outline-none text-sm transition-all font-bold ${getBorderStyle('passwordConfirm')}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirm((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.passwordConfirm && <p className="text-red-500 text-xs font-bold">{errors.passwordConfirm.message}</p>}
                        </div>

                        {/* 하단: 인증번호 수령용 이메일 */}
                        <div className="space-y-3">
                            <p className='font-bold text-lg'>인증용 이메일</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="인증번호를 받을 이메일"
                                    {...register("verificationEmail", {
                                        required: "인증용 이메일을 입력해주세요.",
                                        pattern: { value: emailRegex, message: "형식 오류" },
                                        onChange: () => {
                                            setEmailVerified(false);
                                            setVerifiedEmail("");
                                            setIsCodeSent(false);
                                            setTimer(0);
                                            clearErrors("authCode");
                                            setValue("authCode", "");
                                        }
                                    })}
                                    className={`flex-1 px-4 py-2 border rounded-lg outline-none text-sm font-bold ${getBorderStyle('verificationEmail')}`}
                                />
                                <button
                                    type="button"
                                    onClick={handleSendCode}
                                    disabled={isSendingCode}
                                    className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg text-xs font-bold hover:bg-blue-400 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isSendingCode ? "전송 중..." : isCodeSent ? "재전송" : "인증번호 전송"}
                                </button>
                            </div>
                            {errors.verificationEmail && <p className="text-red-500 text-xs font-bold">{errors.verificationEmail.message}</p>}
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
                                            minLength: { value: 6, message: "6자리를 입력해주세요." },
                                            maxLength: { value: 6, message: "6자리만 입력해주세요." },
                                            pattern: { value: /^\d{6}$/, message: "숫자 6자리를 입력해주세요." }
                                        })}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none text-sm transition-all font-bold ${getBorderStyle('authCode')}`}
                                    />
                                    {/* 타이머 표시 */}
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-sm">
                                        {formatTime(timer)}
                                    </span>
                                </div>
                                {errors.authCode && <p className="text-red-500 text-xs font-bold">{errors.authCode.message}</p>}
                                <button
                                    type="button"
                                    onClick={handleVerifyCode}
                                    className="w-full bg-gray-800 text-white px-4 py-2 cursor-pointer rounded-lg text-sm font-bold hover:bg-gray-700 transition-all"
                                >
                                    인증번호 확인
                                </button>

                                {emailVerified && (
                                    <p className="text-blue-600 text-xs font-bold">이메일 인증이 완료되었습니다.</p>
                                )}
                            </div>
                        )}

                        {/* 최종 제출 버튼 */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !emailVerified}
                            className="w-full bg-blue-600 border border-white text-sm cursor-pointer text-white font-bold py-3 rounded-lg mt-8 shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <img src={paperplane} alt="plane" className="w-5 h-5" />
                            <span>{isSubmitting ? "가입 중..." : "가입 완료! 로그인 후 투자 감각을 깨워보세요."}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;