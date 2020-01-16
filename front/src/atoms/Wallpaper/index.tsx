import React, { useRef } from 'react';
import styled, { DefaultTheme } from 'styled-components'

interface WallpaperProps {
  theme?: DefaultTheme
  image?: string
  trailer?: string
}

const ContentStyle = styled.div`
  position: absolute;
  top: 10.5vw;
  left: 40px;
  width: 35%;
  z-index: 1;
  line-height: normal;

  @media screen and (max-width: 1000px) and (min-width: 0px) {
    left: 3vw;
  }
`;

const WallpaperStyle = styled.div`
    position: relative;
    min-height: 38vw;

    @media screen and (max-width: 680px) {
      display: flex;
      flex-direction: column;
      padding-top: 90px;

      ${ContentStyle} {
        position: initial;
        width: 100%;
        padding: 3vw;
      }
    }

    &::after {
      content: "";
      display: block;
      background: linear-gradient(90deg, rgba(0,0,0,1) 35%, rgba(192,192,192,0) 75%, rgba(192,192,192,0) 100%);
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;

      @media screen and (max-width: 680px) and (min-width: 0px) {
        display:none;
      }
    }
    
`;

const Video = styled.video`
    width: 100%;
    position: relative;
    top: -15px;
`

const Wallpaper = ({ children, image, trailer }: any) => {
  const trailerRef = useRef(null);

  return (
    <WallpaperStyle>
      <Video
          ref={trailerRef}
          src={trailer}
          poster={image}
          onCanPlay={() => trailerRef.current.play()}
          crossOrigin="anonymous" />
      <ContentStyle>{ children }</ContentStyle>
    </WallpaperStyle>
  )
}

export default Wallpaper;