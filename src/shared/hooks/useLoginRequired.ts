import { createContext, useContext } from "react";

export type RequireLogin = () => void;

export const LoginRequiredContext = createContext<RequireLogin>(() => {});

/**
 * 로그인이 필요한 동작(예: 북마크)에서 호출하면 "로그인이 필요한 서비스입니다"
 * 모달을 띄운다. LoginRequiredProvider 하위 어디서든 사용할 수 있다.
 */
export const useLoginRequired = () => useContext(LoginRequiredContext);
