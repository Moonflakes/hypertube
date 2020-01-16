import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import Thumbnail from '../../atoms/Thumbnail';
import Typography from '../../atoms/Typography';
import styled, { DefaultTheme } from 'styled-components';
import { Star } from 'styled-icons/boxicons-solid/Star';
import { Link } from 'react-router-dom';

interface MoviesListProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  theme?: DefaultTheme
  listName: String
  listSrc: any[]
  variant: 'small' | 'normal' | 'big'
}

interface MovieListThumbnail {
  theme?: DefaultTheme
  variant: 'small' | 'normal' | 'big'
}

interface MovieListContainer extends MovieListThumbnail { }

const thumbnailStyle = {
  small: `
    // min-height: 241px;
    & ${ Thumbnail} {
      margin-right: 8px;
    }
  `,

  normal: `
    min-height: 241px;
    & ${ Thumbnail} {
      margin-right: 8px;
    }
  `,

  big: `
    // min-height: 241px;
    & ${ Thumbnail} {
      margin-right: 15px;
    }
  `
}

const paragraphStyle = {
  small: `
    & p {
      margin-bottom: 11px;
    }
  `,
  normal: `
    & p {
      margin-bottom: 11px;
    }
  `,
  big: `
    & p {
      margin-bottom: 31px;
    }
  `
}

const Cover = styled.div`
    width: 100%;
    height: 0;
    position: absolute;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    transition: all 0.4s;
    visibility: hidden;
    overflow-y: hidden;
`;

const MovieContainer = styled.div`
    height: 220px;
    position: relative;
    margin-right: 4px;

    @media screen and (max-width: 4000px) and (min-width: 1180px) {
      min-height: 330px;
    }
    @media screen and (max-width: 1180px) and (min-width: 790px) {
      min-height: 28vw;
    }
    @media screen and (max-width: 790px) and (min-width: 0px) {
      min-height: 0vw;
    }
    &:hover > ${Cover} {
        height: 50%;
        visibility: visible;
    }
`;

const Title = styled.div`
    width: 100%;
    height: 50%;
    text-align: center;
    display: table;
    padding: 0 5px;
    & span {
        display: table-cell;
        vertical-align: middle;
        color: white;
    }
`;

const DetailContainer = styled.div`
    width: 100%;
    height: 50%;
    display: flex;
    align-items: center;
`;

const LeftContainer = styled.div`
    width: 50%;
    float: left;
    text-align: center;
    & span {
        color: white;
    }
`;

const RightContainer = styled.div`
    width: 50%;
    float: right;
    text-align: center;
    & span {
        color: white;
    }
`;


const Rating = styled(Star)`
    color: white;
    width: 20px;
    height: 20px;
    padding-bottom: 2px;
`;

const MovieListThumbnail = styled.div<MovieListThumbnail>`
  display: flex;
  overflow-x: auto;
  padding-top: 50px;
  margin-top: -50px;
  padding-bottom: 50px;
  margin-bottom: -50px;
  padding-left: 24px;


  ::-webkit-scrollbar {
    display: none;
  }
  ${({ variant }: MovieListThumbnail) => thumbnailStyle[variant]}
`;

const MoviesListContainer = styled.div<MovieListContainer>`
  margin-bottom: 15px;
  ${({ variant }: MovieListContainer) => paragraphStyle[variant]}
`;

const MoviesList = ({ variant, listName, listSrc }: any) => {
  const [movieHoveredIndex, setMovieHoveredIndex] = useState(null);
  const arrayRef: any[] = [];

  useEffect(() => {
    window.addEventListener("resize", shadowHandler);
    shadowHandler();
    return () => window.removeEventListener("resize", shadowHandler);
  })

  const isInside = (bounding: any) => (bounding.right > (window.innerWidth || document.documentElement.clientWidth)) ? 0 : 1;

  const shadowHandler = () => {
    arrayRef.forEach((ref, index) => {
      const bounding = ref.getBoundingClientRect();
      if (!isInside(bounding))
        ref.style.opacity = "0.5";

      if (isInside(bounding))
        ref.style.opacity = "1";
      /* --- COMMENT THIS FOR OPACITY JUST IN THE LAST --- */

      if (isInside(bounding) && arrayRef[index + 1] && !isInside(arrayRef[index + 1].getBoundingClientRect()))
        ref.style.opacity = "0.5";

      /* --- END --- */
    });
  }

  return (
    <MoviesListContainer variant={variant} className="movies-list">
      <div>
        <Typography variant={2} >{listName}</Typography>
      </div>
      <MovieListThumbnail variant={variant} onScroll={shadowHandler} onMouseLeave={() => setMovieHoveredIndex(null)}>
        {
          listSrc.map((movie: any, index: any) => {
            return (
              <Link
                to={`/movie/${movie.imdbID}`}
                key={'link-' + index}
                onMouseEnter={() => setMovieHoveredIndex(index)}
                style={{
                  transition: "all 0.333s ease",
                  position: "relative",
                  left: movieHoveredIndex ? (index < movieHoveredIndex ? "-24px" : (index > movieHoveredIndex ? "24px" : "0px")) : "0px",
                  transform: `scale(${movieHoveredIndex === index ? '1.2' : '1'})`,
                  zIndex: movieHoveredIndex === index ? 1 : 0
                }} 
                >
                <MovieContainer key={'movieContainer-' + index}>
                  <Thumbnail key={'thumb-' + index} ref={(ref: any) => arrayRef[index] = ref} variant={variant} src={movie.poster} />
                  {
                    (movie.title) ?
                      (<Cover>
                        <Title key={'title-' + index}><span>{movie.title}</span></Title>
                        <DetailContainer key={'detailContainer-' + index}>
                          <LeftContainer key={'leftContainer-' + index}>
                            <span>{(movie.datePublished.trim().match(/\d{4}/)) ? (movie.datePublished.trim().match(/\d{4}/)[0]) : movie.datePublished}</span>
                          </LeftContainer>
                          <RightContainer key={'rightContainer-' + index}>
                            <span>{movie.imdbRating} </span><Rating />
                          </RightContainer>
                        </DetailContainer>
                      </Cover>) : null
                  }
                </MovieContainer>
              </Link>
            )
          })
        }
      </MovieListThumbnail>
    </MoviesListContainer>
  )
}

MoviesList.fragments = {
  movie: gql`
    fragment MoviesListMovie on Movie {
      imdbID
      title
      datePublished
      imdbRating
      poster
    }
  `
}

export default MoviesList;
