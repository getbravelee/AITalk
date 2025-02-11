// src/hooks/useTherapistLogin.ts
import { useReducer } from 'react';
// 로그인 요청의 상태 관리, API 호출 로직, 그리고 성공/실패에 따른 상태 업데이트를 담당합니다.

/* ---------------------------------------------------------------------------
   인터페이스: LoginResponse
   API로부터 로그인 결과를 받을 때 사용되는 데이터 형식 정의
--------------------------------------------------------------------------- */
export interface LoginResponse {
  success: boolean;
  message: string;
}

/* ---------------------------------------------------------------------------
   타입 정의: LoginState, LoginAction
--------------------------------------------------------------------------- */
type LoginState = {
  loading: boolean;
  error: string | null;
};

type LoginAction =
  | { type: 'LOGIN_INIT' }
  | { type: 'LOGIN_SUCCESS' }
  | { type: 'LOGIN_FAILURE'; payload: string };

/* ---------------------------------------------------------------------------
   Reducer 함수: loginReducer
--------------------------------------------------------------------------- */
function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case 'LOGIN_INIT':
      return { loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { loading: false, error: null };
    case 'LOGIN_FAILURE':
      return { loading: false, error: action.payload };
    default:
      throw new Error('Unhandled action type in loginReducer');
  }
}

/* ---------------------------------------------------------------------------
   Custom Hook: useTherapistLogin
--------------------------------------------------------------------------- */
function UseTherapistLogin() {
  const [state, dispatch] = useReducer(loginReducer, {
    loading: false,
    error: null,
  });

  /**
   * 로그인 API 호출 및 상태 업데이트
   * @param id 사용자 ID
   * @param password 사용자 PW
   */
  const login = async (id: string, password: string) => {
    dispatch({ type: 'LOGIN_INIT' });
    const payload = { id, password };

    try {
      const response = await fetch('http://192.168.30.146:5000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: LoginResponse = await response.json();

      if (data.success) {
        dispatch({ type: 'LOGIN_SUCCESS' });
        console.log('로그인 성공:', data.message);
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: data.message });
      }
    } catch (err) {
      console.error('로그인 에러:', err);
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: '로그인 중 오류가 발생했습니다.',
      });
    }
  };

  return { login, loginLoading: state.loading, loginError: state.error };
}

export default UseTherapistLogin;
