import jwt from 'jsonwebtoken'
import neo4j from './neo4j'

const authMiddleware = async (req, res, next) => {
    const token = req.get('authorization');

    if (!token)
        return next();
    
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await neo4j.find('User', id);
    } catch(e) {
        console.log(e)
    }

    next();
}

export default authMiddleware;