const jwt = require('jsonwebtoken')


// useing middleware in graphql is different. we never throw an exeption because we only have one route (/graphql) -> 
// -> and we will use this middleware on this one route. that is why if we want the user to access some data and not access some -> 
// -> other data, we have to use a different approch. here we add to the req some metadata in order to check later if the -> 
// -> user can access some data or not. But we always call next() and later we check if the user can get the data or not 
module.exports = (req ,res, next) =>{

    const authHeader = req.get('Authorization');
    if(!authHeader){
        req.isAuth = false; 
        return next();
    }

    // split the token from the word Bearer  
    const token = authHeader.split(' ')[1];
    if(!token || token === ''){
        req.isAuth = false; 
        return next();
    }
    try{
       decodedToken =  jwt.verify(token, 'somesupersecretkey');

    }catch(e){
        req.isAuth = false; 
        return next();
    }
    if(!decodedToken){
        req.isAuth = false; 
        return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}