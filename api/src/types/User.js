export const types = `
    type User implements Node {
        id: ID!
        username: String
        firstname: String
        lastname: String
        email: String
        avatar: String
        watchedMovies: [Movie]
        favoriteMovies: [Movie]
    }

    input SignupInput {
        firstname: String
        lastname: String
        email: String
        username: String
        password: String
        passwordConfirm: String
        avatar: String
    }

    input SigninInput {
        username: String
        password: String
    }

    input UsernameInput {
        username: String
    }

    input ResetMsgInput {
        email: String
    }

    input ResetPwdInput {
        newPassword: String
        passwordConfirm: String
        token: String
    }

    input UpdateUserInfosInput {
        name: String
        values: [String]
    }

    type JWT {
        accessToken: String
    }
`;

export const queries = `
    me: User
    getUserByUsername(input: UsernameInput!): User
`

export const mutations = `
    signup(input: SignupInput!): Boolean
    signin(input: SigninInput!): JWT
    resetMsg(input: ResetMsgInput!): Boolean
    resetPwd(input: ResetPwdInput!): Boolean
    updateUserInfos(input: UpdateUserInfosInput!): User
`