import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Pause } from 'styled-icons/boxicons-regular/Pause';
import { Fullscreen, Settings, ArrowBack, FullscreenExit } from 'styled-icons/material';
import { Play, Captions, VolumeFull, VolumeLow, VolumeMute } from 'styled-icons/boxicons-regular';
import moment from 'moment';
import { useHistory } from 'react-router-dom'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

import theme from '../../theme';
import { MoviesList } from '../../molecules'

interface SubtitlesObj {
  language: string,
  url: string
}

interface QualitiesObj {
  quality: string
}

interface VideoPlayerProps {
  imdbID: String,
  subtitles: SubtitlesObj[],
  qualities: QualitiesObj[],
  startTime?: number 
}

const WATCH_MOVIE_MUTATION = gql`
  mutation($input: WatchMovieInput!) {
    watchMovie(input: $input) {
      id
      watchedMovies {
        ...MoviesListMovie
      }
    }
  }

  ${MoviesList.fragments.movie}
`

const Player = styled.div`
  position: relative;
  width: 100vw;
  width: 100%;
  height: 100vh;
  display: flex;
  cursor: none;
  align-items: center;
`;

const Video = styled.video`
  width: 100%;

  &::cue {
    opacity: 1;
    font-size: 20px !important;
  }
`;

const Controls = styled.div`
  position: absolute;
  top: 50px;
	bottom: 50px;
	left: 0;
  right: 0;
  width: 85%;
  margin: 0 auto;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BottomControlsContainer = styled.div`
  width: 100%;
`

const PlayerButtons = styled.div`
  display: inline-block;
  width: 100%;
`;

const PlayButton = styled(Play)`
  color: ${theme.colors.white};
  float: left;
  width: 50px;
  height: 50px;
  cursor: pointer;
    transition: transform 0.333s ease;
  &:hover {
    transform: scale(1.2);
  }
`;

const PauseButton = styled(Pause)`
  color: ${theme.colors.white};
  float: left;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: transform 0.333s ease;
  &:hover {
    transform: scale(1.2);
  }
`;

const VolumeFullIC = styled(VolumeFull)`
  color: ${theme.colors.white};
  width: 30px;
  height: 30px;
  float: right;
  transition: transform 0.333s ease;
`;

const VolumeLowIC = styled(VolumeLow)`
  color: ${theme.colors.white};
  width: 30px;
  height: 30px;
  float: right;
  transition: transform 0.333s ease;
`;

const VolumeMuteIC = styled(VolumeMute)`
  color: ${theme.colors.white};
  width: 30px;
  height: 30px;
  float: right;
  transition: transform 0.333s ease;
`;

const CaptionsButton = styled(Captions)`
  color: ${theme.colors.white};
  float: right;
  margin-right: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.333s ease;

  &:hover {
    transform: scale(1.2);
  }
`

const FullScreen = styled(Fullscreen)`
  color: ${theme.colors.white};
  float: right;
  margin-right: 5px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.333s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const FullscreenExitIC = styled(FullscreenExit)`
  color: ${theme.colors.white};
  float: right;
  margin-right: 5px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.333s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const SettingsButton = styled(Settings)`
  color: ${theme.colors.white};
  float: right;
  margin-right: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.333s ease;
  &:hover {
    transform: scale(1.2);
  }
`;

const LoadingBar = styled.div`
  width: 100%;
  height: 7px;
  background-color: ${theme.colors.thirdaryGrey};
  cursor: pointer;
`;

const BufferedProgress = styled.div`
  width: 0%;
  height: 7px;
  background-color: ${theme.colors.secondaryGrey}
  bottom: 31px;
  position: absolute;
  z-index: 1;
  cursor: pointer;
`;

const RedProgress = styled.div`
  background-color: ${theme.colors.primaryRed};
  height: 100%;
  width: 0%;
  height: 7px;
  bottom: 31px;
  z-index: 2;
  position: absolute;
  cursor: pointer;
`;

const ProgressText = styled.div`
  width: 100%;
`;

const PastMn = styled.span`
  float: left;
  margin-top: 10px;
  margin-left: 10px;
  color: ${theme.colors.white};
  font-size: ${theme.size.sm};
  font-family: ${theme.font.helveticaNeue};
