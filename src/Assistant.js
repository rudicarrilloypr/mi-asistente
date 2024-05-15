import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';
import { Configuration, OpenAIApi } from 'openai';

const Assistant = () => {
  const [response, setResponse] = useState('');
  const { speak } = useSpeechSynthesis();
  const { transcript, resetTranscript } = useSpeechRecognition();

  const configuration = new Configuration({
    apiKey: 'tu_clave_api', // Reemplaza con tu clave API
  });

  const openai = new OpenAIApi(configuration);

  const handlePrompt = async () => {
    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: transcript,
        max_tokens: 100,
      });

      const result = completion.data.choices[0].text.trim();
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
    <div>
      <button onClick={handleListen}>Hablar</button>
      <button onClick={handlePrompt}>Enviar</button>
      <p>Transcripción: {transcript}</p>
      <p>Respuesta: {response}</p>
    </div>
  );
};

export default Assistant;
