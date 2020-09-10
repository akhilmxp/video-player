import React, { Component } from 'react';
import './VideoPlayer.scss'

let FIRSTTIME_MUTED = true;

class VideoPlayer extends Component {

  state = {
    muted: FIRSTTIME_MUTED,
    paused: false,
    buffering: false,
    // width: null,
    // height: null,
  }

  updateBufferingState(value) {
    if (this.state.buffering !== value) {
      this.setState({ buffering: value })
    }
  }

  handleFirstTimeInteraction = () => {
    FIRSTTIME_MUTED = false;
    if (this.state.muted) {
      this.setState({ muted: false })
    }
  }

  playPauseVideo = () => {
    const { video } = this;
    if (video) {
      let paused
      if (video.paused || video.ended) {
        video.play();
        paused = false
      } else {
        video.pause();
        paused = true
      }
      this.setState({ paused: paused })
    }
  }

  setLoading = () => {
    this.updateBufferingState(true);
  }

  unSetLoading = () => {
    this.updateBufferingState(false);
  }

  // if video loop is true, onVideoEnded doesn't get called
  handleVideoEnded = () => {
    const { onVideoEnd } = this.props;
    if (typeof onVideoEnd === 'function') {
      onVideoEnd();
    }
    this.setState({ paused: true })
  }

  setVideoReference = (node) => {
    if (node) {
      this.video = node
    }
  }

  componentDidMount() {
    const { autoPlay } = this.props;

    // Unset mute for first time play in case autoplay is off
    if (FIRSTTIME_MUTED && !autoPlay) {
      this.handleFirstTimeInteraction()
    }
    // Show play icon in cse auto play is not on
    if (!autoPlay) {
      this.setState({ paused: true })
    }

    // TODO: In case following way doesn't work,
    // will have to create a hooked component for window resize
    // this.setState({
    //   width: window.innerWidth,
    //   height: window.innerHeight
    // })
  }

  render() {
    const {
      autoPlay,
      loop,
      mp4Url
    } = this.props;

    const { paused,
      muted,
      buffering,
      // width,
      // height, 
    } = this.state;

    return (
      <div className="video-wrapper">
        {!mp4Url &&
          <div className="align-center">
            No video link to play
          </div>}

        {mp4Url && <>
          {FIRSTTIME_MUTED &&
            <OverlayForUnmute onClick={this.handleFirstTimeInteraction} />}

          {paused &&
            <PlayButton /*onClick={this.playPauseVideo}*/ />}

          {buffering &&
            <SpinnerInCenter />}

          <video
            className="video-player"
            ref={this.setVideoReference}
            // width={width}//"100%"
            // height={height}//"100%"
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            onWaiting={this.setLoading}
            onPlaying={this.unSetLoading}
            onClick={this.playPauseVideo}
            onEnded={this.handleVideoEnded}
          >
            {mp4Url && <source src={mp4Url}
              type="video/mp4"></source>}

            {/** In case want to add support for more other types,
             * those can be added below one by one before the no support message  */}

            {/** If video is not supported following message will be displayed */}
            No video support in this browser.
        </video>
        </>}
      </div>
    )
  }
}

const PlayButton = ({ onClick }) => {
  return (
    <div className="align-center">
      <button type="button"
        className="playbutton"
        onClick={onClick}></button>
    </div>
  )
}

const SpinnerInCenter = () => {
  return (<div className="align-center">
    <div className="spinner"></div>
  </div>)
}

const OverlayForUnmute = ({ onClick }) => {
  return (<div className="overlay"
    onClick={onClick}>
    <div className="align-center">Tap to unmute</div>
  </div>)
}

export default VideoPlayer;