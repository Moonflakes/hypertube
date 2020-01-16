import { UserInputError, AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import imdbApi from '../imdbapi/parser';
import sendmail from '../mailer';


/**
 * QUERIES
 */

const me = async (_, args, { req: { user } }) => {
    if (!user)
        throw new AuthenticationError('UNAUTHENTICATED');

    return user.toJson();
};

const getUserByUsername = async (_, { input: { username }}, { neo4j }) => {
    try {
        const user = await neo4j.first('User', 'username', username);

        return user.toJson();
    } catch {
        return  null;
    }

};

/**
 * MUTATIONS
 */

const signup = async (_, { input }, { neo4j }) => {
    const { password, passwordConfirm } = input;

    if (!password || !password.length || !passwordConfirm || !passwordConfirm.length)
        throw new UserInputError('USER_INPUT_ERROR', {
            ...(!password || !password.length ? { password: 'any.empty' } : {}),
            ...(!passwordConfirm || !passwordConfirm.length ? { passwordConfirm: 'any.empty' } : {})
        })
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password))
        throw new UserInputError('USER_INPUT_ERROR', { password: 'any.password' })
    if (password !== passwordConfirm)
        throw new UserInputError('USER_INPUT_ERROR', { passwordConfirm: 'any.password-not-equal' })

    await neo4j.create('User', {
        ...input,
        password: bcrypt.hashSync(input.password, 10)
    });

    return (true);
}

const signin = async (_, { input }, { neo4j }) => {
    const user = await neo4j.first('User', 'username', input.username);

    if (!user) 
        throw new UserInputError('BAD_USER_CREDENTIAL', { 'warning': 'user-not-found' })
    if (!bcrypt.compareSync(input.password, user.get('password')))
        throw new UserInputError('BAD_USER_CREDENTIAL', { 'warning': 'password-invalid' })

    return {
        accessToken: jwt.sign({ id: user.get('id') }, process.env.JWT_SECRET),
    }
}

const resetMsg = async (_, { input }, { neo4j, req }) => {
    const user = await neo4j.first('User', 'email', input.email);

    const language = req.get('Accept-Language'); // fr-FR it-IT en-EN

    if (!user) 
        throw new UserInputError('BAD_USER_CREDENTIAL', { 'warning': 'user-not-found' })

    const token = jwt.sign({ id: user.get('id') }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    const variables = {
        email: input.email,
        url: `${process.env.FRONT_HOST}/reset?token=${token}`,
        language: language
    }
    sendmail(variables);

    return true;
}

function changePwdProcess(newPassword, passwordConfirm) {
    if (!newPassword || !newPassword.length || !passwordConfirm || !passwordConfirm.length)
        throw new UserInputError('USER_INPUT_ERROR', {
            ...(!newPassword || !newPassword.length ? { newPassword: 'any.empty' } : {}),
            ...(!passwordConfirm || !passwordConfirm.length ? { passwordConfirm: 'any.empty' } : {})
        })
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword))
        throw new UserInputError('USER_INPUT_ERROR', { newPassword: 'any.password' })
    if (newPassword !== passwordConfirm)
        throw new UserInputError('USER_INPUT_ERROR', { passwordConfirm: 'any.password-not-equal' })
    
    return (bcrypt.hashSync(newPassword, 10))
}

const resetPwd = async (_, { input }, { neo4j }) => {
    const { newPassword, passwordConfirm } = input;

    const cryptedPwd = changePwdProcess(newPassword, passwordConfirm);

    const verifToken = jwt.verify(input.token, process.env.JWT_SECRET);
    const user = await neo4j.first('User', 'id', verifToken.id);

    if (!user)
        throw new UserInputError('BAD_USER_CREDENTIAL', { 'warning': 'user-not-found' })
    
    await user.update({ password: cryptedPwd });

    return true;
}

const updateUserInfos = async (_, { input }, { neo4j, req: { user } }) => {
    const { name, values } = input; 
    const userExist = await neo4j.first('User', 'username', name);

    if (userExist)
        throw new UserInputError('USER_INPUT_ERROR', { username: 'any.unique' });

    if (!user)
        throw new AuthenticationError('UNAUTHENTICATED');

    if (name === "password") {
        values[0] = changePwdProcess(values[0], values[1]);
    }

    try {
        await user.update({ [name]: values[0] });
        return user.toJson();
    } catch (e) {
        if (e._joiError)
            throw new UserInputError('USER_INPUT_ERROR', e.details.reduce((p, { context: { key }, type }) => ({
                ...p,
                [key]: type
            }), {}))
        if (e.code && e.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
            const [[, field]] = [...e.message.matchAll(/property `(.*)`/gm)]

            throw new UserInputError('USER_INPUT_ERROR', { [field]: 'any.unique' });
        }
    } 
}

/**
 * TYPES
 */

const watchedMovies = async ({ id }, _, { neo4j }) => {
    try {
        const user = await neo4j.find('User', id);
        const watchRelations = await user.get('watchedMovies');

        return Promise.all(watchRelations.map(wr =>
            imdbApi.getMovie(wr.otherNode().get('imdbID'))));
    } catch {
        return [];
    }
}

const favoriteMovies = async ({ id }, _, { neo4j }) => {
    try {
        const user = await neo4j.find('User', id);
        const favoriteReleations = await user.get('favoriteMovies');
    
        return Promise.all(favoriteReleations.map(m => 
            imdbApi.getMovie(m.otherNode().get('imdbID'))));
    } catch (e) {
        return [];
    }
}

export default {
    queries: { me, getUserByUsername },
    mutations: { signup, signin, resetMsg, resetPwd, updateUserInfos },
    types: { watchedMovies, favoriteMovies }
}