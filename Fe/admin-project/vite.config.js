import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    host: '0.0.0.0',  // ✅ 컨테이너 내부 IP가 아니라 외부에서도 접근 가능하도록 설정
    strictPort: true,
    open: false,
  },
});
