import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [recognizedText, setRecognizedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRecognizedText = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:8080/get-recognized-text');
      setRecognizedText(response.data.recognized_text);
    } catch (err) {
      setError('Error while fetching the recognized text from the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Speech Recognition</h1>
      <button onClick={getRecognizedText} disabled={loading}>
        {loading ? 'Processing...' : 'Get Recognized Text'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {recognizedText && <p><strong>Recognized Text:</strong> {recognizedText}</p>}
    </div>
  );
}

export default App;
