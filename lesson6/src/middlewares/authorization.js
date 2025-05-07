import { randomString } from "../config/common.config.js";

const parseString = (inputString) => {
    try {
        if (!inputString) {
            return null;
        }

        const parts = inputString.split('-$');
        
        if (parts.length < 4) {
            return null;
        }

        const id = parts[1].replace('$', '');
        const email = parts[2].replace('$', '');
        const secretkey = parts[3].replace('$', '');

        if (!id || !email || !secretkey) {
            return null;
        }

        return { id, email, secretkey };
    } catch (error) {
        return null;
    }
};



export const authorization = (req, res, next) => {
    const token = req.headers.authorization;
    const userInfo = parseString(token);

    if(!userInfo?.id || !userInfo?.email || !userInfo?.secretkey){
        return res.status(401).json({
            message: "unauthorized"
        })
    }

    if(userInfo.secretkey !== randomString){
        return res.status(401).json({
            message: "unauthorized"
        }) 
    }

    req.userInfo = userInfo;

    next()
}