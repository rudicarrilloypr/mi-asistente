import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import './index.css';

const Assistant = () => {
  const [response, setResponse] = useState('');
  const { transcript, resetTranscript } = useSpeechRecognition();

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const handlePrompt = async () => {
    console.log('Transcript:', transcript);
    console.log('API Key:', process.env.REACT_APP_OPENAI_API_KEY);

    const maxRetries = 5;
    let retryCount = 0;
    let success = false;

    while (!success && retryCount < maxRetries) {
      try {
        const res = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: transcript }],
            temperature: 0.7,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
            }
          }
        );

        if (res.status === 200) {
          const result = res.data.choices[0].message.content.trim();
          setResponse(result);
          speak(result);
          resetTranscript();
          success = true;
        } else {
          console.error('Unexpected response:', res);
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          retryCount++;
          const retryAfter = error.response.headers['retry-after'] || Math.pow(2, retryCount);
          console.warn(`Rate limit exceeded. Retrying after ${retryAfter} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        } else {
          console.error('Error:', error.response ? error.response.data : error.message);
          break;
        }
      }
    }
  };

  const handleListen = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  return (
    <div className="container">
      <h1>Mi Asistente</h1>
      <button onClick={handleListen}>Hablar</button>
      <button onClick={handlePrompt}>Enviar</button>
      <p>Transcripción: {transcript}</p>
      <p>Respuesta: {response}</p>
    </div>
  );
};

export default Assistant;
