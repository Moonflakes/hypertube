module.exports = {
    imdbID: {
      type: 'string',
      primary: true
    },
    comments: {
        type: "relationships",
        target: "User",
        relationship: "COMMENT",
        direction: "IN",
        properties: {
            createdAt: {
                type: "integer",
                default: () => Date.now()
            },
            content: "string",
        },
        eager: true
    },
}