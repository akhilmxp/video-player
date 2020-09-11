import React, { Component } from 'react';
import './VideoPlayer.scss'

let FIRST_TIME_MUTED = false;
let FIRST_TIME_INTERACTED = false;

class VideoPlayer extends Component {

  state = {
    muted: false,
    paused: false,
    buffering: false,
  }

  updateBufferingState(value) {
    if (this.state.buffering !== value) {
      this.setState({ buffering: value })
    }
  }

  startMutedPlayer() {
    FIRST_TIME_MUTED = true
    this.setState({ muted: true })
    this.video.play()
  }

  checkFirstInteraction() {
    if (!FIRST_TIME_INTERACTED &&
      !FIRST_TIME_MUTED &&
      !this.state.muted &&
      this.props.autoPlay &&
      this.video.play
    ) {
      let promise = this.video.play()
      if (promise) {
        promise.catch((e) => {
          // console.log(e, e.name)
          // Check if error is for first time interaction not happened
          if (e && e.name === "NotAllowedError") {
            this.startMutedPlayer()
          }
        });
      }
    }
  }

  handleFirstInteractionClick = () => {
    FIRST_TIME_INTERACTED = true;
    FIRST_TIME_MUTED = false;
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
  }

  setVideoReference = (node) => {
    if (node) {
      this.video = node
      this.checkFirstInteraction();
    }
  }

  componentDidMount() {
    const { autoPlay } = this.props;

    // Show play icon in case auto play is not on
    if (!autoPlay) {
      this.setState({ paused: true })
    }
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
          {FIRST_TIME_MUTED &&
            <OverlayForUnmute onClick={this.handleFirstInteractionClick} />}

          {paused &&
            <PlayButton onClick={this.playPauseVideo} />}

          {!paused && buffering &&
            <SpinnerInCenter />}

          <video
            key={mp4Url}
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