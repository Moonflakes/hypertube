export const types = `
    type Person {
      nameID: String
      name: String
      img: String
    }

    type Subtitle {
      language: String
      url: String
    }

    type Torrent {
      quality: String
      seeds: Int
      peers: Int
      size: String
      magnet: String
      size_bytes: String
    }

    type Comment {
      createdAt: BigInt
      content: String
      user: User
    }

    type Movie {
        imdbID: String
        stars: [Person]
        writers: [Person]
        directors: [Person]
        title: String
        summary: String
        storyLine: String
        runTime: String
        imdbRating: String
        poster: String
        coverImg: String
        datePublished: String
        trailer: String
        subtitles: [Subtitle]
        torrents: [Torrent]
        paginationID: String
        comments: [Comment]
        genres: [String]
        currentUserTime: BigInt
        isFavorite: Boolean
        duration: String
    }

    type MovieCollection {
      lastImdbID: String
      lastPage: String
      startId: Int
      hasNext: Boolean
      movies: [Movie]
      person: Person
      genre: String
    }

    type TopRatedMovieCollection {
      lastImdbID: String
      hasNext: Boolean
      movies: [Movie]
    }

    input SearchInput {
      title: String
      releaseDate: [Int]
      userRating: [Int]
      genres: [String]
      sort: String
      startId: Int
    }

    input CommentMovieInput {
      imdbID: String!
      comment: String!
    }

    input MovieImdbIDInput {
      imdbID: String!
    }

    input WatchMovieInput {
      imdbID: String!
      currentTime: BigInt!
    }

    input TopRatedMoviesInput {
      lastImdbID: String
    }

    input RecentlyAddedMoviesInput {
      page: Int
    }

    input GetMoviesByTypeInput {
      type: String!
      value: String!
      lastImdbID: String
      lastPage: String
      startId: Int
    }
`;

export const queries = `
  getMovieByImdbID(imdbID: String!): Movie
  searchMovie(input: SearchInput!): [Movie]
  topRatedMovies(input: TopRatedMoviesInput): TopRatedMovieCollection
  recentlyAddedMovies(input: RecentlyAddedMoviesInput): [Movie]
  getMoviesByType(input: GetMoviesByTypeInput): MovieCollection
`

export const mutations = `
  commentMovie(input: CommentMovieInput!): Movie
  watchMovie(input: WatchMovieInput!): User
  addMovieToFavorites(input: MovieImdbIDInput!): User
  removeMovieToFavorites(input: MovieImdbIDInput!): User
`