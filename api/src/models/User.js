module.exports = {
    id: {
      type: 'uuid',
      primary: true
    },
    avatar: {
        type: 'string',
        required: true
    },
    fortyTwoId: {
        type: 'string',
        unique: true
    },
    username: {
        type: 'string',
        unique: 'true',
        required: true
    },
    firstname: {
        type: 'string',
        required: true
    },
    lastname: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        unique: 'true',
        required: true,
        email: true,
    },
    password: {
        type: 'string'
    },
    watchedMovies: {
        type: "relationships",
        target: "Movie",
        relationship: "WATCH",
        direction: "out",
        properties: {
            createdAt: {
                type: "integer",
                default: () => Date.now()
            },
            currentTime: "integer",
        },
        eager: true
    },
    favoriteMovies: {
        type: "relationships",
        target: "Movie",
        relationship: "FAVORITE",
        direction: "out",
        properties: {
            createdAt: {
                type: "integer",
                default: () => Date.now()
            },
        },
        eager: true
    },
}