import axiosInstance from '../../utils/axiosInstance';

interface EmailAuthResponse {
  message: string;
}
interface UseEmailAuthConfirmProps {
  onSuccess?: (data: EmailAuthResponse) => void;
  onError?: (error: any) => void;
}

export const useEmailAuthConfirm = ({
  onSuccess,
  onError,
}: UseEmailAuthConfirmProps = {}) => {
  const confirmEmail = async (
    from: string,
    email: string,
    code: string,
    id: string,
  ) => {
    const url: string = from === 'signUp' ? 'verify-email' : 'verify-code';
    const payload = from === 'signUp' ? { email, code } : { id, code };
    try {
      const response = await axiosInstance.post<EmailAuthResponse>(
        `/user/${url}`,
        payload,
      );

      if (response.status === 200) {
        console.log(response.data);
        // 인증 성공 시 onSuccess 콜백 실행
        onSuccess && onSuccess(response.data);
      }
      return response;
    } catch (error) {
      console.error('인증 실패', error);
      onError && onError(error);
      alert(
        '인증 코드가 올바르지 않거나 만료되었습니다! 올바른 코드를 입력해 주세요!',
      );
      throw error;
    }
  };

  return { confirmEmail };
};
