import React, { useState, useRef } from 'react';
import VoiceRecorder from './VoiceRecorder';
import axios from 'axios';
import '../styles/Chat.css';

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const audioRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    try {
      const auth = {
        username: process.env.REACT_APP_USERNAME,
        password: process.env.REACT_APP_PASSWORD
      };

      const response = await axios.post('/api/chat', { message: input }, { auth });
      
      setMessages([...messages, 
        { text: input, from: 'user' },
        { text: response.data.response, from: 'ai' }
      ]);
      
      // Play audio response
      const audio = new Audio(`data:audio/mp3;base64,${response.data.audio}`);
      audioRef.current = audio;
      audio.play();
      
      setInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.from}`}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv eller prata..."
        />
        
        <div className="button-group">
          <VoiceRecorder 
            onRecordingComplete={async (audioBlob) => {
              const formData = new FormData();
              formData.append('audio', audioBlob, 'recording.webm');
              
              try {
                const response = await axios.post('/api/chat', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                  auth: {
                    username: process.env.REACT_APP_USERNAME,
                    password: process.env.REACT_APP_PASSWORD
                  }
                });
                
                setMessages([...messages, 
                  { text: response.data.text, from: 'user' },
                  { text: response.data.response, from: 'ai' }
                ]);
                
                const audio = new Audio(`data:audio/mp3;base64,${response.data.audio}`);
                audio.play();
              } catch (error) {
                console.error('Error:', error);
              }
            }}
          />
          <button type="submit">Skicka</button>
        </div>
      </form>
      
      <audio ref={audioRef} hidden />
    </div>
  );
}
