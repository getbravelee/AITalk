import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";

function App() {
  const [recognizedText, setRecognizedText] = useState('');
  const [listening, setListening] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // WebSocket 연결
    const socket = io("http://localhost:5000", { forceNew: true });

    socket.on("connect", () => {
      console.log("✅ WebSocket 연결 성공!");
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ WebSocket 연결 끊김!");
      setSocketConnected(false);
    });

    socket.on("recognized_text", (data) => {
      console.log("📩 받은 텍스트:", data.text);
      setRecognizedText(prevText => prevText + "\n" + data.text);
    });

    return () => socket.disconnect();  // 언마운트 시 WebSocket 해제
  }, []);

  const startRecognition = async () => {
    try {
      console.log("🎤 음성 인식 시작 요청");
      await axios.post("http://localhost:8080/start-recognition");
      setListening(true);
    } catch (err) {
      console.error("❌ 음성 인식 시작 오류:", err);
    }
  };

  const stopRecognition = async () => {
    try {
      console.log("🛑 음성 인식 중지 요청");
      await axios.post("http://localhost:8080/stop-recognition");
      setListening(false);
    } catch (err) {
      console.error("❌ 음성 인식 중지 오류:", err);
    }
  };

  return (
    <div className="App">
      <h1>실시간 음성 인식</h1>
      <p><strong>WebSocket 상태:</strong> {socketConnected ? "🟢 연결됨" : "🔴 연결 안됨"}</p>
      <button onClick={startRecognition} disabled={listening}>🎤 시작</button>
      <button onClick={stopRecognition} disabled={!listening}>🛑 중지</button>
      <p><strong>인식된 텍스트:</strong></p>
      <textarea value={recognizedText} readOnly rows={10} cols={50} />
    </div>
  );
}

export default App;
