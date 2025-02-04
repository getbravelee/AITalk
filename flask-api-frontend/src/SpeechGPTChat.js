import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function SpeechGPTChat() {
  const [recognizedText, setRecognizedText] = useState('');
  const [gptResponse, setGptResponse] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Flask-SocketIO server');
    });

    socket.on('recognized_text', (data) => {
      setRecognizedText(data.text);
    });

    socket.on('gpt_response', (data) => {
      setGptResponse(data.response);
    });

    return () => {
      socket.off('recognized_text');
      socket.off('gpt_response');
    };
  }, []);

  const startRecognition = async () => {
    const response = await fetch('/play/talk-start', {
      method: 'POST',
    });
    const data = await response.json();
    if (data.status === 'started') setIsRecognizing(true);
  };

  const stopRecognition = async () => {
    const response = await fetch('/play/talk-stop', {
      method: 'POST',
    });
    const data = await response.json();
    if (data.status === 'stopped') setIsRecognizing(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Speech to GPT Chat</h1>
      <button onClick={startRecognition} disabled={isRecognizing} style={{ marginRight: '10px' }}>
        {isRecognizing ? 'Listening...' : 'Start Recognition'}
      </button>
      <button onClick={stopRecognition} disabled={!isRecognizing}>
        Stop Recognition
      </button>

      <h2>Recognized Text:</h2>
      <p>{recognizedText || 'No text recognized yet.'}</p>

      <h2>GPT Response:</h2>
      <p>{gptResponse || 'Waiting for GPT response...'}</p>
    </div>
  );
}
