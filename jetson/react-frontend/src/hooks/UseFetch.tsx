import { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../feature/store'; // RootState 타입 정의 경로에 맞게 수정하세요

/* 인터페이스: API가 반환할 데이터를 포함한 상태 타입 정의 */
export interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/* 타입 정의: API 요청 액션 */
export type Action<T> =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_FAILURE'; payload: string };

/* Reducer 함수: API 요청 상태를 업데이트 */
function dataFetchReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      throw new Error('Unhandled action type');
  }
}

/* Custom Hook: UseFetch
   Redux Persist로 저장된 user state에서 therapist_id를 읽어
   POST 요청의 body에 { therapist_id } 형태로 담아 API 호출 후 상태(데이터, 로딩, 에러)를 관리 및 반환
*/
export function UseFetch<T>(url: string): State<T> {
  const [state, dispatch] = useReducer(dataFetchReducer<T>, {
    data: null,
    loading: true,
    error: null,
  } as State<T>);

  // Redux Persist로 저장되어 재사용되는 user state에서 therapist_id 가져오기
  const therapist_id = useSelector((state: RootState) => state.user.currentUser?.therapist_id);

  useEffect(() => {
    console.log(therapist_id)
    if (therapist_id === undefined || therapist_id === null) {
    }
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ therapist_id }), // Redux Persist에 저장된 therapist_id를 요청 본문에 포함
        });

        if (!response.ok)
          throw new Error(`응답 오류 (상태 코드 ${response.status})`);
          
        const data: T = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error: any) {
        dispatch({ type: 'FETCH_FAILURE', payload: error.message });
      }
    };

    fetchData();
  }, [url, therapist_id]);

  return state;
}
