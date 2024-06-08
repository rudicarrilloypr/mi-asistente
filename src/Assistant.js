import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';
import { OpenAI } from 'openai';
import './index.css';  // Asegúrate de importar el archivo CSS

const Assistant = () => {
  const [response, setResponse] = useState('');
  const { speak } = useSpeechSynthesis();
  const { transcript, resetTranscript } = useSpeechRecognition();

  const openai = new OpenAI(process.env.REACT_APP_OPENAI_API_KEY);

  const handlePrompt = async () => {
    try {
      const completion = await openai.complete({
        engine: 'davinci',
        prompt: transcript,
        maxTokens: 100,
      });

      const result = completion.choices[0].text.trim();
      setResponse(result);
      speak({ text: result });
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
