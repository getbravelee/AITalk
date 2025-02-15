import React, { useState } from "react";
import axios from "axios";

const JETSON_API_URL = "http://localhost:5000"; // Jetson의 Flask 서버 주소 입력

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setImageUrl("");
  
    try {
      const response = await axios.post(
        `${JETSON_API_URL}/generate`,
        { prompt },
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.data.image_url) {
        setImageUrl(response.data.image_url);
      } else {
        alert("이미지 생성 실패");
      }
    } catch (error) {
      console.error("❌ 오류 발생:", error);
      alert("서버 요청 실패");
    }
  
    setLoading(false);
  };
  
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>이미지 생성 테스트</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="이미지 프롬프트 입력"
        style={{ padding: "10px", width: "300px" }}
      />
      <button
        onClick={generateImage}
        style={{
          marginLeft: "10px",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        {loading ? "생성 중..." : "이미지 생성"}
      </button>

      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>생성된 이미지:</h3>
          <img
            src={imageUrl}
            alt="Generated"
            style={{ width: "300px", height: "300px", objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;

