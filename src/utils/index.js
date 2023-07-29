import axios from 'axios';

export const getAudioProps = (
  status,
  audioSrc,
  setAudioSrc,
  setTranscribedText,
  setIsTranscribing
) => {
  const audioProps = {
    audioType: 'audio/mp3',
    status,
    audioSrc,
    timeslice: 1000,
    startCallback: (e) => {
      setTranscribedText(null);
      setIsTranscribing(false);
      console.log('succ start', e);
    },
    pauseCallback: (e) => {
      console.log('succ pause', e);
    },
    stopCallback: async (e) => {
      setIsTranscribing(true);
      const audioUrl = window.URL.createObjectURL(e);

      setAudioSrc(audioUrl);
      handleDownload(audioUrl);
      try {
        const transcribedText = await sendAudioTranscriptionRequest(audioUrl);
        console.log(transcribedText);
        setIsTranscribing(false);
        setTranscribedText(transcribedText);
      } catch (err) {
        setIsTranscribing(false);
        setTranscribedText(`Transcription failed with error: ${err.message}`);
        console.log(err);
      }
      console.log('succ stop', e);
    },
    onRecordCallback: (e) => {
      console.log('recording', e);
    },
    errorCallback: (err) => {
      console.log('error', err);
    },
  };

  return audioProps;
};

export const handleDownload = (audioSrc) => {
  const link = document.createElement('a');
  link.href = audioSrc;
  link.download = 'recorded_audio.mp3';
  link.click();
};

export const sendAudioTranscriptionRequest = async (audioSrc) => {
  const OPENAI_API_KEY = process.env.REACT_APP_OPEN_AI_API_KEY;
  const TRANSCRIBE_URL = 'https://api.openai.com/v1/audio/transcriptions';

  const response = await fetch(audioSrc);
  const audioBlob = await response.blob();
  const audioFile = new File([audioBlob], 'recorded_audio.mp3', {
    type: 'audio/mp3',
  });

  console.log(audioFile);
  const MODEL = 'whisper-1';

  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('model', MODEL);

  try {
    const response = await axios.post(TRANSCRIBE_URL, formData, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.text;
  } catch (error) {
    throw new Error(error.message);
  }
};
