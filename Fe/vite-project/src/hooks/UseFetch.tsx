import { useEffect, useReducer } from 'react';

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

/* Custom Hook: useFetch
   주어진 URL로 API 호출 후 상태(데이터, 로딩, 에러)를 관리하여 반환
*/
export function UseFetch<T>(url: string): State<T> {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: null,
    loading: true,
    error: null,
  } as State<T>);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('응답 오류');
        const data: T = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error: any) {
        dispatch({ type: 'FETCH_FAILURE', payload: error.message });
      }
    };

    fetchData();
  }, [url]);

  return state;
}