`;

const RemainMn = styled.span`
  float: right;
  margin-top: 10px;
  margin-right: 10px;
  color: ${theme.colors.white};
  font-size: ${theme.size.sm};
  font-family: ${theme.font.helveticaNeue};
`;

const VolumeContainer = styled.div`
  height: 30px;
  width: 170px;
  float: right;
  margin-right: 10px;
  cursor: pointer;

  &:hover {
    svg {
      transform: scale(1.2);
    }
  }
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none; 
  appearance: none;
  width: 120px;
  height: 3px;
  background: ${theme.colors.white};
  outline: none; 
  margin-top: 15px;
  float: left;
  visibility: hidden;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: ${theme.colors.primaryRed};
    cursor: pointer;
  }
`;

const ExtraSettingsContainer = styled.div`
  width: 100%;
`;

const CaptionsContainer = styled.div`
  width: 30px;
  height: 100%;
  float: right;
  margin-right: 45px;
  visibility: hidden;
  position: relative;
  top: 20px;
  padding-bottom: 20px;
`;

const QualityContainer = styled.div`
  width: 50px;
  height: 100%;
  float: right;
  margin-right: 2px;
  visibility: hidden;
  position: relative;
  top: 20px;
  padding-bottom: 20px;
`;

const CCSelector = styled.button`
  color: ${theme.colors.white};
  width: 100%;
  background-color: transparent;
  margin-bottom: 5px;
  font-size: 12px;
  cursor: pointer;
  &:active,
  &:focus {
    outline: none;
  }
`;

const QualitySelector = styled.button`
  color: ${theme.colors.white};
  width: 100%;
  background-color: transparent;
  margin-bottom: 5px;
  font-size: 13px;
  cursor: pointer;
  &:active,
  &:focus {
    outline: none;
  }
`;

const QualitySelectorNull = styled.button`
  width: 100%;
  color: transparent;
  border: solid 1px transparent;
  background-color: transparent;
  margin-bottom: 5px;
  cursor: pointer;
  &:active,
  &:focus {
    outline: none;
  }
`;

const LoadingSpin = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
`;

const BackMessage = styled.p`
  opacity: 0;
  transition: opacity 0.333s ease;
  color: white;
  font-weight: bold;
  font-size: 28px;
  margin: 0 0 0 12px;
  position: relative;
  bottom: 2px;
`

const GoBackContainer = styled.div`
  position: relative;
  top: 25px;
  left: -15px;
  display: flex;
  align-items: center;

  &:hover {
    ${BackMessage} {
      opacity: 1;
    }
  }
`

const BackButton = styled(ArrowBack)`
  width: 60px;
  color: white;
  cursor: pointer;

  transition: transform 0.333s ease;

  &:hover {
    transform: scale(1.2);
  }
`

