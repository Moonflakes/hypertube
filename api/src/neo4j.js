import Neode from 'neode';
const {
    UserInputError,
} = require('apollo-server-express');

const instance = new Neode.fromEnv()
    .withDirectory(__dirname+'/models')

instance.schema.install();

instance.createOld = instance.create;
instance.create = async (model, data) => {
    try {
        return await instance.createOld(model, {...data})
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

export default instance;