import React, { Component } from 'react';
import './App.css';
import VideoPlayer from './VideoPlayer'

const EXAMPLE_MP4_URL = [
  "http://exit109.com/~dnn/clips/RW20seconds_1.mp4",
  "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
];

class App extends Component {

  state = {
    mp4UrlIndex: 0,
    showButton: false,
  };

  videoEnded = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        mp4UrlIndex: prevState.mp4UrlIndex ? 0 : 1
      }
    })
  }
  handlePlayVideosButtonClick = () => {
    this.setState({ showButton: false })
  }
  render() {

    // In case want to test video on load set the showButton to false in state variable 
    const { showButton } = this.state
    return (
      <div className="App">
        {showButton && <button type="button" onClick={this.handlePlayVideosButtonClick}>Click to play videos</button>}

        {!showButton && <VideoPlayer
          autoPlay={true} // boolean
          loop={false} // boolean, if true, videoEnd event doesn't trigger
          mp4Url={EXAMPLE_MP4_URL[this.state.mp4UrlIndex]}
          onVideoEnd={this.videoEnded} />}
      </div>
    );
  }
}

export default App;
