import React from 'react';
import Recorder from './components/Recorder';
import './App.css';
import Navbar from './components/Navar';

const App = () => {
  return (
    <>
      <Navbar />
      <div className='container'>
        <Recorder />
      </div>
    </>
  );
};

export default App;