const VideoPlayer: React.FC<VideoPlayerProps> = ({ imdbID, subtitles, qualities, startTime }: VideoPlayerProps) => {
  const { goBack, location } = useHistory();
  const { t } = useTranslation();
  const videoPlayerRef = useRef(null);
  const redProgress = useRef(null);
  const totalProgress = useRef(null);
  const bufferedProgress = useRef(null);
  const controls = useRef(null);
  const volumeSlider = useRef(null);
  const ccContainer = useRef(null);
  const qualityContainer = useRef(null);
  const loadingSpin = useRef(null);
  const playerRef = useRef(null);
  const [isPause, setPause] = useState(0);
  const [current, setCurrent] = useState(startTime || 0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [cc, setCC] = useState(null);
  const [quality, setQuality] = useState('720p')
  const [hideControlsTimeoutId, setHideControlsTimeoutId] = useState(null);
  const [watchMovie] = useMutation(WATCH_MOVIE_MUTATION);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    setVolume(videoPlayerRef.current.volume);
    return () => {
      clearTimeout(hideControlsTimeoutId);
      document.removeEventListener("keydown", onKeyDown);
      if (videoPlayerRef.current.currentTime > 300)
        watchMovie({
          variables: {
            input: {
              imdbID,
              currentTime: parseInt(videoPlayerRef.current.currentTime, 10)
            }
          }
        })
    };
  }, [])

  const play = () => {
    setPause(0);
    return videoPlayerRef.current.play().catch(() => 'AUTOPLAY_POLICY_CATCH');
  }

  const pause = () => {
    setPause(1);
    return videoPlayerRef.current.pause();
  }

  const changeCurrentTimeHandler = () => {
    if (isNaN(duration))
      return ;
    const redBarPos = videoPlayerRef.current.currentTime / duration;
    redProgress.current.style.width = `${redBarPos * 100}%`;
    setCurrent(videoPlayerRef.current.currentTime);
  }

  const setFullScreen = () => {
    if (!document.fullscreenElement) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if (playerRef.current.msRequestFullscreen) {
          playerRef.current.msRequestFullscreen();
      } else if (playerRef.current.mozRequestFullScreen) {
          playerRef.current.mozRequestFullScreen();
      } else if (playerRef.current.webkitRequestFullscreen) {
          playerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  const setNewCurrentTimeHandler = (e:any) => {
    const percent = e.nativeEvent.offsetX / totalProgress.current.offsetWidth;
    videoPlayerRef.current.currentTime = percent * duration;
    redProgress.current.style.width = `${percent * 100}%`;
  }

  const onProgress = () => {
    if (videoPlayerRef.current.buffered.length) {
      const bufferPos = videoPlayerRef.current.buffered.end(videoPlayerRef.current.buffered.length - 1) / duration;

      bufferedProgress.current.style.width = bufferPos * 100 > 99
        ? `100%`
        : `${bufferPos * 100}%`;
    }
  }

  const hideControls = () => {
    playerRef.current.style.cursor = "initial";
    clearTimeout(hideControlsTimeoutId);

    setHideControlsTimeoutId(
        setTimeout(() => {
        if (controls && controls.current)
          controls.current.style.visibility = "hidden";
        if (playerRef && playerRef.current)
          playerRef.current.style.cursor = "none";
      }, 2000))
  }

  const incrementCurrentTime10 = () => {
    if (videoPlayerRef.current.currentTime + 10 < videoPlayerRef.current.duration)
      videoPlayerRef.current.currentTime += 10;
  }

  const decrementCurrentTime10 = () => {
    videoPlayerRef.current.currentTime -= 10;
  }

  const onKeyDown = (e:any) => {
    if (e.keyCode === 32)
      (videoPlayerRef.current.paused) ? play() : pause();
    if (e.keyCode === 37)
      decrementCurrentTime10();
    if (e.keyCode === 39)
      incrementCurrentTime10();
    if (e.keyCode === 70)
      setFullScreen();
  }


  const changeVolume = (e: any) => {
    setVolume(e.target.value / 100);
    videoPlayerRef.current.volume = e.target.value / 100;
  }

  const binaryVolume = () => {
    if (volume) {
      setVolume(0);
      videoPlayerRef.current.volume = 0;
    } else {
      setVolume(1);
      videoPlayerRef.current.volume = 1;
    }
  }

  const showRef = (ref: any) => {
    ref.current.style.visibility = "visible"

    if (ref.current.id === 'controls')
      hideControls();
  }

  const hideRef = (ref: any) => {
    ref.current.style.visibility = "hidden"
  }

  const changeQuality = (e:any) => {
    setQuality(e.target.name);
  }

  const onVideoLoadedMetaDataHandler = () => {
    videoPlayerRef.current.currentTime = current;
    
    setDuration(videoPlayerRef.current.duration);
  }
  
  const onCanPlay = () => {
    loadingSpin.current.style.visibility = "hidden";
    play();
  }

  const onCCSelectorClickHandler = (ev:any) => {
    const language = ev.currentTarget.getAttribute('data-language');
    
    Array.from(videoPlayerRef.current.textTracks).forEach((tt:any) => (tt.mode = "disabled"))

    if (language !== 'NO')
      videoPlayerRef.current.textTracks.getTrackById(language).mode = 'showing';

    setCC(language);
  }

  return (
    <Player ref={playerRef} onMouseEnter={ () => showRef(controls) } onMouseMove={ () => showRef(controls) } onMouseLeave={ hideControls }>
      <LoadingSpin src={`${process.env.REACT_APP_API_HOST}/static/loading.gif`} ref={ loadingSpin } />
      <Video
        onClick={ (isPause) ? play : pause }
        onProgress={ onProgress }
        key={ quality }
        onLoadedMetadata={onVideoLoadedMetaDataHandler}
        onPlay={ play }
        onPause={ pause }
        onTimeUpdate={ changeCurrentTimeHandler }
        onWaiting={ () => showRef(loadingSpin) }
        onCanPlay={ onCanPlay }
        ref={ videoPlayerRef }
        crossOrigin="anonymous">
        <source src={`http://localhost:4000/stream/${imdbID}/${quality}`}></source>
        {subtitles.map((cc: SubtitlesObj) => (
          <track key={`track-${cc.language}`} id={cc.language} src={cc.url} kind="subtitles" srcLang={cc.language} />
        ))}
        Your browser does not support HTML5 video.
      </Video>
      <Controls id="controls" ref={ controls }>
        <GoBackContainer>
          <BackButton onClick={goBack} />
          {location.state && (
            <BackMessage>
              {t('stream.goBack', { from: t(`stream.${location.state.from.includes('movie') ? 'movieDetails' : 'stream.search'}`) })}
            </BackMessage>
          )}
        </GoBackContainer>
        <BottomControlsContainer>
          <ExtraSettingsContainer>
            <CaptionsContainer
              onMouseOver={ () => showRef(ccContainer) }
              onMouseOut={ () => hideRef(ccContainer) }
              ref={ ccContainer }
              style={{ top: `${(5 - subtitles.length) * 20}px` }}>
              {[...subtitles, { language: 'NO' }].map((sub: SubtitlesObj) => (
                <CCSelector
                  key={sub.language}
                  data-language={sub.language}
                  onClick={onCCSelectorClickHandler}
                  disabled={cc === sub.language}>
                  {sub.language}
                </CCSelector>
              ))}
            </CaptionsContainer>
            <QualityContainer ref={qualityContainer} onMouseOver={ () => showRef(qualityContainer) } onMouseOut={ () => hideRef(qualityContainer) }>
              <QualitySelectorNull>0</QualitySelectorNull>
              <QualitySelectorNull>0</QualitySelectorNull>
              {
                qualities.map((quality: QualitiesObj, index: number) => {
                  return <QualitySelector key={ index } name={ quality.quality } onClick={ changeQuality }>{ quality.quality }</QualitySelector>
                })
              }
            </QualityContainer>
          </ExtraSettingsContainer>
          <PlayerButtons>
            {(isPause === 1) ? <PlayButton onClick={ play } /> : <PauseButton onClick={ pause } />}
            {(document.fullscreenElement) ? <FullscreenExitIC onClick={ setFullScreen } /> : <FullScreen onClick={ setFullScreen }/>}
            <CaptionsButton onMouseOver={ () => showRef(ccContainer) } onMouseOut={ () => hideRef(ccContainer) } />
            <SettingsButton onMouseOver={ () => showRef(qualityContainer) } onMouseOut={ () => hideRef(qualityContainer) }/>
            <VolumeContainer onMouseOver={ () => showRef(volumeSlider) } onMouseOut={ () => hideRef(volumeSlider) }>
              { (volume > 0.5) ? <VolumeFullIC onClick={ binaryVolume }/> : ((volume === 0) ? <VolumeMuteIC onClick={ binaryVolume }/> : <VolumeLowIC onClick={ binaryVolume }/> ) }
              <VolumeSlider ref={ volumeSlider } type="range" min="0" max="100" value={volume * 100} onChange={changeVolume} />
            </VolumeContainer>
          </PlayerButtons>
          <LoadingBar  ref={ totalProgress } onClick={ setNewCurrentTimeHandler }>
            <RedProgress ref={ redProgress }/>
            <BufferedProgress ref={ bufferedProgress } />
          </LoadingBar>
          <ProgressText>
            <PastMn>{ moment.utc(moment.duration(current, "seconds").asMilliseconds()).format("HH:mm:ss") }</PastMn>
            <RemainMn>-{ (moment.utc((moment.duration(duration, "seconds").asMilliseconds() - (moment.duration(current, "seconds").asMilliseconds()))).format("HH:mm:ss") !== 'Invalid date') ? moment.utc((moment.duration(duration, "seconds").asMilliseconds() - (moment.duration(current, "seconds").asMilliseconds()))).format("HH:mm:ss") : '00:00:00' }</RemainMn>
          </ProgressText>
        </BottomControlsContainer>
      </Controls>
    </Player>
  );
}

export default VideoPlayer;