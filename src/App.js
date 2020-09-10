import React from 'react';
import './App.css';
import VideoPlayer from './VideoPlayer'

const EXAMPLE_MP4_URL = "http://exit109.com/~dnn/clips/RW20seconds_1.mp4"//"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"//

function App() {

  const videoEnded = () => {
    console.log('video ended')
  }

  return (
    <div className="App">
      <VideoPlayer
        autoPlay={true} // boolean
        loop={true} // boolean, if true, videoEnd event doesn't trigger
        mp4Url={EXAMPLE_MP4_URL}
        onVideoEnd={videoEnded} />
    </div>
  );
}

export default App;
