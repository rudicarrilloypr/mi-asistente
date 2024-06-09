import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import './index.css';  // Asegúrate de importar el archivo CSS

const Assistant = () => {
  const [response, setResponse] = useState('');
  const { transcript, resetTranscript } = useSpeechRecognition();

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const handlePrompt = async () => {
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',
          prompt: transcript,
          max_tokens: 100,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
          }
        }
      );

      const result = res.data.choices[0].text.trim();
      setResponse(result);
      speak(result);
      resetTranscript();
    } catch (error) {
      console.error(error);
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
