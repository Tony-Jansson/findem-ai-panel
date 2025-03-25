import React, { useState, useEffect } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import IconButton from '@mui/material/IconButton';

export default function VoiceRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaRecorder]);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        let audioChunks = [];

        recorder.ondataavailable = (e) => {
          audioChunks.push(e.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          onRecordingComplete(audioBlob);
          audioChunks = [];
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    }
  };

  return (
    <IconButton
      color={isRecording ? 'secondary' : 'default'}
      onClick={toggleRecording}
      aria-label="record audio"
    >
      <MicIcon />
    </IconButton>
  );
}
