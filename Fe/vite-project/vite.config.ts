import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,  // 파일 변경 감지 개선
    },
    host: true,  // 컨테이너 포트 매핑 활성화
    strictPort: true,
    port: 5173  // 기본 포트 지정
  }
})
