export default {
  testEnvironment: 'jsdom', // React 컴포넌트 테스트를 위한 환경 설정
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest', // TypeScript 및 JSX 변환
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // DOM 테스트 확장
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js|jsx)'], // 테스트 파일 매칭
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // CSS 파일 무시
  },
};
