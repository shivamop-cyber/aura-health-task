import React, { useState } from 'react';
import AudioAnalyser from 'react-audio-analyser';
import { getAudioProps, handleDownload } from '../utils';

const Recorder = () => {
  const [status, setStatus] = useState('');
  const [audioSrc, setAudioSrc] = useState(null);
  const [transcribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState(null);

  const controlAudio = (status) => {
    setStatus(status);
  };

  const audioProps = getAudioProps(
    status,
    audioSrc,
    setAudioSrc,
    setTranscribedText,
    setIsTranscribing
  );

  return (
    <div className='audioContainer'>
      <AudioAnalyser {...audioProps}>
        <div className='btn-box'>
          <button className='btn' onClick={() => controlAudio('recording')}>
            Start
          </button>
          <button className='btn' onClick={() => controlAudio('paused')}>
            Pause
          </button>
          <button className='btn' onClick={() => controlAudio('inactive')}>
            Stop
          </button>
          {status === 'inactive' && (
            <button
              className='btn'
              onClick={handleDownload.bind(this, audioSrc)}
            >
              Download Again
            </button>
          )}
        </div>
      </AudioAnalyser>
      <div className='transcribeContainer'>
        <div className='transcribe'>
          {transcribing === true && <p>Transcribing...</p>}
        </div>
        <div className='transcribe'>
          {transcribedText !== null && (
            <div>Your transcribed text: {transcribedText}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recorder;
